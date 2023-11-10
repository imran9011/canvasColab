import { ChromePicker } from "react-color";
import "./App.css";
import { useState } from "react";
import { io } from "socket.io-client";

function App() {
  const [colour, setColour] = useState("#955");
  return (
    <div>
      <h1 className="text-3xl bg-blue-500 font-bold underline">Hello world!</h1>
      <ChromePicker color={colour} onChange={(e) => setColour(e.hex)} />
    </div>
  );
}

export default App;
