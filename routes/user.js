const express = require('express');
const userRoute =  express.Router();
const controller = require("../controller/index")
const Auth = require("../middleware/middleware")
const rateLimiter = require("../middleware/rateLimiter")
const uploads = require('../services/postUpload')

userRoute.post('/siginup',rateLimiter.signupForgotLimiter,controller.user.siginup)
userRoute.post('/verify',controller.user.verifyOtp)
userRoute.post('/login',controller.user.login)
userRoute.put('/updateprofile',Auth,controller.user.updateprofile)
userRoute.post('/forgotPassword',controller.user.forgotPassword)
userRoute.put('/setPassword',Auth,controller.user.setPassword)
userRoute.post('/resetPassword',Auth,controller.user.resetPassword)

userRoute.post("/upload/:id", uploads.postUpload.single('image'), controller.user.postUpload);
userRoute.delete('/deletePost/:id',Auth,controller.user.deletePost)
userRoute.get('/getPost',Auth,controller.user.getPost)
userRoute.get('/post',controller.user.post)

userRoute.post('/comment/:id',Auth,controller.user.comment)
userRoute.delete('/deletecomment/:id',Auth,controller.user.deleteComment)

userRoute.get('/getChat/:id',Auth,controller.user.getChat)
userRoute.get('/chatList',Auth,controller.user.chatList)

userRoute.post('/likedislike/:id',Auth,controller.user.likePost)
userRoute.get('/getComment/:id',Auth,controller.user.getComment)
userRoute.get('/countLike',Auth,controller.user.countLike)
userRoute.get('/exportuser',controller.user.exportUser)

userRoute.post('/sendRequest',Auth,controller.user.sendRequest)
userRoute.post('/respondRequest/:id',Auth,controller.user.respondRequest)
userRoute.get('/pendingRequest',Auth,controller.user.pendingRequest)
userRoute.get('/followRequest',Auth,controller.user.followRequest)
userRoute.delete('/deletePendingRequest/:id',Auth,controller.user.deletePendingRequest)
userRoute.delete('/deletefollowRequest/:id',Auth,controller.user.deletefollowRequest)
userRoute.get('/myFriends',Auth,controller.user.myFriends)












module.exports = userRoute;