const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const key = process.env.SECRET;

const User = require("../models/Users");

/**
 * @route POST api/wishlist/add
 * @desc Add wishlist to user
 * @access private to user
 */
router.post("/add", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, key);
    const username = decoded.username;

    const wishlist = await User.findOne({
      username: username,
      "wishlists.title": req.body.title,
    });
    if (wishlist) {
      throw "Wishlist already exists!";
    }

    await User.updateOne(
      { username: username },
      {
        $push: {
          wishlists: {
            title: req.body.title,
            wishes: [],
            hidden: false,
          },
        },
      }
    );

    return res.json({});
  } catch (error) {
    res.status(400);
    return res.json({ status: "error", error: error });
  }
});

/**
 * @route POST api/wishlist/delete
 * @desc Delete wishlist from user
 * @access private to user
 */
router.delete("/delete", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, key);
    const username = decoded.username;
    await User.updateOne(
      {
        username: username,
      },
      { $pull: { wishlists: { title: req.body.title } } }
    );
    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "failed to delete" });
  }
});

/**
 * @route POST api/wishlist/hide
 * @desc Hide/Unhide wishlist of user
 * @access private to user
 */
router.post("/hide", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, key);
    const username = decoded.username;
    await User.findOneAndUpdate(
      {
        username: username,
      },
      { $set: { "wishlists.$[q].hidden": req.body.hidden } },
      {
        arrayFilters: [
          {
            "q.title": req.body.title,
          },
        ],
      }
    );
    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "failed to hide" });
  }
});
module.exports = router;
