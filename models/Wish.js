const mongoose = require("mongoose");

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
    type: Number,
    required: true,
  },
  need: {
    type: Number,
    required: true,
  },
  links: {
    type: [LinksSchema],
  },
});

const WishModel = mongoose.model("wishes", WishSchema);
module.exports = WishModel;
module.exports = WishSchema;
