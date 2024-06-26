const path = require("path"),
  http = require("http"),
  express = require("express"),
  socketIO = require("socket.io"),
  fs = require("fs");

const { generateMessage } = require("./utils/messageHelper"),
  { isRealString } = require("./utils/validationHelper"),
  { Users } = require("./utils/users");

const picPath = path.join(__dirname, "./../public");

const PORT = process.env.PORT || 3000,
  app = express(),
  server = http.createServer(app),
  io = socketIO(server);

const users = new Users();

app.use(express.static(picPath));

io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("Name and room name are required.");
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit("updateUserList", users.getUserList(params.room));
    socket.emit("newMessage", generateMessage("Admin", "Talk Cock!"));
    socket.broadcast
      .to(params.room)
      .emit(
        "newMessage",
        generateMessage("(admin): ", `${params.name} has joined.`)
      );
    console.log(params.room);
    callback();
  });

  socket.on("createMessage", (message, callback) => {
    const user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit(
        "newMessage",
        generateMessage(user.name, message.text)
      );
      console.log(message.text);
    }

    callback();
  });

  socket.on("disconnect", () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit(generateMessage("Admin", `${user.name} has left.`));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
