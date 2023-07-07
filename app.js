require("dotenv").config();
const express = require('express')
const mongoose = require('mongoose')
const bodyParser =  require('body-parser');
const app = express();
const port=process.env.PORT;

const Routes = require('./routes/index')
const connection =require('./connection/connection')
const constant = require("./utility/messages")
const response = require("./utility/response")
var http = require('http')
var server = http.createServer(app);
const { io } = require('./services/soket');
const { constants } = require("buffer");


console.log('process.env.EMAIL_USERNAME: ', process.env.EMAIL_USERNAME); 

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true }))
app.use(bodyParser.json())
app.use(function (req, res, next) {
    if (req.headers && req.headers.lang && req.headers.lang == 'ar') {
      process.lang = constant.MESSAGES.arr;
    } else {
      process.lang = constant.MESSAGES.en;
    }
    next();
  });

  connection();

  app.use("/SocialMedia", Routes);

  app.use(function (err, req, res, next) {
    console.error(err);
    const status = err.status || 400;
    if (err.message == "jwt expired" || err.message == "Authentication error") { res.status(401).send({ status: 401, message: err }) }
    if (typeof err == typeof "") { response.sendFailResponse(req, res, status, err) }
    else if (err.Error) res.status(status).send({ status: status, message: err.Error });
    else if (err.message) res.status(status).send({ status: status, message: err.message });
    else res.status(status).send({ status: status, message: err.message });
  });
  app.use('/images/', express.static("uploads"));

  
  app.use('/', function (req, res) {
    res.status(400).send({ code: 400, status: "Bad request", message: "Parcel Pending API", data: {} })
  });
  // var server
  // if (process.env.NODE_ENV == 'dev' || process.env.NODE_ENV == 'demo') {
  //   // const privateKey = fs.readFileSync(config.get("ssl.privateFile"), 'utf8');
  //   // const certificate = fs.readFileSync(config.get("ssl.fullchain"), 'utf8');
  
  //   const privateKey = fs.readFileSync(process.env.SSL_PVT_FILE, 'utf8');
  //   const certificate = fs.readFileSync(process.env.SSL_CHAIN, 'utf8');
  
  //   server = https.createServer({ key: privateKey, cert: certificate, }, app)
  //   console.log(`Running on HTTPS`);
  
  // } else {
  //   server = http.createServer(app);
  //   console.log(`Running on HTTP`);
  // }
  

  
  io.attach(server);


server.listen(4040, ()=>{
    console.log("server connected on port 4040");
})