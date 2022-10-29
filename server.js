const app = require('./app');
const http = require('http');


var server = http.createServer(app);
const io = require("socket.io")(server, {
  transports: ["polling","websocket"],
  cors: {
    origin: "*",
   
  },
 
});

io.on("connection", (socket) => {
  console.log("A user is connected");

  socket.on("update", (data) => {
    socket.broadcast.emit("data_shown", data);
  });
  socket.on("addpatient", (data) => {
    socket.broadcast.emit("email_accept", data);
  });
  socket.on("decline", (data) => {
    socket.broadcast.emit("email_decline", data);
  });
  socket.on('nurse',(data)=>{
    socket.broadcast.emit("displaynurse", data);
    // socket.destroy();
  })
  socket.on('doctor',(data)=>{
    socket.broadcast.emit("displaydoctor", data);
    // socket.destroy();
  })
  socket.on("delete",(data)=>{
    socket.broadcast.emit("deletedata",data)
    // socket.destroy();
  })
  socket.on("Updated",(data)=>{
    socket.broadcast.emit("Updateddata",data)
    // socket.destroy();
  })

  socket.on("deleteN",(data)=>{
    socket.broadcast.emit("deletedataN",data)
    // socket.destroy();
  })
  socket.on("UpdateN",(data)=>{
    socket.broadcast.emit("UpdateddataN",data)
    // socket.destroy();
  })

  socket.on("deleteA",(data)=>{
    socket.broadcast.emit("deletedataA",data)
    // socket.destroy();
  })
  socket.on("UpdateA",(data)=>{
    socket.broadcast.emit("UpdateddataA",data)
    // socket.destroy();
  })

  socket.on('adminstaff',(data)=>{
    socket.broadcast.emit("displayadmin", data);
    // socket.destroy();
    // socket.disconnect()
  })

  // socket.on('disconnect', () => {
  //   console.log(`socket disconnected`);

  // })
});
  // io.on("connection", (socket) => {
  //   console.log("A user is connected");
  
  //   socket.on("update", (data) => {
  //     console.log("data", data);
  //     socket.broadcast.emit("data_shown", data);
  //   });
  //   socket.on("addpatient", (data) => {
  //     console.log("addpatient", data);
  //     socket.broadcast.emit("email_accept", data);
  //   });
  //   socket.on("decline", (data) => {
  //     console.log("decline", data);
  //     socket.broadcast.emit("email_decline", data);
  //   });
  //   socket.on('disconnect', () => {
  //    console.log(`socket disconnected`);
  //   })
      
  // });


  server.listen(5001);

