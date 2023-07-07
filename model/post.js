const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    posturl:{type:String},
    isDeleted:{type:Boolean, default:false},
    },
{
    timestamps : true
 }
)
const postModel=mongoose.model('post',postSchema);
module.exports= postModel;