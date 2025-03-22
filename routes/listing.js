const express=require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const { listingSchema,reviewSchema } = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js")
// const listing = require("../models/listing.js")
const {isLoggedIn, isOwner}=require("../middleware.js");

const ListingDb = require("../models/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })

const listingController=require("../controllers/listings.js")
//Index Route
router
.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn,
    upload.single('listings[image]'),
    wrapAsync(listingController.createListing));
// .post(upload.single('listings[image]'),(req,res)=>{
//     res.send(req.file)
// })

//    NEW LISTINGS
router.get("/new", isLoggedIn,listingController.renderNewForm)


router
.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listings[image]'),
wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))



//show Route

// ADD LISTINGS

//EDIT ROUTE 

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));


// UPDATE ROUTE








module.exports=router;


