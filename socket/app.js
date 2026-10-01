
import { Server } from "socket.io";
import "dotenv/config";
const PORT = process.env.PORT || 4000;
const io = new Server({
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExists = onlineUser.find(
    (user) => user.userId === userId
  );

  if (!userExists) {
    onlineUser.push({
      userId,
      socketId,
    });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter(
    (user) => user.socketId !== socketId
  );
};

const getUser = (userId) => {
  return onlineUser.find(
    (user) => user.userId === userId
  );
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);

    if (!receiver) {
      return;
    }

    io.to(receiver.socketId).emit("getMessage", data);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen(PORT);

console.log(`Socket server running on port ${PORT}`);
