const mongoose = require('mongoose');
const connectedb = async () => {
    try {
       await mongoose.connect("mongodb://localhost:27017/SocialMedia");
       console.log("Server Connect succesfully");
    } catch (err) {
        console.log("Error While connected to DataBase" + err);
   }
}
module.exports = connectedb;