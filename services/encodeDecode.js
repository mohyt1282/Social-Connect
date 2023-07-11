const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const algorithm = 'aes-256-cbc';
// const algorithm = 'aes-256-cbc-pkcs5';
// const iv = '9MSkTNVhJcWsegS9bWJU'.slice(0, 16);
// const iv = '9MSkTNVhJcWsegS9bWJU'.slice(0, 16);
const iv = '9MMMTNVhKvTqlfS9';
// const iv =         '6a44c922912064a8'
const utility = require('../utility/utility')

const key = "MKOIJNQASDFVRGHNBHUCFTXDRESZWA"


async function secKeyDecryptedWithSek(req, res, next) {
    try {
        console.log('secKeyDecrypted', req.body);
        let payload = req.body;
        let hash = payload.hash;
        let sek = payload.sek;
        console.log('hash', hash);
        console.log('sek', sek);
        let key = Buffer.from(sek, 'hex');
        hash = Buffer.from(hash, 'hex');
        let decipher = crypto.createDecipheriv(algorithm, Buffer.from(hash, 'base64'), iv);
        let decrypted = decipher.update(key);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        decrypted = JSON.parse(decrypted.toString());
        // console.log('decrypted', decrypted);
        // console.log('moment(appKey)', moment(decrypted.appKey));
        // console.log(' moment().diff(moment(appKey), "s")', moment().diff(moment(decrypted.appKey), "s"));
        if (moment(decrypted.appKey) == "Invalid date" || moment().diff(moment(decrypted.appKey), "s") >= 15) {
            throw new Error('Invalid Request');
        }
        // console.log('decrypted: ', decrypted);
        req.body = decrypted;
        delete req.body.appKey;
        next();
        return;
    } catch (error) {
        return res.status(504).send({
            message: "Invalid Request***",
            data: {}
        });
    }
};
async function secKeyDecryptedWithSekForWEB(req, res, next) {
    try {
        let payload = req.body.hash;
        console.log('secKeyDecryptedWithSekForWEB  ', payload);
        let keyWEB = CryptoJS.SHA256(key);
        let ivWEB = CryptoJS.enc.Base64.parse(iv);
        let decrypted = CryptoJS.AES.decrypt(payload, keyWEB, {
            iv: ivWEB,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        let dec = decrypted.toString(CryptoJS.enc.Utf8);
        console.log('dec -------a--------', dec);
        console.log('dec -------a- moment(dec.date) -------', moment(dec.date));
        console.log(' moment().diff(moment(appKey), "s")', moment().diff(moment(decrypted.appKey), "s"));
        if (moment(dec.date) == "Invalid date" || moment().diff(moment(dec?.date), "s") >= 15) {
            throw false;
        }
        req.body = JSON.parse(dec);
        delete req.body.date;
        next();
        return;
    } catch (error) {
        return res.status(504).send({
            message: "Invalid Request",
            data: {}
        });
    }
};
async function decrypWithSek(req, res, next) {
    const headers = req.headers;
    const method = req.method;
    console.log("method*****", method);
    try {
        if (method == "POST" || method == "PUT") {
            if (headers.devicetype == "web") {
                await secKeyDecryptedWithSekForWEB(req, res, next);
            } else {
                await secKeyDecryptedWithSek(req, res, next);
            }
        }
        else{
            next();
        }
        return;
    } catch (error) {
        console.log('error', error);
        return res.status(504).send({
            message: "Invalid Request",
            data: {}
        }); 
    }
};



module.exports = {
    secKeyDecryptedWithSek: secKeyDecryptedWithSek,
    secKeyDecryptedWithSekForWEB: secKeyDecryptedWithSekForWEB,
    decrypWithSek: decrypWithSek,
};