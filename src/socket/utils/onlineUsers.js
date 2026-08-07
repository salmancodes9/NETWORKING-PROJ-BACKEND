const onlineUsers = new Map(); // userId -> socket.id

const addUser = (userId, socketId) => {
  onlineUsers.set(userId, socketId);
};

const removeUser = (userId) => {
  onlineUsers.delete(userId);
};

const getUserSocketId = (userId) => {
  return onlineUsers.get(userId);
};

module.exports = { addUser, removeUser, getUserSocketId };