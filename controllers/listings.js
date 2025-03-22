const ListingDb=require("../models/listing")

module.exports.index=async (req, res) => {
    let alllisting = await ListingDb.find({});
    res.render("listings/index.ejs", { alllisting })
}



module.exports.renderNewForm=(req, res) => {
   
    res.render("new.ejs");
}



module.exports.showListing=async (req, res) => {
    // let alllisting= await listing.find({});
    let { id } = req.params;

    const Listing = await ListingDb.findById(id)
    .populate({path:"reviews",populate:{
        path:"author"
    }}).populate("owner");
    if(! Listing){
        req.flash("error","Listing not found !")
        res.redirect("/listings")
    }
    // console.log(Listing)
    res.render("listings/show.ejs", { Listing })
}


module.exports.createListing=async (req, res, next) => {
    // const newListing=new listing(req.body.listings);
    // await newListing.save()

    if (!req.body.listings) {
        throw new ExpressError(400, "send valid data for listing");
    }

    //    let result= listingSchema.validate(req.body);
    //   console.log(result)
    //         const Listing=(req.body.listings);

    let url=req.file.path;
    let filename=req.file.filename;
// console.log(url,filename)
    const newListing = new ListingDb(req.body.listings);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing Creates")
    res.redirect("/listings")




    //WORKING
    //    let result= listingSchema.validate(req.body);

    //   console.log(result);



    //         const newListing=  new listing(req.body.listings)
    //        await newListing.save()
    //  res.redirect("/listings")


}



module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    //    console.log(id)

    const Listing = await ListingDb.findById(id)
    if(! Listing){
        req.flash("error","Listing not found !")
        res.redirect("/listings")
    }
    let originalImageUrl=Listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
    res.render("edit.ejs", { Listing,originalImageUrl })

    // res.send(id)
}

module.exports.updateListing=async (req, res) => {
    if (!req.body.listings) {
        throw new ExpressError(400, "send valid data for listings")
    }
    
    let { id } = req.params;

    
    const updatedListing = req.body.listings;
// let Listings=await Listing.findById(id);
// if(!Listings.owner._id.equals(res.locals.currUser._id)){
//     req.flash("error","You are not the owner of this listing");
//    return res.redirect(`/listings/${id}`);
// }
    const Listing = await ListingDb.findByIdAndUpdate(id, updatedListing, { new: true });
    if ( typeof req.file !== 'undefined'){
        let url=req.file.path;
        let filename=req.file.filename;
        Listing.image={url,filename};
        await Listing.save()
} 
 
    
    req.flash("success","Listing Updated !")
                                        
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await ListingDb.findByIdAndDelete(id)
    console.log(deletedListing);
    req.flash("success","Listing Deleted")
    res.redirect("/listings")
}