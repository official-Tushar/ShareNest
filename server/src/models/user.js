const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isLength(value, { min: 1, max: 20 })) {
          throw new Error(
            "First name must be between 1 and 20 characters long."
          );
        }
      },
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isLength(value, { min: 1, max: 20 })) {
          throw new Error("Last name should be between 1 and 20 characters long.");
        }
      },
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(value + " is an invalid Email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password is too weak. It must be at least 8 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters."
          );
        }
      },
    },
    age: {
      type: Number,
      min: 12,
      trim: true,
      validate: {
        validator: function (v) {
          return v >= 12;
        },
        message: "Age must be a number and at least 12.",
      },
    },
    gender: {
      type: String,
      trim: true,
      enum: {
        values: ["Male", "Female", "Others"],
        message: `{VALUE} is not a valid gender type`,
      },
    },
    photoUrl: {
      type: String,
      default: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.747472938.1741919985&semt=ais_items_boosted&w=740",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error(value + "is not a valid URL");
        }
      },
    },
    about: {
      type: String,
      trim: true,
      validate(value) {
        if (!validator.isLength(value, { min: 5, max: 1000 })) {
          throw new Error("About section should be less than 1000 characters");
        }
      },
    },
    preferences: {
      type: [String],
      default: [],
      validate: {
        validator: function (value) {
          return value.length <= 10;
        },
        message: "Preferences cannot contain more than 10 items.",
      },
    },
    country: {
      type: String,
      trim: true,
      validate(value) {
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
          throw new Error('Country is required and must be a non-empty string.');
        }
      },
    },
    state: {
      type: String,
      trim: true,
      validate(value) {
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
          throw new Error('State is required and must be a non-empty string.');
        }
      },
    },
    city: {
      type: String,
      trim: true,
      validate(value) {
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
          throw new Error('City is required and must be a non-empty string.');
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
