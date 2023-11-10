import { ChromePicker } from "react-color";
import "./App.css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { drawLine } from "./utils/drawLine";
import { useDraw } from "./hooks/useDraw";
const socket = io("http://localhost:3001");

function App() {
  const [color, setColour] = useState("#955");
  const { canvasRef, onMouseDown, clear } = useDraw(createLine);

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d");

    socket.emit("client-ready");

    socket.on("get-canvas-state", () => {
      if (!canvasRef.current?.toDataURL()) return;
      socket.emit("canvas-state", canvasRef.current.toDataURL());
    });

    socket.on("canvas-state-from-server", (state) => {
      const img = new Image();
      img.src = state;
      img.onload = function () {
        context.drawImage(img, 0, 0);
      };
    });

    socket.on("draw-line", ({ prevPoint, currentPoint, color }) => {
      if (!context) return;
      drawLine({ prevPoint, currentPoint, context, color });
    });

    socket.on("clear", clear);

    return () => {
      socket.off("get-canvas-state");
      socket.off("canvas-state-from-server");
      socket.off("draw-line");
      socket.off("clear");
    };
  }, [canvasRef]);

  function createLine({ prevPoint, currentPoint, context }) {
    socket.emit("draw-line", { prevPoint, currentPoint, color });
    drawLine({ prevPoint, currentPoint, context, color });
  }

  return (
    <div className="flex flex-col">
      <div className="">
        <ChromePicker color={color} onChange={(e) => setColour(e.hex)} />
      </div>
      <button onClick={() => socket.emit("clear")} className="">
        Clear
      </button>
      <canvas ref={canvasRef} onMouseDown={onMouseDown} width={768} height={768} className="border border-black" />
    </div>
  );
}

export default App;
