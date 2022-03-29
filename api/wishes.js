const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys"); // Load input validation

const User = require("../models/Users");

/**
 * @route POST api/wishes/add
 * @desc Add wish to user
 * @access private to user
 */
router.post("/add", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, keys.secretOrKey);
    const username = decoded.username;
    await User.updateOne(
      { username: username },
      {
        $push: {
          wishes: {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            need: req.body.need,
          },
        },
      }
    );
    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "failed to push" });
  }
});

/**
 * @route GET api/wishes/getWishlist
 * @desc Get users's wishes
 * @access private to user
 */
router.get("/getWishlist", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, keys.secretOrKey);
    const username = decoded.username;

    const user = await User.findOne({ username: username });
    return res.json(user.wishes);
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token " });
  }
});

module.exports = router;
