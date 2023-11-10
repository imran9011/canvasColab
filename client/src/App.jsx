import { ChromePicker } from "react-color";
import "./App.css";
import { useState } from "react";
import { io } from "socket.io-client";
import { drawLine } from "./utils/drawLine";
const socket = io("http://localhost:3001");

function App() {
  const [color, setColour] = useState("#955");

  function createLine({ prevPoint, currentPoint, context }) {
    socket.emit("draw-line", { prevPoint, currentPoint, color });
    drawLine({ prevPoint, currentPoint, context, color });
  }

  return (
    <div>
      <h1 className="text-3xl bg-blue-500 font-bold underline">Hello world!</h1>
      <ChromePicker color={colour} onChange={(e) => setColour(e.hex)} />
    </div>
  );
}

export default App;
