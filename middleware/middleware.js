const jwt = require("jsonwebtoken");
const SECRET_KEY  ="NOTESAPI";
const Model=require("../model/index")
const messages = require("../utility/messages").MESSAGES;
const response= require("../utility/response")
const responseCode= require("../utility/responseCode")



const userAuth = async (req,res,next)=>{
  
    try{
      let token = req.headers['authorization'];
      
      if(token){
        token = token.split(" ")[1];
        let user = jwt.verify(token,SECRET_KEY);
        console.log(user);
        if(!user){
          return response.sendFailResponse(req, res , responseCode.UN_AUTHORIZED, process.lang.AUTH_TOKEN_MISSING)
        }
        let finduser = await Model.user.findOne({_id: user._id},{userAgent:req.headers['user-agent']})
        if(!finduser){
          return response.sendFailResponse(req, res, responseCode.UN_AUTHORIZED, process.lang.INVALID_TOKEN);
        }
        // let agent = await utility.comparePasswordUsingBcrypt(finduser.userAgent, user.userAgent);
        // if(!agent){
          // return response.sendFailResponse(req, res , responseCode.UN_AUTHORIZED, process.lang.UNAUTHORIZED_TOKEN)
        // }

        // console.log("----",finduser);
        req.user= finduser;

        
        
      }

    else{
            return response.sendFailResponse(req, res, responseCode.UN_AUTHORIZED, process.lang.INVALID_TOKEN);
     }

      
        
        next();
      }catch(error){
        console.log(error);
        return response.sendFailResponse(req, res, responseCode.UN_AUTHORIZED, process.lang.INVALID_TOKEN);
        }
      }



     



  module.exports = userAuth;
