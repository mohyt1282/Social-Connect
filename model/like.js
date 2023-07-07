const mongoose = require('mongoose');
const likeSchema = new mongoose.Schema({
    
    PostId:{type:mongoose.Schema.Types.ObjectId, ref:'post'},
    UserId:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    key:{type:String,enum:["like","dislike"," "],default:" "},
    

},
{
    timestamps : true
 }
)
const likeModel=mongoose.model('like',likeSchema);
module.exports= likeModel;