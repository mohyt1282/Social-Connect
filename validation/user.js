const joi = require('joi')

const validateSchema = async (inputs, schema) => {
    try {
        const { error, value } = schema.validate(inputs);
        if (error) throw error.details ? error.details[0].message.replace(/['"]+/g, "") : "";
        else return false;
    } catch (error) {
        throw error;
    }
};
const validateLogIn = async (req, property = "body") => {
    
    let schema = {};
    schema = joi.object().keys({
        key: joi.string().required(),
        countryCode: joi.string().optional(),
        password: joi.string().required()
       
    });
    
    return await validateSchema(req[property], schema);
    
};




const validateSignUp = async (req, property = 'body') => {
    let schema = {}
    schema = joi.object().keys({
        
       key: joi.string().required(),
       password: joi.string().required(),
        
       
    });
    return await validateSchema(req[property], schema);
};
const validateVerifyOtp = async (req, property = "body") => {
    let schema = {};
    schema = joi.object().keys({
        key: joi.string().required(),
        code: joi.string().required(),
        countryCode: joi.string().optional(),
    });
    return await validateSchema(req[property], schema);
};

const validateProfileUpdate = async (req, property = "body") => { 
    let schema = joi.object().keys({
        email: joi.string().optional(),
        phone: joi.string().optional(),
        firstName: joi.string().optional(),
        lastName: joi.string().optional(),
        userName: joi.string().optional(),
        countryCode: joi.string().optional(),
        state: joi.string().allow('', null).optional(),
        dob: joi.string().optional(),
    });
    return await validateSchema(req[property], schema);
};
const validateChangePassword = async (req, property = 'body') => {
     let  schema = joi.object().keys({
            oldPassword: joi.string().required(),
            password: joi.string().required()
        });
    
    return await validateSchema(req[property], schema);

}
const validateSetPassword=async(req,property='body')=>{
    let schema = joi.object().keys({
        password:joi.string().required()
        
    })
    return await validateSchema(req[property], schema);
}
const validateForgetPassword= async(req,property='body')=>{
    let schema = joi.object().keys({
        key:joi.string().required()
    });
    return await validateSchema(req[property], schema);
}

const validateComment = async(req,property='body')=>{
    let schema = joi.object().keys({
        comment:joi.string().required()
    });
    return await validateSchema(req[property], schema);
}

const VerifyLike = async(req,property='body')=>{
    let schema = joi.object().keys({
        key:joi.string().required()
    });
    return await validateSchema(req[property], schema);
}



const VerifySendRequest = async(req,property='body')=>{
    let schema = joi.object().keys({
        requestTo:joi.string().required()
    });
    return await validateSchema(req[property], schema);
}

const VerifyrespondRequest = async(req,property='body')=>{
    let schema = joi.object().keys({
        // requestSenderId:joi.string().required(),
        request_Status:joi.string().required()
    });
    return await validateSchema(req[property], schema);
}



module.exports = {
    validateLogIn,
    validateSignUp, 
    validateVerifyOtp,
    validateProfileUpdate,
    validateChangePassword,
    validateSetPassword,
    validateForgetPassword,
    validateComment,
    VerifyLike,
    VerifySendRequest,
    VerifyrespondRequest
    }


