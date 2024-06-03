const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const {validateReview, isLoggedIn , isreviewAuthor} = require("../middleware.js");


const reviewController = require("../controller/review.js");
// create review route
router.post("/" ,  
validateReview ,
isLoggedIn

, wrapAsync(reviewController.createReviews));
 // delete review route
router.delete("/:reviewId" ,
isLoggedIn, 
isreviewAuthor,
wrapAsync(reviewController.destroyReviews));



module.exports = router;



