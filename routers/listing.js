const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Listing = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema} = require("../schema.js")
const {isLoggedIn, isOwner , validateListing} = require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })
const listingController = require("../controller/listings.js");





router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
    
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.newlisting),
);
//----------------------------------------------Index Route----------------------------------------------

router.get("/new",isLoggedIn ,listingController.newRender);

router
.route("/:id")
.get(wrapAsync(listingController.readlisting))
.put(
 isLoggedIn , isOwner,
 upload.single("listing[image]"),
 validateListing,
wrapAsync(listingController.updateListings))
.delete(
    isLoggedIn , isOwner, 
wrapAsync(listingController.destroyListings));

//----------------------------------------------CREATE (New & Create Route)----------------------------------------------


//----------------------------------------------READ (Show Route)----------------------------------------------

//----------------------------------------------UPDATE (Edit & Update Route)----------------------------------------------
router.get("/:id/edit", 
isLoggedIn ,isOwner,
wrapAsync(listingController.editListings));



//----------------------------------------------DELETE (Delete Route)----------------------------------------------




//export----------------
module.exports = router;