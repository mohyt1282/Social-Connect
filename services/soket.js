const express = require('express')
const server = require('socket.io')
const io = server();
const jwt = require('jsonwebtoken')
const SECRET_KEY = "NOTESAPI";
const chatService = require('./chatServices')
var users = {};
var usersSockets = {};
var TokenVerify ={};
var tokenId={}

io.use(async(socket,next)=>{
    
    try{
        
        
    const token = socket.handshake.query?.token
    
        if(!token){
            console.log("Enter Token in Query");
        }
        else{
            TokenVerify = await jwt.verify(token, SECRET_KEY )
            tokenId=TokenVerify.id
            // console.log(TokenVerify._id)
            socket.users = TokenVerify
            // console.log(TokenVerify)
            users[String(socket.id)] = TokenVerify._id;
      // users[String(socket.id)] = decoded.email;
      usersSockets[TokenVerify._id] = socket;
    //   console.log("Connected socket", TokenVerify._id);
      socket.join(String(TokenVerify._id));
            console.log('Authenticated')
            next();
        }
    }catch(error){
        console.log("error here",error)
    }
}).on("connection", function (socket) {
      // console.log("hhfhfhfhfhfhfhfhfh");
    // one to one chat sockets
    socket.on("connectToChat", async (data) => {
        // console.log("data",data)
      // console.log("Connect to chat", data.ConnectionId);
      const user = users[String(socket.id)];
      let roomId = "chat_" + data.ConnectionId;
      // console.log("roomId>", roomId);
      socket.join(roomId);
       console.log('roomId: ', roomId);
      io.to(roomId).emit("connectToChatOk", { status: 200, message: "Room successfully joined" });
    });
  
    socket.on("sendMessage", async (data) => {
        // console.log(data);
        let user = users[String(socket.id)];
        //console.log("user ", JSON.stringify(user));
        let roomId = "chat_" + data.ConnectionId;
        // console.log('roomId: ', roomId);
        let message = await chatService.sendMessage(data, user); 
        // console.log('message: ', message);
        if (!message) {
          return;
        }
        console.log('roomId:==== ', roomId);
        // console.log('message: =======', message);
        // io.to(roomId).emit("receiveMessage", message);
        socket.join(roomId);
        io.to(roomId).emit("receiveMessage", message);
      });
      
      socket.on("disconnect", () => {
        console.log("Disconnected:");
      });


})

exports.io = io

// alternate code for connecting socket

// io.on('connection',(socket)=>{//socket === client
//     // console.log('user connected',socket.id)
   
   
//     socket.on("sendMessage", async (data)=>{
//         // console.log("dATAA",data);
//         // user = String(TokenVerify._id) if we want to extract id from token

//         // console.log('user:------ ', user);
//         let message = await chatServices.sendMessage(data);
//         // console.log("message",message)
//         // console.log("senderId",tokenId)
//         // console.log("reciverId",data.ReciverId)
//         io.to(data.SenderId).emit("receiveMessage", message);
//         io.to(data.ReciverId).emit("receiveMessage", message);

//     })
//     socket.on("user disconnected",()=>{
//         console.log(" ---------disconnect--------")
//     })
// });








