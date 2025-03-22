
const express =require("express")
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const listing = require("../models/listing.js")
const Review = require("../models/review.js")
const { listingSchema,reviewSchema } = require("../schema.js");
const { isLoggedIn ,isReviewAuthor} = require("../middleware.js");
const reviewController=require("../controllers/reviews.js")
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    }
    next(); // This should always run after the if block if there's no error
};

router.post("/", validateReview,isLoggedIn, wrapAsync(reviewController.createReview))



router.delete("/:reviewId",
    isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports=router;