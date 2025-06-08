const jwt = require("jsonwebtoken");
const {User} = require("../models/user");

const userAuth = async (req, res, next) => {
    // read the token from the request cookies
    // validate the token
    // Find the user
    try{
        const {token} = req.cookies;
        if(!token){
            return res.status(401).json({ error: "Please login to continue." });
        }
        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
    
        const {_id} = decodedObj;
        const user = await User.findById(_id);
        if(!user){
            return res.status(404).json({ error: "User not found." });
        }

        req.user = user;
        next();
    }catch(err){
        console.error("Auth error:", err);
        res.status(401).json({ error: "Invalid or expired token. Please login again." });
    }
};

module.exports = {
    userAuth,
};