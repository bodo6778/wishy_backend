const mongoose = require("mongoose");
// const WishSchema = require("./Wish");

const LinksSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  pricy: {
    type: Number,
    required: true,
  },
});

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
  links: [LinksSchema],
});

const WishlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  wishes: [WishSchema],
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
  wishlists: [WishlistSchema],
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
