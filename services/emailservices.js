const emailService = require("../utility/Email")
const moment = require("moment")
const config = require('config');


async function sendOtpEmail(email, firstName, code) {
    console.log("hello otp senddd")
    const subject = "Mecca Account verification";
    let html = 'Your One Time OTP is ' + code
    console.log('html: ', html);
    await emailService.sendEmail(email, subject, html)
}



async function sendEmailForAccountBlock(email, msg) {
    const subject = "Account Block";
    await emailService.sendEmail(email, subject, msg)
}

module.exports = {
    sendOtpEmail,
    sendEmailForAccountBlock
}
