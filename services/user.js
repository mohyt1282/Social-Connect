const mongoose = require('mongoose')
const Model = require('../model/index')
const responseCode = require('../utility/responseCode')
const messages = require('../utility/messages').MESSAGES;
const Otp = require("../services/otp")
const utility = require("../utility/utility")
const SECRET_KEY = "NOTESAPI";
const jwt = require('jsonwebtoken');
const { findOneAndUpdate } = require('../model/user');

async function siginup(data,req) {
    let OTP
    data.password = await utility.hashPasswordUsingBcrypt(data.password);


    if (utility.isEmail(data.key)) {
        data.email = data.key
        user = await Model.user.findOne({ email: data.email, isEmailVerify: true, isDeleted: false });
        if (!user) {
            user = await Model.user.findOne({ email: data.email, });
            if (user) {
                await Model.user.deleteMany({ email: data.email, isEmailVerify: false });
            }
            
            user = await Model.user.create(data);
            OTP = await Otp.generateEmailVerification(data.email, data);
        } else {
            throw process.lang.DUPLICATE_EMAIL
        }
    }
    else {
        data.phone = data.key
        user = await Model.user.findOne({ phone: data.phone, countryCode: data.countryCode, isPhoneVerify: true, isDeleted: false });
        if (!user) {

            user = await Model.user.findOne({ phone: data.phone, countryCode: data.countryCode, });
            if (user) {
                await Model.user.deleteMany({ phone: data.phone, countryCode: data.countryCode, isPhoneVerify: false });
            }
            user = await Model.user.create(data);
            OTP = await Otp.generateuserPhoneOtp(data.phone, user);
        } else {
            throw process.lang.DUPLICATE_PHONE
        }

    }
    if (!user) {
        throw responseCode.BAD_REQUEST;
    }
    return user;
}
async function verifyOTP(data,req) {
    let user;
    let obj = {};

    if (utility.isEmail(data.key)) {
        data.email = data.key

        user = await Model.user.findOne({ email: data.email });

        let otp = await Otp.verifyEmailCode(data.email, data.code);

        if (!otp) throw process.lang.INVALID_OTP;
        obj.isEmailVerify = true;
    } else {

        data.phone = data.key
        console.log(data);
        user = await Model.user.findOne({ phone: data.phone, });

        let otp = await Otp.verifyPhoneOtp(data.countryCode, data.phone, data.code);
        console.log(otp)
        if (!otp) throw process.lang.INVALID_OTP;
        obj.isPhoneVerify = true;

    }
    let head = req.headers['user-agent']
    console.log('head: ', head); 
    obj.userAgent=req.headers['user-agent']
    user = await Model.user.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(user._id) }, obj, { new: true })
    let agent = await utility.hashPasswordUsingBcrypt(head);
    let token = jwt.sign({ _id: user._id,userAgent:agent}, SECRET_KEY);
    return { user, token };
    


    

    

}

async function login(data) {
    let user = {}
    let qry;

    if (utility.isEmail(data.key)) {
        user.email = data.key
        user = await Model.user.findOne({ email: user.email, isDeleted: false, isEmailVerify: true })
        if (!user) {
            throw process.lang.USER_NOTREGISTER
        }

    } else if (utility.isPhone(data.key)) {
        user.phone = data.key;
        user = await Model.user.findOne({ phone: user.phone, isDeleted: false, isPhoneVerify: true })
        if (!user) {
            throw process.lang.USER_PHONENOT
        }

    }

    let result = await Model.user.findOne({ _id: user._id }, {
        password: 1,
    });


    if (!result) {
        throw process.lang.INVALID_USER;
    }


    let match = await utility.comparePasswordUsingBcrypt(data.password, result.password);

    if (!match) {
        throw process.lang.INVALID_PASSWORD;
    }



    let token = jwt.sign({ _id: user._id }, SECRET_KEY);

    return { user, token };
}

async function updateprofile(data, user) {
    user = await Model.user.findOneAndUpdate({ _id: user._id }, data, { new: true });
    if (!user) {
        throw process.lang.INVALID_TOKEN
    }

    return user;
}
async function forgotPassword(data) {
    try {
        if ((data.key && utility.isEmail(data.key)) || data.email) {
            let email = data.key || data.email;
            let user = await Model.user.findOne({ email: email.toLowerCase() });
            if (!user) {
                throw process.lang.INVALID_EMAIL;
            }
            let otp = await Otp.generateEmailVerification(user.email, user);
            if (!otp) {
                throw process.lang.REQUIRED_FILED_IS_MISSING;
            }
            return {

            };
        } else if ((data.key && utility.isPhone(data.key)) || data.phone) {
            let phone = data.key || data.phone;
            let user = await Model.user.findOne({ phone: phone, isDeleted: false });
            if (!user) {
                throw process.lang.INVALID_PHONE;
            }
            let otp = await Otp.generatePhoneOtp(user.phone, phone);

            return {

            };
        } else {
            throw process.lang.REQUIRED_FILED_IS_MISSING;
        }
    } catch (error) {
        throw error;
    }
}
async function setPassword(data, user) {
    try {

        user = await Model.user.findOne({ _id: user._id, isDeleted: false });
        if (!user) {
            throw process.lang.INVALID_USER
        }
        data.password = await utility.hashPasswordUsingBcrypt(data.password);
        console.log(data.password)
        let obj = {}
        obj.password = data.password
        let result = await Model.user.findOneAndUpdate({ _id: user._id }, obj, { new: true });

        if (!result) {
            throw process.lang.UNABLE_UPDATE
        }
        return result

    } catch (error) {
        throw error

    }
}

async function resetPassword(data, user) {

    let finduser = await Model.user.findOne(
        { _id: user._id },
        {
            password: 1,
        }
    );
    if (!finduser) {
        throw process.lang.INVALID_CREDENTAILS;
    } else {
        let match = await utility.comparePasswordUsingBcrypt(data.oldPassword, finduser.password);
        if (!match) {
            throw process.lang.OLD_PASS_NOT_MATCH;
        }
    }

    const pass = await Model.user.findByIdAndUpdate(user._id, {
        $set: {
            password: await utility.hashPasswordUsingBcrypt(data.password),
        },
    });
    return {};
}
//************************************** post *****************************/
async function postUpload(req) {
    try {
        console.log(req.file);
        let user = req.params
        console.log(user)
        let result = {}

        let Imageurl = `http://localhost:4040/images/${req.file.filename}`
        user = await Model.user.findOne({ _id: user.id, isDeleted: false })
        if (!user) {
            throw process.lang.INVALID_USER
        }
        result.userId = user._id, result.posturl = Imageurl
        result = await Model.post.create(result)
        return result;
    } catch (error) {
        throw error
    }
}

async function deletePost(req) {
    try {
        let user = req.user
        let post = req.params
        user = await Model.user.findOne({ _id: user.id, isDeleted: false })
        console.log("user", user)
        if (!user) {
            throw process.lang.NOT_AUTHORIZED
        }
        let obj = {
            isDeleted: true
        }

        post = await Model.post.findOneAndUpdate({ _id: post.id, isDeleted: false, userId: user.id }, obj, { new: true })
        if (!post) {
            throw process.lang.INVALID_POSTID
        }
        return {}

    } catch (error) {
        throw error

    }
}

async function getPost(req) {
    try {
        let user = req.user
        let result = await Model.post.find({ userId: user.id, isDeleted: false })
        if (result==0) {
            throw process.lang.INVALID_USER
        }
        return result
    } catch (error) {
        throw error

    }
}

async function post(req) {
    try {
        let result = await Model.post.aggregate([
            {
                $match: {
                    isDeleted: false,


                }
            },
            {
                $lookup: {
                    from: "comments",
                    let: { post: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [{ $eq: ["$$post", "$postId"] }]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: { user: "$userId" }, // userId is from post table
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $or: [{ $eq: ["$$user", "$_id"] }] // $$user is variable declear on line 300   $_id is ref ID of object in users model
                                            }
                                        }
                                    },

                                    {
                                        $project: { firstName: 1, lastName: 1 }
                                    }
                                ],
                                as: 'users'
                            },

                        },

                        {
                            $unwind: { path: "$users", preserveNullAndEmptyArrays: true } // as match returns a array to change array from array to object we use this
                        },
                        {
                            $addFields: {
                                userfirstName: "$users.firstName",
                                userlastName: "$users.lastName"

                            }
                        },
                        {
                            $project: { comment: 1, createdAt: 1, userfirstName: 1, userlastName: 1 }
                        },
                    ],
                    as: 'comments'
                }
            },

            {
                $lookup: {
                    from: "likes",
                    let: { post: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [{ $eq: ["$$post", "$PostId"] }]
                                },
                                key : "like"
                            }
                        }, {
                            $lookup: {
                                from: "users",
                                let: { user: "$UserId" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $or: [{ $eq: ["$$user", "$_id"] }]
                                            }
                                        }
                                    },
                                    // totallikes : { $sum : 1}
                                   
                                    // {
                                    //     $project: { firstName: 1, lastName: 1, key: 1, totallikes: 1 }
                                    // }
                                ],
                                as: 'userwholike'
                            },

                        }, 
                        {
                            $unwind: { path: "$userwholike", preserveNullAndEmptyArrays: true } // as match returns a array to change array from array to object we use this
                        }, 
                       
                        {
                            $addFields: {
                                userfirstName: "$userwholike.firstName",
                                userlastName: "$userwholike.lastName",
                                userresponse: "$userwholike.key",
                                // toallikes: "$toallikes"

                            }
                        },
                        {
                            $project: { createdAt: 1, userfirstName: 1, userlastName: 1, key: 1, toallikes: 1 }
                        },
                    ],

                    as: 'likeDetails'
                }
            },
            {
                $lookup: {
                    from: "likes",
                    let: { post: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [{ $eq: ["$$post", "$PostId"] }]
                                },
                                key : "dislike"
                            }
                        }, {
                            $lookup: {
                                from: "users",
                                let: { user: "$UserId" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $or: [{ $eq: ["$$user", "$_id"] }]
                                            }
                                        }
                                    },
                                    // totallikes : { $sum : 1}
                                   
                                    // {
                                    //     $project: { firstName: 1, lastName: 1, key: 1, totallikes: 1 }
                                    // }
                                ],
                                as: 'userwholike'
                            },

                        }, 
                        {
                            $unwind: { path: "$userwholike", preserveNullAndEmptyArrays: true } // as match returns a array to change array from array to object we use this
                        }, 
                       
                        {
                            $addFields: {
                                userfirstName: "$userwholike.firstName",
                                userlastName: "$userwholike.lastName",
                                userresponse: "$userwholike.key",
                                // toallikes: "$toallikes"

                            }
                        },
                        {
                            $project: { createdAt: 1, userfirstName: 1, userlastName: 1, key: 1, toallikes: 1 }
                        },
                    ],

                    as: 'dislikeDetails'
                }
            },
            { $addFields: { toalDislikes: { $size: "$dislikeDetails" } } },
            { $addFields: { toallikes: { $size: "$likeDetails" } } },
            { $addFields: { toalComment: { $size: "$comments" } } },
            {
                $lookup: {
                    from: "users",
                     localField: "userId",
                     foreignField: "_id",
                     as:'CreatBy'
                }
            },
            {
                $unwind: { path: "$CreatBy", preserveNullAndEmptyArrays: true } // as match returns a array to change array from array to object we use this
            }, 

            {
                $project:{
                    userId:1,
                    posturl:1,
                    userfirstName:"$CreatBy.firstName",
                    userlastName:"$CreatBy.lastName",
                    comments:1, 
                    likeDetails :1,
                    dislikeDetails:1,
                    createdAt:1,
                    toallikes :1,
                    toalDislikes:1,
                    toalComment : 1

                   }
            },
            



        ])
        console.log(result)
        return result
    } catch (error) {
        throw error

    }
}

// ****************************************** COMMENT************************************

async function comment(req) {
    try {
        let user = req.user
        let post = req.params
        let data = req.body
        user = await Model.post.findOne({ isDeleted: false, _id: post.id })

        if (!user) {
            throw process.lang.INVALID_CREDENTAILS
        }

        data.userId = req.user.id, data.postId = req.params.id
        let result = await Model.comment.create(data)
        return result
    } catch (error) {
        throw error

    }
}

async function deleteComment(req) {
    try {
        let user = req.user
        let post = req.params
        let data = req.body
        console.log("user", user)
        console.log("post", post)
        console.log("data", data)
        // user = await Model.post.findOne({userId:user.id,postId:data.id,isDeleted:false})
        // if(!user){
        // throw process.lang.INVALID_USER
        // }
        let obj = { isDeleted: true }
        user = await Model.comment.findOneAndUpdate({ userId: user.id, _id: data.commentId, isDeleted: false }, obj, { new: true })
        if (!user) {
            throw process.lang.NO_COMMENT
        }
        console.log("user", user)
        return user
    } catch (error) {
        throw error

    }
}

async function getComment(req) {
    try {
        let user = req.user;
        let post = req.params;

        let result = await Model.comment.find({ postId: post.id, isDeleted: false })
        console.log("dhdhdjd", result)
        if (result==0) {
            throw process.lang.NO_COMMENT
        }
        return result

    } catch (error) {
        throw error

    }
}

//***************************************** CHAT********************* */


async function getChat(data, user) {
    try {
        console.log("senderId", user._id)
        // console.log("ReciverId",data)
        let Reciver = new mongoose.Types.ObjectId(data)
        console.log(Reciver);
        let result = await Model.chat.aggregate([

            {
                $match: {
                    // isDeleted : false,
                    $or: [{ SenderId: new mongoose.Types.ObjectId(user.id), ReciverId: (Reciver) },
                    { SenderId: (Reciver), ReciverId: new mongoose.Types.ObjectId(user.id) }
                    ]

                }
            },

            {
                $lookup: {
                    from: "users",
                    let: { senderId: "$SenderId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [{ $eq: ["$$senderId", "$_id"] }]
                                }
                            }
                        },

                    ],
                    as: 'senderDetail'
                }
            },
            {
                $unwind: { path: "$senderDetail", preserveNullAndEmptyArrays: true } // as match returns a array to change array from array to object we use this
            },
            {
                $lookup: {
                    from: "users",
                    let: { reciverId: "$ReciverId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [{ $eq: ["$_id", "$$reciverId"] }]
                                }
                            }
                        },

                    ],
                    as: 'receiverDetail'
                }
            },
            {
                $unwind: { path: "$receiverDetail", preserveNullAndEmptyArrays: true }
            },
            {
                $addFields: {

                    SenderName: "$senderDetail.firstName",
                    // SenderId:"$senderDetail.SenderId",
                    SenderEmail: "$senderDetail.email",
                    SenderPhone: "$senderDetail.phone",
                    ReciverName: "$receiverDetail.firstName",
                    // ReciverId:"$ReciverDetail.ReciverId",
                    ReciverEmail: "$receiverDetail.email",
                    ReciverPhone: "$receiverDetail.phone"
                }
            },
            {
                $project: {
                    SenderName: 1, SenderEmail: 1, SenderPhone: 1, Message: 1,
                    ReciverName: 1, ReciverEmail: 1, ReciverPhone: 1, ReciverId: 1, SenderId: 1, createdAt: 1
                }
            }



        ])
        // console.log(result)
        return result
    }
    catch (error) {
        throw error

    }

}

async function chatList(req){
    try {
        let search = req.query.search;
    let page = req.query.page;
    let size = req.query.limit;
    let skip = parseInt(page - 1) || 0;
    let limit = parseInt(size) || 10;
    skip = skip * limit;
    let pipeline = [];
    let searchPipeline = [];
    
    

    const startOfDay = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString();
    let todayCriteria = {
        createdAt: {
            $gte: startOfDay,
            $lte: endOfDay
        },
        isDeleted: false,
        senderId: new mongoose.Types.ObjectId(req.user._id)
    };

    pipeline.push(
        {
        $match: {
            $or: [

            { ReceiverId :new mongoose.Types.ObjectId(req.user._id) },
            { SenderId: new mongoose.Types.ObjectId(req.user._id) }
        ],

        }
        },
        {
            $lookup: {
                from: "chats",
                let: { connectionId: "$ConnectionId" },
                pipeline: [{
                    $match: {
                        $expr: {
                            $or: [{ $eq: ["$$connectionId", "$ConnectionId"] }]
                        },
                        isDeleted: false
                    }
                },
                { $sort: { createdAt: -1 } },
                { $limit: 1 }
                ],
                as: "lastMessage"
            }
        },
        {
            $group: {
                _id: {
                    connectionId: "$connectionId",
                    lastMessage: { $arrayElemAt: ["$lastMessage", -1] }
                }
            }
        },
        { $project: { _id: 0, lastMessage: "$_id.lastMessage", connectionId: "$_id.connectionId" } },//  <----: connectionId: "$_id.connectionId"
        {
            $addFields: {
                user: {
                    $cond: {
                        if: {
                            $eq: ["$lastMessage.SenderId", new mongoose.Types.ObjectId(req.user._id)]
                        },
                        then: "$lastMessage.ReceiverId",
                        else: "$lastMessage.SenderId"
                    }
                }
            }
        },
       { $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },


   { $match: { "lastMessage.clearedBy": { $nin: [ new mongoose.Types.ObjectId(req.user._id)] } } },
        { $sort: { "lastMessage.createdAt": -1 } },

         { $lookup: { from: "requests", localField: "ConnectionId", foreignField: "_id", as: "userAction" } },
        //   { $unwind: "$userAction" },
        // {
        //     $match: { clear: false }
        // },
        {
            $addFields:{
                userMessage:"$lastMessage.message",
                userFirstName:"$user.firstName",
                userlastName:"$user.lastName",
                MyFriend:"$lastMessage.SenderId",
                Me:"$lastMessage.ReceiverId",

            }
        },
        {
            $project: {
                _id: 0,
                lastMessage: "$lastMessage",
                userMessage:"$lastMessage.message",
                connectionId: "$connectionId",
                 userAction : {isMatched : 1 },
                isMatched: "$userAction.isMatched",
                fullName: "$user.fullName",
                userFirstName: "$user.firstName",serlastName:"$user.lastName",
                 users: "$user",
                profilePic: "$user.profilePic", userId: "$user._id",
                 isBlocked: "$isBlocked", clear: "$clear"
                ,
            }
        }
     );

    let detail = await Model.chat.aggregate(pipeline)
    return detail
        
    } catch (error) {
        throw error
        
    
    }
}










//*************************************** LIKE AND DISLIKE******************* */

async function likePost(req) {
    try {
        let user = req.user;
        // console.log('user: ', user);
        let post = req.params;
        // console.log('params: ', post);
        let data = req.body;
        // console.log('body: ', data);
        user = await Model.user.findOne({ _id: user.id, isDeleted: false })
        if (user) {
            post = await Model.post.findOne({ _id: post.id, isDeleted: false })
            if (post) {

                let result = await Model.like.findOneAndUpdate({ PostId: post.id }, req.body, { new: true })
                if (!result) {
                    data.UserId = req.user.id, data.PostId = req.params.id
                    data = await Model.like.create(data)
                    return data
                }

                return result
            }
        }


    } catch (error) {
        throw (error)

    }
}

async function countLike(req) {
    try {
        let data = req.body
        let user = await Model.post.findOne({ _id: data.PostId })
        if (!user) {
            throw process.lang.INVALID_POSTID
        }
        user = await Model.like.findOne({ PostId: data.PostId, key: "like" })

        if (!user) {
            throw process.lang.NO_LIKES
        }
        let result = await Model.like.countDocuments({ key: "like" });
        return result

    } catch (error) {
        throw (error)

    }
}



//**********************************************Fried Requests******************** */

async function sendRequest(req) {
    try {
        let sender = req.user
        // console.log('sender: ', sender);
        let reciver = req.body
        // console.log('reciver: ', reciver);
        if (req.user.id == req.body.requestTo) {
            throw process.lang.SAME_REQUESTID_SENDERID
        }
        reciver = await Model.user.findOne({ _id: reciver.requestTo, isDeleted: false })
        if (!reciver) {
            throw process.lang.INVALID_RECIVER
        }
        let already = await Model.request.findOne({requestTo:sender.id,requestedBy:req.body,isDeleted:false})
        if(!already){
            throw process.lang.ALREADY_FRIEND
        }
        let findExisting = await Model.request.findOne({ requestBy: sender._id, requestTo: req.body.requestTo})
        // console.log('sender._id: ', sender._id);
        // console.log('reciver.requestTo: ', req.body.requestTo);
        // console.log('findExisting: ', findExisting);
        if (!findExisting) {
            let obj = {
                requestBy: sender.id,
                requestTo: reciver.id
            }
            let result = await Model.request.create(obj)
        }
        
        else {
            if(findExisting.isDeleted=true){
                let vij={isDeleted:false,
                request_Status:"Pending"}
                let deleteuser=await Model.request.findOneAndUpdate({requestBy: sender._id, requestTo: req.body.requestTo,isDeleted:true},vij,{new:true})
                return process.lang.REQUEST_SEND
            }
            let obj ={request_Status:"Pending"}
            let reject = await Model.request.findOneAndUpdate({requestBy: sender._id, requestTo: req.body.requestTo, request_Status: "Reject" ,isDeleted:false},obj,{new:true})
            console.log('reject: ', reject);
            if(!reject){
                let findExisting = await Model.request.findOne({ requestBy: sender._id, requestTo: req.body.requestTo, request_Status: "Accept" ,isDeleted:false})
            console.log('findExisting: ', findExisting);
            if (!findExisting) {
                return process.lang.REQUEST_SEND_ALREADY
            }
            return process.lang.ALREADY_FRIEND

            }
            return {}
            
        }


        return {}

    } catch (error) {
        throw (error)
    }
}

async function respondRequest(req) {
    try {
        let user = req.user
        // console.log('user: ', user);
        let data = req.params.id
        // console.log('data: ', data);
        
        let response = req.body
        
        data = await Model.user.findOne({ _id: data ,isDeleted:false})
        if (!data) {
            throw process.lang.INVALID_USER
        }
        console.log('request_Status: ', response.request_Status);
        let obj = {
            request_Status: response.request_Status


        }
        // console.log(obj)
        // console.log(req.params.id);
        let findUser = await Model.request.findOne({requestBy:data._id, requestTo: user._id,isDeleted:false})
        
        if (!findUser) {
            throw process.lang.NO_REQUESTS
            
        }
        else{ let obj = {
            request_Status: response.request_Status }
            
            let result = await Model.request.findOneAndUpdate({requestBy:data._id, requestTo: user._id,isDeleted:false}, obj, { new: true })
            console.log('result: ', result);
            result = await Model.request.findOne({requestBy:data._id, requestTo: user._id,isDeleted:false})
            return result
            
        }


           
    } catch (error) {
        throw (error)

    }
}
// let result = await Model.request.findOneAndUpdate({requestBy:data._id, requestTo: user._id,request_Status: "Pending" ,isDeleted:false}, obj, { new: true })
// throw process.lang.NO_REQUEST
//             }
            
//             return process.lang.FRIENDS
//         }
//         }
//         throw process.lang.ALREADY_FRIEND

async function pendingRequest(req) {
    try {
        let user = req.user
        user = await Model.request.find({ requestBy: user.id, request_Status: "Pending" ,isDeleted:false})
        if (!user) {

            return process.lang.NO_REQUESTS
        }
        return user

    } catch (error) {
        throw (error)

    }
}

async function followRequests(req) {
    try {
        let user = req.user
        user = await Model.request.find({ requestTo: user.id, request_Status: "Pending",isDeleted:false })
        if (user==0) {
            
            return process.lang.NO_FOLLOW_REQUEST
        }
        return user


    } catch (error) {
        next(error)

    }
}

async function DeletependingRequest(req) {
    try {
        let obj={}
        let user = req.user
        let data = req.params
        user = await Model.request.findOne({ requestBy: user.id, request_Status: "Pending" ,isDeleted:false})
        if (!user) {
            
            throw process.lang.NO_REQUEST_SEND
        }
        obj.isDeleted=true
        
        let result = await Model.request.findOneAndUpdate({_id: data.id, request_Status: "Pending",isDeleted:false },obj,{new:true})
        
        if (!result) {
            
            throw process.lang.NO_REQUEST_SEND
        }
        return 

    } catch (error) {
        throw (error)

    }
}

async function deletefollowRequests(req) {
    try {
        let obj ={}
        let user = req.user
        let data = req.params
        user = await Model.request.findOne({ requestTo: user.id, request_Status: "Pending",isDeleted:false })
        if (!user) {

            throw process.lang.NO_REQUESTS
        }
        obj.isDeleted=true
        console.log(data.id);

        let result = await Model.request.findOneAndUpdate({ _id: data.id, request_Status: "Pending",isDeleted:false },obj,{new:true})
        
        if (!result) {
            
            return process.lang.NO_REQUEST_RECIVE
        }
        return


    } catch (error) {
        throw (error)

    }
}

async function myFriends(req) {
    try {
        let user = req.user
        console.log(user.id);
        user = await Model.user.findOne({ _id: user.id })
        result = await Model.request.aggregate([
            {
                $match: {
                    isDeleted:false,
                    request_Status: "Accept",
                    $or: [
                        { requestBy: new mongoose.Types.ObjectId(user.id) }, { requestTo: new mongoose.Types.ObjectId(user.id) }
                    ]


                }
             }
             , {
                $lookup: {
                    from: "users",
                    let: { requestBy: "$requestBy" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [{ $eq: ["$$requestBy", "$_id"] }]
                                }
                            }
                        },
                        {
                            $unwind: { path: "$FriendsDetail", preserveNullAndEmptyArrays: true }
                        },
                        {
                            $project: { firstName: 1, lastName: 1 }
                        },

                    ],
                    as: 'FriendDetail'
                }
            },
            {
                $unwind: { path: "$FriendDetail", preserveNullAndEmptyArrays: true }
            },
            {
                $project: { request_Status: 1, createdAt: 1, FriendDetail: 1 }
            }


        ])
        console.log("user", user);

        return { user, result }
    } catch (error) {
        throw (error)

    }
}
async function deleteFriend(req){
    let user = req.user
    let data = req.params.id
    let obj={
        isDeleted:true
    }
    data = await Model.request.findOneAndUpdate({requestedBy:user.id,requestedTo:data.id},obj,{new:true})
    if(!data){
        throw process.lang.NO_USER
    }
    return {}

}

module.exports = {
    siginup,
    verifyOTP,
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
    followRequests,
    DeletependingRequest,
    deletefollowRequests,
    myFriends,
    countLike,
    post,
    deleteFriend
}