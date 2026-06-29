const jwt = require("jsonwebtoken");
function authMiddleware(req,res,next){
    const token = req.headers.token;
    const decoded = jwt.verify(token,"abhinav123");
    if(decoded.userId){
        req.userId = decoded.userId;
        next();
    }else{
        res.status(403).json({
            Message:"Token was incorrect or does not match"
        })
    }
}
module.exports = {
    authMiddleware: authMiddleware
}