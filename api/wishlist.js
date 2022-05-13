const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require("../config/keys"); // Load input validation

const User = require("../models/Users");

/**
 * @route POST api/wishlist/add
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
          wishlists: {
            title: req.body.title,
            description: req.body.description,
            wishes: [],
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

module.exports = router;
