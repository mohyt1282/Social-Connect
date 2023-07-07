
const multer = require('multer')
const path = require('path')


const PicStorage = multer.diskStorage({
    destination: path.resolve("./uploads"),
  
    filename: function (req, file, cb) {
      cb(null, file.fieldname+"_"+Date.now()+".jpg")
    }
  });
const singleUpload = multer({ storage: PicStorage });
  
  
  module.exports = {
    postUpload: singleUpload,
    
  }

