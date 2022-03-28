const mongoose = require("mongoose");
const WishSchema = require("./Wish");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // wishes: [WishSchema],
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
