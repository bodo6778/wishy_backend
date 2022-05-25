const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const key = process.env.SECRET;

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login"); // Load User model

const User = require("../models/Users");

/**
 * @route get api/users/listUsers
 * @desc Find all users
 * @access Public
 */
 router.get("/listUsers", async (req, res) => {
  try {

    const user = await User.findOne({});
    return res.json({
      username: user.username,
      email: user.email,
      name: user.name,
      description: user.description,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: error });
  }
});


/**
 * @route POST api/users/register
 * @desc Register user
 * @access Public
 */
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

/**  @route POST api/users/login
 * @desc Login user and return JWT token
 * @access Public
 */
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body); // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(400).json({ emailnotfound: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          username: user.username,
        };

        // Sign token
        jwt.sign(
          payload,
          key,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              username: payload.username,
              token: token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

/**
 * @route GET api/users/getProfile
 * @desc Get users's profile
 * @access private to user
 */
router.get("/getProfile", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, key);
    const username = decoded.username;

    const user = await User.findOne({ username: username });
    return res.json({
      username: user.username,
      email: user.email,
      name: user.name,
      description: user.description,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token " });
  }
});

/**
 * @route POST api/users/change
 * @desc Change user's profile
 * @access Private
 */
router.post("/change", async (req, res) => {
  const token = req.headers["x-access-token"];
  const decoded = jwt.verify(token, key);
  const username = decoded.username;

  console.log(req.body);

  try {
    if (req.body.username !== "") {
      const usernameExists = User.findOne({
        username: req.body.username,
      });
      if (usernameExists) {
        res.status(400);
        throw new Error("Username already exists");
      }
    }

    if (req.body.email !== "") {
      const emailExists = User.findOne({ email: req.body.email });
      if (emailExists) {
        res.status(400);
        throw new Error("Email already exists");
      }
    }
  } catch (error) {
    console.error(error);
  }

  try {
    await User.updateOne(
      { username: username },
      {
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        description: req.body.description,
      }
    );
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "failed to push" });
  }
});

module.exports = router;
