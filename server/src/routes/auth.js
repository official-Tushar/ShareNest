const express = require("express");
const authRouter = express.Router();
const {validateSignUpData, validateLoginData} = require("../utils/Validate");
const {User} = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
    try{
        // Validation of data
        validateSignUpData(req);

        const {firstName, lastName, emailId, password} = req.body;

        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        // creating a new instance of the user model
        const user = new User({
            firstName, lastName, emailId, password: passwordHash,
        });

        const savedUser = await user.save();
        // create a JWT token and set expiry time for the token
        const token = await savedUser.getJWT();

        // add the token to cookie, set the expiry time for cookie and send the response back to the user
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,         // Only over HTTPS (required for cross-site cookies)
            sameSite: 'None',     // Required for cross-site cookies
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day expiry
          });
        res.json({message: "User data added successfully", data: {
            _id: savedUser._id,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            emailId: savedUser.emailId
        }});
    } catch(err){
        if (err.code === 11000 && err.keyPattern.emailId) {
            return res.status(400).send({ Error : "Email is already registered. Please use a different email." });
        }
        res.status(400).send("ERROR: " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try{
        // Validation of data
        validateLoginData(req);

        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid Credentials. Please check your email and password.");
        }
        const isPasswordValid = await user.validatePassword(password);

        if(isPasswordValid){
            // create a JWT token and set expiry time for the token
            const token = await user.getJWT();

            // add the token to cookie, set the expiry time for cookie and send the response back to the user
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,         // Only over HTTPS (required for cross-site cookies)
                sameSite: 'None',     // Required for cross-site cookies
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day expiry
              });
            res.json({message: "Logged In successfully", data: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            emailId: user.emailId,
            age: user.age,
            gender: user.gender,
            photoUrl: user.photoUrl,
            about: user.about,
            preferences: user.preferences,
            city: user.city
        }});
        }
        else{
            throw new Error("Invalid Credentials. Please check your email and password.");
        }
    } catch (err){
        res.status(400).send("ERROR: " + err.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(400).send("You are not logged in.");
    }
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,         // Must match how you set it
        sameSite: 'None',     // Must match how you set it
        expires: new Date(0)  // Expire immediately
      });
    res.send("Logged out successfully");
});

module.exports = authRouter;

