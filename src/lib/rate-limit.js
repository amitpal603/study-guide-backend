import rateLimit from "express-rate-limit"

 export const limiter = rateLimit({
    windowMs : 20 * 60 * 1000, // 20 min
    max : 50, //  limit Each ip 50 request per windowMs
    message : "Too many requests from this ip please try again later",
    standardHeaders : true,
    legacyHeaders : false
})