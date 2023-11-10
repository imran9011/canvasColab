const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

import { Server } from "socket.io";

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
