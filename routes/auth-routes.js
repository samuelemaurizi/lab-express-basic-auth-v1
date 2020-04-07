const express = require("express");
const authRoutes = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const User = require("../models/user");

// //////////////////////////////////////////////////
// ///////////////////////// GET SIGNUP PAGE
authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// ///////////////////////// POST SIGNUP DATA
authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  // Check if the fields are empty
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate username and password"
    });
    return;
  }

  // Check if the username already exist
  User.findOne({ username: username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", { errorMessage: "Username already exist" });
        return;
      }

      // Create a new user
      const newUser = User({
        username,
        password: hashPass
      });

      newUser.save().then(user => {
        console.log("User saved: ", user);
        res.redirect("/auth/login");
      });
    })
    .catch(err => {
      next(err);
    });
});

// //////////////////////////////////////////////////
// ///////////////////////// GET LOGIN PAGE
authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login");
});

// ///////////////////////// POST LOGIN DATA
authRoutes.post("/login", (req, res, next) => {
  // let { username, password } = req.body;
  const username = req.body.username;
  const password = req.body.password;

  // Check if the fields are empty
  if (username === "" || password === "") {
    res.render("auth/login", { errorMessage: "Insert username and password." });
    return;
  }

  // Check the username and password
  User.findOne({ username: username })
    .then(user => {
      // If no account already
      if (!user) {
        res.render("auth/login", { errorMessage: "No such user." });
        return;
      }
      // If user exist check password
      if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("main");
      } else {
        res.render("auth/login", { messageError: "Password incorrect." });
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = authRoutes;
