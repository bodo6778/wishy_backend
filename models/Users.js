const mongoose = require("mongoose");
// const WishSchema = require("./Wish");

const WishSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: String,
    required: true,
  },
  need: {
    type: String,
    required: true,
  },
  // links: [
  //   {
  //     link: {
  //       type: String,
  //       required: true,
  //     },
  //     price: {
  //       type: String,
  //       required: true,
  //     },
  //     pricy: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  // ],
});

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
  wishes: [WishSchema],
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
