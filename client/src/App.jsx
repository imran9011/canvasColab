import { ChromePicker } from "react-color";
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
    <div className="flex sm:flex-col md:flex-row bg-gray-100 bg-repeat-10 justify-center items-center gap-5 min-h-screen min-w-screen">
      <canvas className="border bg-white border-black" ref={canvasRef} onMouseDown={onMouseDown} width={800} height={600} />
      <div className="flex flex-col items-center gap-10 sm:gap-5">
        <div className="flex text-gray-600">
          <svg viewBox="0 0 64 64" fill="currentColor" height="2em" width="2em">
            <path fill="none" stroke="currentColor" strokeMiterlimit={10} strokeWidth={2} d="M30 42l-4 4-8-8 4-4L62 1l1 1zM22 34l8 8" />
            <path fill="none" stroke="currentColor" strokeMiterlimit={10} strokeWidth={2} d="M26 46S18 63 1 63c0 0 2.752-16.314 9-21 4-3 8-4 8-4" />
          </svg>
          <h1 className="text-3xl -ml-3">canvasColab</h1>
        </div>
        <ChromePicker color={color} onChange={(e) => setColour(e.hex)} />
        <button onClick={() => socket.emit("clear")} className="bg-white rounded-md p-3 border border-gray-700">
          Clear
        </button>
      </div>
    </div>
  );
}

export default App;
