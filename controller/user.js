const mongoose = require('mongoose')
const validation = require('../validation/index')
const services = require('../services/index')
const response = require("../utility/response")
const responseCode = require('../utility/responseCode')
const CsvParser = require('json2csv').Parser;
const Model = require("../model/index")
async function siginup(req, res, next) {
    try {
        await validation.user.validateSignUp(req);

        let user = await services.user.siginup(req.body,req);


        return response.sendSuccessResponse(req, res, user, responseCode.CREATED, process.lang.SEND_SUCCESSFULLY);
    } catch (error) {
        next(error)

    }

}

const verifyOtp= async (req, res, next) =>{
    try {
        await validation.user.validateVerifyOtp(req);
        let data = await services.user.verifyOTP(req.body,req);
         return response.sendSuccessResponse(req, res,data, responseCode.OK,process.lang.SUCCESS);
            
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        await validation.user.validateLogIn(req)
        let data = await services.user.login(req.body)
        return response.sendSuccessResponse(req, res, data, responseCode.CREATED, process.lang.FETCH_SUCCESSFULLY)
    } catch (error) {
        next(error)
    }
}

async function updateprofile(req, res, next) {
    try {
        await validation.user.validateProfileUpdate(req);
        let data = await services.user.updateprofile(req.body,req.user);
        return response.sendSuccessResponse(req, res, data, responseCode.OK, process.lang.UPDATED_SUCCESSFULLY);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function forgotPassword(req,res,next){
    try {
        await validation.user.validateForgetPassword(req);
        let data =await services.user.forgotPassword(req.body);
        return response.sendSuccessResponse(req, res, data, responseCode.OK, process.lang.OTP_SEND);
    } catch (error) {
        next(error)
        
    }
}
async function setPassword(req,res,next){
    try {
        await validation.user.validateSetPassword(req);
        let user = await services.user.setPassword(req.body,req.user);
        return response.sendSuccessResponse(req, res, user, responseCode.OK, process.lang.CHANGE_SUCCESSFULLY);
    } catch (error) {
        next(error)
        
    }
    
}
async function resetPassword(req, res, next) {
    try {
        await validation.user.validateChangePassword(req);
        
         let data = await services.user.resetPassword(req.body , req.user);
        return response.sendSuccessResponse(req, res, data, responseCode.OK, process.lang.CHANGE_PASSWORD);
    } catch (error) {
        next(error);
    }
}

async function exportUser(req,res,next){
    try {
        
        let users=[]  // array where all data would be pushed
        let userData= await Model.user.find({})
        
        
        userData.forEach((user)=>{
            const {_id , firstName,lastName,phone,email,password,createdAt} = user
            users.push({_id , firstName,lastName,phone,email,password,createdAt})                        // pushing data to user
        });
    
        const csvFields = [ 'ID', 'firstName','lastName','phone','email','password','createdAt']
        const csvParser = new CsvParser({csvFields})
        const csvData = csvParser.parse(users);
        

        res.setHeader("Content-Type","text/csv")
        res.setHeader("Content-Disposition","attatchment:filename=usersData.csv")

        
         let url = `http://localhost:4040/SocialMedia/user/exportuser`
        res.status(200).json(url).end();
        
    } catch (error) {
        next(error)
        
    } 
}


//*****************************************POSTS*********************************** */
async function postUpload(req,res,next){
    try {
         //let Imageurl =`http://localhost:4040/images/${req.file.filename}`
        let data = await services.user.postUpload(req)
    return response.sendSuccessResponse(req,res,data, responseCode.OK, process.lang.IMAGE_UPLOAD);
    } catch (error) {
        next(error)
        
    }
}

async function deletePost(req,res,next){
    try {
        let data = await services.user.deletePost(req)
        return response.sendSuccessResponse(req,res,data, responseCode.OK, process.lang.DELETE_IMAGE);
    } catch (error) {
        next(error)
        
    }
}

async function getPost(req,res,next){
    try {
        let data = await services.user.getPost(req)
        return response.sendSuccessResponse(req,res,data, responseCode.OK, process.lang.FETCH_SUCCESSFULLY);
        
    } catch (error) {
        next(error)
        
    }
}

async function post(req,res,next){
    try {
        let data = await services.user.post(req)
        return response.sendSuccessResponse(req,res,data, responseCode.OK, process.lang.FETCH_SUCCESSFULLY);
        
    } catch (error) {
        next(error)
        
    }
}

//*************************************COMMENT **************************** */

async function comment(req,res,next){
    try {
        await validation.user.validateComment(req)
        let data = await services.user.comment(req)
        return response.sendSuccessResponse(req,res,data, responseCode.OK, process.lang.FETCH_SUCCESSFULLY);
        
    } catch (error) {
        next(error)
        
    }
}

async function deleteComment(req,res,next){
    try {
        let data=await services.user.deleteComment(req)
        return response.sendSuccessResponse(req,res,data, responseCode.OK, process.lang.DELETE_SUCCESSFULLY);
    } catch (error) {
        next(error)
        
    }
}

async function getChat(req,res,next){
    try {
        let user = await services.user.getChat(req.params,req.user);
        return response.sendSuccessResponse(req, res, user, responseCode.OK, process.lang.FETCH_SUCCESSFULLY);
    } catch (error) {
        next(error)
        
    }
}

async function chatList(req,res,next){
    try {
        let user = await services.user.chatList(req);
        return response.sendSuccessResponse(req, res, user, responseCode.OK, process.lang.FETCH_SUCCESSFULLY);
    } catch (error) {
        next(error)
        
    }
}





async function likePost(req,res,next){
    try {
        await validation.user.VerifyLike(req);
        let user = await services.user.likePost(req);
        return response.sendSuccessResponse(req, res, user, responseCode.OK, process.lang.CREATED_SUCCESSFULLY);
    } catch (error) {
        next(error)
        
    }
}

async function getComment(req,res,next){
    try {
        let user = await services.user.getComment(req);
        return response.sendSuccessResponse(req, res, user, responseCode.OK, process.lang.CREATED_SUCCESSFULLY);
    } catch (error) {
        next(error)
        
    }
}


async function countLike(req,res,next){
    try {
        let user = await services.user.countLike(req);
        return response.sendSuccessResponse(req, res, user, responseCode.OK, process.lang.TOTAL_NO_OFLIKE);

        
    } catch (error) {
        next(error)
        
    }
}

//  ************************************************ FRIEND REQUESTS **********************************************

async function sendRequest (req,res,next){
    try {
        await validation.user.VerifySendRequest(req)
        let user = await services.user.sendRequest(req);
        return response.sendSuccessResponse(req, res,null, responseCode.OK, process.lang.REQUEST_SEND);
    } catch (error) {
        next (error)
        
    }
}

async function respondRequest(req,res,next){
    try {
        await validation.user.VerifyrespondRequest(req)
        let user = await services.user.respondRequest(req);
        if(user.request_Status=="Accept"){
        return response.sendSuccessResponse(req, res,user, responseCode.OK, process.lang.FRIENDS);
        }
        else{
            return response.sendSuccessResponse(req, res,user, responseCode.OK, process.lang.USER_REQUEST_REJECTED);

        }

    } catch (error) {
        next (error)
        
    }
}

async function pendingRequest(req,res,next){
    try {
        let user = await services.user.pendingRequest(req)
        return response.sendSuccessResponse(req, res,user, responseCode.OK, process.lang.FRIENDS);
        
    } catch (error) {
        next (error)
        
    }
}

async function followRequest(req,res,next){
    try {
        let user = await services.user.followRequests(req)
        return response.sendSuccessResponse(req, res,user, responseCode.OK, process.lang.FETCH_SUCCESSFULLY);
        
    } catch (error) {
        next (error)
        
    }
}
async function deletePendingRequest(req,res,next){
    try {
        let user = await services.user.DeletependingRequest(req)
        return response.sendSuccessResponse(req, res,user, responseCode.OK, process.lang.DELETE_PENDING_REQUEST);
        
    } catch (error) {
        next (error)
        
    }
}
async function deletefollowRequest(req,res,next){
    try {
        let user = await services.user.deletefollowRequests(req)
        return response.sendSuccessResponse(req, res,user, responseCode.OK, process.lang.DELETE_FOLLOW_REQUEST);
        
    } catch (error) {
        next (error)
        
    }
}

async function myFriends(req,res,next){
    try {
        let user = await services.user.myFriends(req)
        return response.sendSuccessResponse(req, res,user, responseCode.OK, process.lang.FETCH_SUCCESSFULLY);
        
    } catch (error) {
        next (error)
        
    }
} 

async function deleteFriend(req,res,next){
    try {
        let user = await services.user.deleteFriend(req)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    siginup,
    verifyOtp,
    login,
    updateprofile,
    forgotPassword,
    setPassword,
    resetPassword,
    postUpload,
    deletePost,
    getPost,
    comment,
    deleteComment,
    getChat,
    chatList,
    likePost,
    getComment,
    sendRequest,
    respondRequest,
    pendingRequest,
    followRequest,
    deletePendingRequest,
    deletefollowRequest,
    myFriends,
    countLike,
    post,
    deleteFriend,
    exportUser



}