const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
   
    userName: { type: String, default: "", trim: true },
    firstName: { type: String, default: "", trim: true },
    lastName: { type: String, default: "", trim: true, },
    email: { type: String, lowercase: true, index: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    countryCode: { type: String, trim: true },
    isEmailVerify: { type: Boolean, default: false },
    isPhoneVerify: { type: Boolean, default: false },
    isDeleted:{type: Boolean,default:false},
    password: { type: String, default: "", select: false },
    dob: { type: String, default: null },
    userAgent:{type:String, default:null}
    
   },
   {
    timestamps : true
 })

const userModel = mongoose.model('user',userSchema)

module.exports=userModel;
