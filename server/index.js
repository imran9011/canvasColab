const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("client-ready", () => {
    socket.broadcast.emit("get-canvas-state");
  });

  socket.on("canvas-state", (state) => {
    socket.broadcast.emit("canvas-state-from-server", state);
  });

  socket.on("draw-line", ({ prevPoint, currentPoint, color }) => {
    socket.broadcast.emit("draw-line", { prevPoint, currentPoint, color });
  });
  socket.on("clear", () => io.emit("clear"));
});

server.listen(3001, () => {
  console.log("listening on port 3001");
});
