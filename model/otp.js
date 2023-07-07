const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OtpSchema = new Schema({
    code: {
        type: String,
        default: "",
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    email: {
        type: String,
        trim: true,
        default: '',
    },
    countryCode: {
        type: String,
        trim: true,
    },
    expiredAt: {
        type: Date,
        default: new Date()
    },
    userId: { type: Schema.Types.ObjectId, ref: 'user' },
    // for auto deletion of code  
    // createdAt: { type:Date, default:Date.now,index:{ expires: 300}}
    
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});
const Otp = mongoose.model('Otp', OtpSchema);
module.exports = Otp;