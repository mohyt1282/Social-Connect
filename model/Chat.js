const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema({
    // user:{type:String},
    SenderId:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    ReciverId:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    ConnectionId:{type:mongoose.Schema.Types.ObjectId, ref:'request'},
    Message:{type:String},
    Type:{type:String,enum:["text",'audio',"video "],default:""},
    isDeleted:{type:Boolean, default:false}

},
{
    timestamps : true
 }
)
const chatModel=mongoose.model('Chat',chatSchema);
module.exports= chatModel;