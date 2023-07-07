const Model = require('../model/index')
const moment = require('moment');
const mongoose = require('mongoose');
const emailService = require('../services/emailservices')


async function generatePhoneOtp(phone,admin, otpCode = '1234', expiredAt = moment().add(10, 'minutes').toDate()) {
    
    await Model.otp.deleteMany({
    phone: phone,
    
});
let data = {
    phone: phone,
    code: otpCode,
    expiredAt: expiredAt
}
if (admin) {
    data.adminId = admin._id 
}

let otp = await Model.otp.create(data);


return otp;
}
async function generateuserPhoneOtp(phone,user, otpCode = '1234', expiredAt = moment().add(10, 'minutes').toDate()) {
    
    await Model.otp.deleteMany({
    phone: phone,
    
}); 
let data = {
    phone: phone,
    code: otpCode,
    expiredAt: expiredAt
}
if (user) {
    data.userId = user._id 
}

let otp = await Model.otp.create(data);


return otp;
}

async function generateEmailVerification(email, user, code = '1234', expiredAt = moment().add(60, 'minutes').toDate()) {

    // console.log('email: ', email);
    email = email.toLowerCase()
    await Model.otp.deleteMany({
        email: email,
    }); //Clear Old Send otp message
    let data = {
        email: email,
        code: code,
        expiredAt: expiredAt
    }
    if (!data.code) {
        
        data.code = '1234'
    }
    if (user) {
        data.userId = user._id
    }
    let otp = await Model.otp.create(data);
     if (user) {
        await emailService.sendOtpEmail(email, user.firstName, otp.code);
    } else {
        await emailService.sendOtpEmail(email, "", otp.code);
    }
      return otp;
}

async function verifyEmailCode(email, code, removeOtp = true) {
    return await verifyPhoneOtp(null, email, code, removeOtp, true);
}

async function  verifyPhoneOtp(countryCode, key, otpCode, removeOtp = true, isForEmail = false, userId) {
    
    let qry = {
        code: otpCode,
        expiredAt: {
            $gte: new Date()
        }
    }
    if (isForEmail) {
        qry.email = key.toLowerCase();
    } else {
        qry.phone = key;
    }
    
    if (userId) {
        qry.userId = mongoose.Types.ObjectId(userId)
    }
    
    let Otp = await Model.otp.findOne(qry, { _id: 1 })
     console.log('otp: ', Otp);
    if (Otp && removeOtp) {
        // Otp.remove();
    
    }
    return Otp;
}



module.exports = {
    generatePhoneOtp,
    generateEmailVerification,
    verifyPhoneOtp,
    verifyEmailCode,
    generateuserPhoneOtp,
}