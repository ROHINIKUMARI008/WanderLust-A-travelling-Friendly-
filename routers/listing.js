const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")

const {isLoggedIn, isOwner , validateListing} = require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })
const listingController = require("../controller/listings.js");

//----------------------------------------------Index Route----------------------------------------------
router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.newlisting),
);
//----------------------------------------------CREATE (New & Create Route)----------------------------------------------
router.get("/new",isLoggedIn ,listingController.newRender);


//----------------------------------------------READ (Show Route)----------------------------------------------

router
.route("/:id")
.get(wrapAsync(listingController.readlisting))
.put(
 isLoggedIn , isOwner,
 upload.single("listing[image]"),
 validateListing,
wrapAsync(listingController.updateListings))

.delete( //----------------------------------------------DELETE (Delete Route)----------------------------------------------
    isLoggedIn ,isOwner,
wrapAsync(listingController.destroyListing));




//----------------------------------------------UPDATE (Edit & Update Route)----------------------------------------------
router.get("/:id/edit", 
isLoggedIn ,isOwner,
wrapAsync(listingController.editListings));



//export----------------
module.exports = router;