const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')



module.exports={
    isEmail : (value)=>{
        let  re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(String(value).toLowerCase());
    },
    isPhone : (value) => {
        let intRegex = /[0-9 -()+]+$/;
        return intRegex.test(value)
     },
     jwtVerify: async (token) => {
        return jwt.verify(token,  config.get("jwtOption.jwtSecretKey"));
    },
    hashPasswordUsingBcrypt: async (plainTextPassword) => {
        return bcrypt.hashSync(plainTextPassword, 10);
    },
    comparePasswordUsingBcrypt: async (pass, hash) => {
        return bcrypt.compareSync(pass, hash)
    },
    jwtSign: async (payload) => {
        try {
            return jwt.sign(payload, config.get("jwtOption.jwtSecretKey"), { expiresIn: config.get("jwtOption.expiresIn") });
        } catch (error) {
            throw error;
        }
    }


}