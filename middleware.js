const ListingDb = require("./models/listing.js");
const review = require("./models/review.js");
const {reviewSchema} = require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
  
  if( ! req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing !");
      return  res.redirect("/login")
    }
    next()
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next()
}

module.exports.isOwner= async(req,res,next)=>{

let {id}=req.params;
  let Listings=await ListingDb.findById(id);
if(!Listings.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of this listing");
   return res.redirect(`/listings/${id}`);
}
next()
}




module.exports.isReviewAuthor= async(req,res,next)=>{

  let {reviewId,id}=req.params;
    let reviewAuthor=await review.findById(reviewId);
  if(!reviewAuthor.author.equals(res.locals.currUser._id)){
      req.flash("error","You are not the author of this review");
     return res.redirect(`/listings/${id}`);
  }
  next()
  }
