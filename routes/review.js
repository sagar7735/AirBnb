
const express =require("express")
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const listing = require("../models/listing.js")
const Review = require("../models/review.js")
const { listingSchema,reviewSchema } = require("../schema.js")

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    }
    next(); // This should always run after the if block if there's no error
};

router.post("/", validateReview,wrapAsync(async (req, res) => {
    let listingId = await listing.findById(req.params.id)
    //    console.log(req.body.review);
    let newReview = new Review(req.body.review)
    listingId.reviews.push(newReview)
    await newReview.save();
    await listingId.save();
    console.log(newReview);
    req.flash("success","new review Created")
    res.redirect(`/listings/${listingId._id}`)
    
}))



router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove reference
    req.flash("success"," Review Deleted")

    res.redirect(`/listings/${id}`);
}));

module.exports=router;