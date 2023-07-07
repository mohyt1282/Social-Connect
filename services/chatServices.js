const Model=require("../model/index");
const mongoose = require("mongoose");

async function sendMessage(data,user){
    
    // console.log(data)
    // data.SenderId=user.id
    data.text=data.message
    let message=await Model.chat.create(data);
    // console.log("=====",message);
    return message;
}
// async function receiveMessage(data){
//     data.test= data.message
//     let message = await chatModel.create(data);
//     console.log(message);
//     return message;
    
    
// }

module.exports={
    sendMessage
}