
const rateLimit = require("express-rate-limit");
const signupForgotLimiter = rateLimit({
    windowMs: 30000, // 30 second in milliseconds
    max: 3,// limit each IP to 3 requests per second
    message: "Too many requests, please try again later.",
    headers: true,
    keyGenerator: function (req) {
        return req.ip;
    },
    handler: function (req, res, next) {
        res.status(429).json({ "statusCode": 429, error: "Too many requests, please try again later." });
    },
    onLimitReached: function (req, res, options) {
        // console.log('options.windowMs', options.windowMs);
        // 300000  for 5 Minute
        const retryAfter = Math.ceil(300000 / 1000); // calculate retry time in seconds
        res.set("Retry-After", String(retryAfter)); // set Retry-After header in response
    }
});
// --------------------------------------------------------------------------------------------
const globalLimiter = rateLimit({
    windowMs: 60000, // 1 Minute in milliseconds
    max: 50,// limit each IP to 10 requests per Minute
    message: "Too many requests, please try again later.",
    headers: true,
    keyGenerator: function (req) {
        return req.ip;
    },
    handler: function (req, res, next) {
        res.status(429).json({ "statusCode": 429, error: "Too many requests, please try again later." });
    },
    onLimitReached: function (req, res, options) {
        // console.log('options.windowMs', options.windowMs);
        // 600000  for 10 Minute
        const retryAfter = Math.ceil(600000 / 1000); // calculate retry time in seconds
        res.set("Retry-After", String(retryAfter)); // set Retry-After header in response
    }
});
// --------------------------------------------------------------------------------------------
module.exports = {
    signupForgotLimiter,
    globalLimiter
};