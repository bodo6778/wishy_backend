const mongoose = require("mongoose");

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
    type: Array,
  },
});

const WishModel = mongoose.model("wishes", WishSchema);
module.exports = WishModel;
module.exports = WishSchema;
