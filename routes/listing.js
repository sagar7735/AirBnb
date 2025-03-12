const express=require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const { listingSchema,reviewSchema } = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js")
const listing = require("../models/listing.js")
const {isLoggedIn}=require("../middleware.js")


router.get("/", wrapAsync(async (req, res) => {
    let alllisting = await listing.find({});
    res.render("listings/index.ejs", { alllisting })
}))

//    NEW LISTINGS
router.get("/new", isLoggedIn,(req, res) => {
   
    res.render("new.ejs");
})


router.get("/:id", wrapAsync(async (req, res) => {
    // let alllisting= await listing.find({});
    let { id } = req.params;

    const Listing = await listing.findById(id).populate("reviews");
    if(! Listing){
        req.flash("error","Listing not found !")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { Listing })
}))

// ADD LISTINGS
router.post("/",isLoggedIn, wrapAsync(async (req, res, next) => {
    // const newListing=new listing(req.body.listings);
    // await newListing.save()

    if (!req.body.listings) {
        throw new ExpressError(400, "send valid data for listing");
    }

    //    let result= listingSchema.validate(req.body);
    //   console.log(result)
    //         const Listing=(req.body.listings);


    const newListing = new listing(req.body.listings)
    await newListing.save();
    req.flash("success","New Listing Creates")
    res.redirect("/listings")




    //WORKING
    //    let result= listingSchema.validate(req.body);

    //   console.log(result);



    //         const newListing=  new listing(req.body.listings)
    //        await newListing.save()
    //  res.redirect("/listings")


}));

//EDIT ROUTE 

router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    //    console.log(id)

    const Listing = await listing.findById(id)
    if(! Listing){
        req.flash("error","Listing not found !")
        res.redirect("/listings")
    }
    res.render("edit.ejs", { Listing })

    // res.send(id)
}));


// UPDATE ROUTE
router.put("/:id",isLoggedIn, wrapAsync(async (req, res) => {
    if (!req.body.listings) {
        throw new ExpressError(400, "send valid data for listings")
    }
    let { id } = req.params;
    const updatedListing = req.body.listings;

    await listing.findByIdAndUpdate(id, updatedListing)
    req.flash("success","Listing Updated !")
                                        
    res.redirect(`/listings/${id}`);
}))






router.delete("/:id",isLoggedIn,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await listing.findByIdAndDelete(id)
    console.log(deletedListing);
    req.flash("success","Listing Deleted")
    res.redirect("/listings")
}))


module.exports=router;


