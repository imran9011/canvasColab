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
  socket.on("draw-line", ({ prevPoint, currentPoint, color }) => {
    socket.broadcast.emit("draw-line", { prevPoint, currentPoint, color });
  });
});

server.listen(3001, () => {
  console.log("listening on port 3001");
});
