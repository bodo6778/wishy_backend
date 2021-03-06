const express = require("express");
const app = express();
const mongoose = require("mongoose");
const UserModel = require("./models/Users");
const WishModel = require("./models/Wish");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const key = process.env.SECRET;

app.use(express.json());

// app.use(cors({
//   origin: ['https://wishy.vercel.app', 'https://localhost:3000', 'http://localhost:3000']
// }));
app.use(cors());
// const allowCors = fn => async (req, res) => {
//   res.setHeader('Access-Control-Allow-Credentials', true)
//   res.setHeader('Access-Control-Allow-Origin', 'wishy.vercel.app')
//   // another common pattern
//   // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
//   res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
//   )
//   if (req.method === 'OPTIONS') {
//     res.status(200).end()
//     return
//   }
//   return await fn(req, res)
// }

// const handler = (req, res) => {
//   const d = new Date()
//   res.end(d.toString())
// }

// module.exports = allowCors(handler)

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", [
    "https://wishy.vercel.app",
    "https://localhost:3000",
    "http://localhost:3000",
  ]);
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

const handler = (req, res) => {
  const d = new Date();
  res.end(d.toString());
};

allowCors(handler);

module.exports = allowCors(handler);

const db2 = process.env.DB;
const passport = require("passport");
const users = require("./api/users");
const wishes = require("./api/wishes");
const wishlist = require("./api/wishlist");

mongoose
  .connect(db2)
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

app.get("/getUsers", (req, res) => {
  UserModel.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

// app.get("/", (req, res) => {
//   WishModel.find({}, (err, result) => {
//     if (err) {
//       res.json(err);
//     } else {
//       res.json(result);
//     }
//   });
// });

app.post("/api/registerOld", async (req, res) => {
  console.log(req.body);
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);

    await UserModel.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: newPassword,
    });
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", error: "duplicate email" });
  }
});

app.post("/api/login", async (req, res) => {
  console.log(req.body);
  const user = await UserModel.findOne({
    email: req.body.email,
  });

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (isPasswordValid) {
    const token = jwt.sign({ username: user.username, email: user.email }, key);
    return res.json({ status: "ok", user: token });
  } else {
    res.json({ status: "error", user: "true" });
  }
});

app.get("/api/name", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, key);
    const username = decoded.username;
    console.log(decoded);

    const user = await UserModel.findOne({ username: username });
    return res.json({ status: "ok", name: user.name });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token " });
  }
});

app.post("/api/name", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, key);
    const email = decoded.email;
    await User.updateOne({ email: email }, { $set: { name: req.body.name } });
    return res.json({ status: "ok", name: user.name });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token " });
  }
});

app.post("/createUser", async (req, res) => {
  const user = req.body;
  const newUser = new UserModel(user);
  await newUser.save();

  res.json(user);
});

// Passport middleware
app.use(passport.initialize()); // Passport config
require("./config/passport")(passport); // Routes
app.use("/api/users", users);
app.use("/api/wishes", wishes);
app.use("/api/wishlist", wishlist);

app.listen(3001, () => {
  console.log("Server is running...");
});

module.exports = app;
