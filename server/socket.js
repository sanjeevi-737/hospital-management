const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io = null;
const userSocketMap = new Map();

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.sub;
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;
    userSocketMap.set(userId, socket.id);

    socket.join(`user:${userId}`);

    socket.on("join", (room) => {
      if (room) {
        socket.join(room);
      }
    });

    socket.on("leave", (room) => {
      if (room) {
        socket.leave(room);
      }
    });

    socket.on("disconnect", () => {
      userSocketMap.delete(userId);
    });
  });

  return io;
}

function sendNotification(userId, notification) {
  if (!io) return;
  const socketId = userSocketMap.get(String(userId));
  if (socketId) {
    io.to(socketId).emit("notification", notification);
  }
}

function broadcastToHospital(hospitalId, event, data) {
  if (!io) return;
  io.to(`hospital:${hospitalId}`).emit(event, data);
}

module.exports = { initSocket, sendNotification, broadcastToHospital, userSocketMap };
