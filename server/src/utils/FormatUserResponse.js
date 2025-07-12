// utils/userHelpers.js

const formatUserResponse = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  emailId: user.emailId,
  age: user.age,
  gender: user.gender,
  photoUrl: user.photoUrl,
  about: user.about,
  preferences: user.preferences,
  country: user.country,
  state: user.state,
  city: user.city,
});

module.exports = {
  formatUserResponse,
};
