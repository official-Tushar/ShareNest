const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileRequest,
  validateEditProfileData,
} = require("../utils/Validate");
const { formatUserResponse } = require("../utils/FormatUserResponse");
const ConnectionRequest = require("../models/connectionRequest");
const { User } = require("../models/user");
const profileRouter = express.Router();

// Get your frined's user's profile by ID
profileRouter.get("/profile/view/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;
    const friend = await User.findById(targetUserId).select("-password");

    if (!friend) {
      return res.status(404).json({ error: "User not found" });
    }

    const isConnected = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
        { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
      ],
    });

    if (!isConnected) {
      return res
        .status(403)
        .json({ error: "You are not connected with this user." });
    }

    res.send({
      ...formatUserResponse(friend),
      isFriend: !!isConnected,
    });
  } catch (error) {
    console.error("Other user profile view error:", error);
    res.status(500).json({ error: "Failed to fetch user profile." });
  }
});

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(formatUserResponse(user));
  } catch (error) {
    console.error("Profile view error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch profile. Please try again later." });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileRequest(req)) {
      throw new Error("Invalid Edit request");
    }
    // Add validation Check for the entered data
    validateEditProfileData(req);

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.send(formatUserResponse(loggedInUser));
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// create a profile Router for forgot password

module.exports = profileRouter;
