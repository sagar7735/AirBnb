
const listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview=async (req, res) => {
    let listingId = await listing.findById(req.params.id)
    //    console.log(req.body.review);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview)
    listingId.reviews.push(newReview)
    await newReview.save();
    await listingId.save();
    console.log(newReview);
    req.flash("success","new review Created")
    res.redirect(`/listings/${listingId._id}`)
    
}

module.exports.destroyReview=async (req, res,next) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove reference
    req.flash("success"," Review Deleted")
 
    res.redirect(`/listings/${id}`);
  
}