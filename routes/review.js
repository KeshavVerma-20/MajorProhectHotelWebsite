const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
let { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../niddleware.js")
const reviewController=require("../controllers/review.js")
// routes mai ho common route hota hai usse hata k bs / likhdo

// database ke ander store karwayegay toh function async type ka hoga
// for reviews
// wrapasync for error handling


// create review
router.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(reviewController.createRewiew)
);

// Deleting reviews
// mongo pull operator
//pull operator removes from an existing array all instances of a valueor values that match a spesific condition
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteController)
);

module.exports = router;
