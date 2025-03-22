const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const userController=require("../controllers/user.js")
const { saveRedirectUrl } = require("../middleware.js");


router
.route("/signup")
.get(userController.renederSignupForm )
.post( wrapAsync(userController.signUp))

//LOGIN

router
.route("/login")
.get(userController.renderLoginForm )

.post(saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: '/login',
    failureFlash: true
}),userController.login);


router.get("/logout",userController.logout)








module.exports = router;