const mongoose = require('mongoose');
const requestSchema = new mongoose.Schema({
    requestBy:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    requestTo:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    request_Status:{type:String, enum:["Accept",'Reject','Pending'],default:"Pending"},
    isDeleted:{type:Boolean, default:false},
    },
{
    timestamps : true
 }
)
const requestModel=mongoose.model('requests',requestSchema);
module.exports= requestModel;