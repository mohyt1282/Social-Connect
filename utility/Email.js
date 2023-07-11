const config = require('config');
const nodemailer = require("nodemailer");
//sending email

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        // user: config.get('EMAIL_SERVICE').EMAIL,
        // pass: config.get('EMAIL_SERVICE').PASSWORD

        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
        // user : 'mohitapptunix1282@gmail.com',
        // pass : 'enwsitkvkbomugxw'
    //    user: 'mohitapptunix1282@gmail.com',
    //    pass:"1234" 
    },
    tls: {
        rejectUnauthorized: true
    }
});
// console.log('process.env.EMAIL_USERNAME: ', process.env.EMAIL_USERNAME);

const sendEmail = async (to, subject, message) => {
    //  console.log('to: ', to);
    //  console.log('process.env.EMAIL_USERNAME: ', process.env.EMAIL_USERNAME);
     let test = await transporter.sendMail({
        // from: config.get('EMAIL_SERVICE').EMAIL,
        
        // from: "mohitapptunix1282@gmail.com",
        from: process.env.EMAIL_USERNAME,
        to: to, // list of receivers
        subject: subject,
        text: message,
        html: message,
         // html body
    })
     console.log("sent email test",test);
    return test
}
module.exports = {
    sendEmail
}