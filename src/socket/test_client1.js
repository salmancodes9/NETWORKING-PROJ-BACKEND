// test-client2.js
const { io } = require("socket.io-client");

const socket = io("http://localhost:3000", {
  auth: {
token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJzYWxtYW5AZ21haWwuY29tIiwiaWF0IjoxNzg2MTA1NjQ3LCJleHAiOjE3ODYxMjAwNDd9.t6H8KueiG0nVE_9Fc_1ZTL7naf5Sk2pumt7jJoEAODI"}
});

socket.on("connect", () => {
  console.log("User 1 connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("Connection failed:", err.message);
});