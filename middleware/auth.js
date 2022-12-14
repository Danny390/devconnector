const jwt = require('jsonwebtoken')
const config = require("config")

module.exports = function(req, res, next){  //next lets us move on to next piece of middleware
    //Get token from header
    const token = req.header('x-auth-token')
    //Check if no token
    if(!token){
        return res.status(401).json({msg: "No token, authorization denied"});
    }
    //Verfiy token (there is a token)
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret')); //Decodes passed in token with the jwt secret
        req.user = decoded.user; //The correct user is stored in the decoded 'variable'
        next(); //Standard middleware procedure
    } catch (err) {
        res.status(401).json({msg: "Token is not valid"});
    }
}