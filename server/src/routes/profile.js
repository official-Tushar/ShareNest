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
    console.log("[profileRouter] GET /profile/view - user:", user);
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
    console.log("[profileRouter] PATCH /profile/edit - request body:", req.body);
    console.log("Request body:", req.body);

    if (!validateEditProfileRequest(req)) {
      console.log("validateEditProfileRequest failed");
      throw new Error("Invalid Edit request");
    }
    // Add validation Check for the entered data
    try {
      validateEditProfileData(req);
    } catch (validationError) {
      console.log("validateEditProfileData failed:", validationError.message);
      throw validationError;
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    const responseUser = formatUserResponse(loggedInUser);
    console.log("[profileRouter] PATCH /profile/edit - response:", responseUser);
    res.send(responseUser);
  } catch (err) {
    console.log("Error in PATCH /profile/edit:", err.message);
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
