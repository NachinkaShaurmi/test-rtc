const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cors());

// Create rooms map (database replacement)
const rooms = new Map();

app.post("/rooms", (req, res) => {
  const { roomId } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ["users", new Map()],
        ["messages", []],
      ])
    );
  }
  res.send();
});

// Socket event listener

io.on("connection", (socket) => {
  socket.on("ROOM:JOIN", ({ roomId, userName }) => {
    socket.join(roomId);
    rooms.get(roomId).get("users").set(socket.id, userName);
    const users = [...rooms.get(roomId).get("users").values()];
    io.in(roomId).emit("ROOM:SET_USERS", users);
  });

  socket.on("ROOM:NEW_MESSAGE", ({ roomId, userName, text, date }) => {
    const messageInfo = {
      userName,
      text,
      date,
    };
    rooms.get(roomId).get("messages").push(messageInfo);
    io.in(roomId).emit("ROOM:NEW_MESSAGE", messageInfo);
  });

  socket.on("disconnect", () => {
    rooms.forEach((value, roomId) => {
      if (value.get("users").delete(socket.id)) {
        const users = [...value.get("users").values()];
        io.in(roomId).emit("ROOM:SET_USERS", users);
      }
    });
  });

  console.log("user connected", socket.id);
});

server.listen(8080, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log("start");
});
