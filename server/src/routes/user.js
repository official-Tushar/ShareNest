const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { User } = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender photoUrl about preferences country state city";

// get all the pending connection request from the logged in User
userRouter.get("/user/requests/received", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        // }).populate("fromUserId", ["firstName", "lastName", "age", "gender", "photoUrl", "about", "preferences", "country", "state", "city"]);
        }).populate("fromUserId", USER_SAFE_DATA);

        res.json({
            message: "Data Fetched successfully",
            data: connectionRequests,
        });
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/connections", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"},
            ]
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequest.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({data});
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
    console.log("Feed route hit");
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 1;
        limit = (limit > 50) ? 50 : limit;
        const skip = (page-1)*limit;

        const { city } = req.query;
        const locationFilter = city ? { city: { $regex: city, $options: "i" } } : {};

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id},
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        console.log("City filter:", locationFilter);
        const users = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUsersFromFeed)},},
                {_id: {$ne: loggedInUser._id}},
                locationFilter
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.send(users);
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = userRouter;