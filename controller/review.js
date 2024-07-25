const Listing = require("../models/listing.js")
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.createReviews = async (req,res) =>
{ let listing=  await Listing.findById(req.params.id);
  // console.log(listing)
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
   listing.reviews.push(newReview);
     console.log(newReview);

   await newReview.save();
   await listing.save();

  console.log("new review saved");

  res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReviews = async(req,res) =>
{
 let { id, reviewId} = req.params;
 await Listing.findByIdAndUpdate(id , {$pull : { reviews : reviewId}});
 await Review.findByIdAndDelete(reviewId);

 res.redirect(`/listings/${id}`);
};

