const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    
    postId:{type:mongoose.Schema.Types.ObjectId, ref:'post'},
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    comment:{type:String},
    isDeleted:{type:Boolean, default:false}
},
{
    timestamps : true
 }
)
const commentModel=mongoose.model('Comment',commentSchema);
module.exports= commentModel;