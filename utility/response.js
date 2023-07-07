const responseCode = require("./responseCode")

function sendSuccessResponse(req, res, data, httpCode = responseCode.OK, message) {
    
    if (!data && message) {
        data = {
            message: message
        }
    } else if(data && message){
        data.message =  message
    }
    let responseData = {};
    let headers = {};
    data = data || {}
    responseData.data = data;
    responseData.statusCode = 200;
    responseData.message= data.message || "";
        
    res.status(httpCode).set(headers).send(responseData);
}

function sendFailResponse(req, res, httpCode = responseCode.BAD_REQUEST, message, data) {
    if (!data && message) {
        data = {
            statusCode : httpCode,
            message:  message
        }
    }else if(data && message){
        data.message =  message
    }
    if(data){
        data.data = {}
    }
    res.status(httpCode).send(data);
}



module.exports = {
    sendSuccessResponse,
    sendFailResponse,
   
}