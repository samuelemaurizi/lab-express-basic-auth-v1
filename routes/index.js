const express = require("express");
const router = express.Router();

// ////////////////////////////// GET landing page
router.get("/", (req, res, next) => {
  let loggedIn = { isLogged: false };
  if (req.session.currentUser) {
    loggedIn.isLogged = true;
  }
  res.render("index");
});

// ////////////////////////////// MIDDLEWARE TO CHECK IF USER IS LOGGED IN
let isUserLoggedIn = (req, res, next) => {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect("/login");
  }
};
// ////////////////////////////// GET MAIN PAGE FOR AUTH
router.get("/main", isUserLoggedIn, (req, res, next) => {
  res.render("main");
});

// ////////////////////////////// GET PRIVATE PAGE FOR AUTH
router.get("/private", isUserLoggedIn, (req, res, next) => {
  res.render("private");
});

// ////////////////////////////// LOGOUT
router.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    res.redirect("/");
  });
});

module.exports = router;
