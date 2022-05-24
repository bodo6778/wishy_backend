const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/Users");
const Wish = require("../models/Wish");
const key = process.env.secretOrKey;

/**
 * @route POST api/wishes/add
 * @desc Add wish to user
 * @access private to user
 */
router.post("/add", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, key);
    const username = decoded.username;
    await User.updateOne(
      { username: username, "wishlists.title": req.body.wishlistTitle },
      {
        $push: {
          "wishlists.$[q].wishes": {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            need: req.body.need,
            links: [],
          },
        },
      },
      {
        arrayFilters: [
          {
            "q.title": req.body.wishlistTitle,
          },
        ],
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
router.get("/getWishlists", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, key);
    const username = decoded.username;

    const user = await User.findOne({ username: username });
    return res.json(user.wishlists);
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token " });
  }
});

/**
 * @route POST api/wishes/addLink
 * @desc Add wish to user
 * @access private to user
 */
router.post("/addLink", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, key);
    const username = decoded.username;
    await User.updateOne(
      {
        username: username,
        "wishlists.title": req.body.wishlistTitle,
        "wishlists.wishes.title": req.body.wishTitle,
      },
      {
        $push: {
          "wishlists.$[p].wishes.$[q].links": {
            link: req.body.link,
            price: req.body.price,
            pricy: req.body.pricy,
          },
        },
      },
      {
        arrayFilters: [
          {
            "p.title": req.body.wishlistTitle,
          },
          {
            "q.title": req.body.wishTitle,
          },
        ],
      }
    );
    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "failed to push" });
  }
});

/**
 * @route POST api/wishes/deleteLink
 * @desc Delete link from wish
 * @access private to user
 */
router.delete("/deleteLink", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, key);
    const username = decoded.username;
    await User.updateOne(
      {
        username: username,
        "wishlists.title": req.body.wishlistTitle,
        "wishlists.wishes.title": req.body.wishTitle,
      },
      {
        $pull: {
          "wishlists.$[p].wishes.$[q].links": {
            link: req.body.linkTitle,
          },
        },
      },
      {
        arrayFilters: [
          {
            "p.title": req.body.wishlistTitle,
          },
          {
            "q.title": req.body.wishTitle,
          },
        ],
      }
    );
    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "failed to push" });
  }
});

/**
 * @route POST api/wishes/delete
 * @desc Delete wish from user's wishlists
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
        "wishlists.title": req.body.wishlistTitle,
      },
      { $pull: { "wishlists.$[q].wishes": { title: req.body.wishTitle } } },
      {
        arrayFilters: [
          {
            "q.title": req.body.wishlistTitle,
          },
        ],
      }
    );
    return res.json({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "failed to delete" });
  }
});

module.exports = router;
