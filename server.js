const app = require('./app');
const http = require('http');


var server = http.createServer(app);
const io = require("socket.io")(server, {
    transports: ["polling"],
    cors: {
      origin: "*",
    },
  });
  ////////////admin+main+end/////////////
  
  io.on("connection", (socket) => {
    console.log("A user is connected");
  
    socket.on("update", (data) => {
      console.log("data", data);
      socket.broadcast.emit("data_shown", data);
    });
    socket.on("addpatient", (data) => {
      console.log("addpatient", data);
      socket.broadcast.emit("email_accept", data);
    });
    socket.on("decline", (data) => {
      console.log("decline", data);
      socket.broadcast.emit("email_decline", data);
    });
  });

  server.listen(process.env.PORT);