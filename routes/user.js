const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../niddleware.js");
const userController = require("../controllers/users.js");

// sign up
router
  .route("/signup")
  .get(userController.renderSignup)
  .post(wrapAsync(userController.signupController));

// Log in
router
  .route("/login")
  .get(userController.loginController)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
);
  


// router.get("/login", userController.loginController);
// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.login
// );

router.get("/logout", userController.logout);
module.exports = router;
