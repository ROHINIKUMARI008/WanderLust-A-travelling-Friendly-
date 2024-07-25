const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controller/user.js");


router.route("/signup" )
.get( userController.renderSignup)
.post( wrapAsync(userController.formSignup));


router.route("/login")
.get( userController.renderLoginForm)
.post(saveRedirectUrl,  passport.authenticate("local", { 
    failureRedirect : '/login' , 
    failureFlash : true}) ,
    userController.formLogin);


 router.get("/logout", userController.logout); 
module.exports = router;