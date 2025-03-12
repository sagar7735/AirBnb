const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8000;
const listing = require("./models/listing.js")
const path = require("path");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema,reviewSchema } = require("./schema.js")
const Review = require("./models/review.js")
const listingRoute=require("./routes/listing.js")
const reviewRoute=require("./routes/review.js");
const userRoute=require("./routes/user.js")
const session=require("express-session");
const flash = require("connect-flash");
const passport = require("passport"); 
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")                                                   
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
const methodOverride = require("method-override")
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public/css")))
// app.use(express.static(path.join(__dirname, "/public/js")))

const ejsMate = require("ejs-mate");
app.engine('ejs', ejsMate);


const sessionOption={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        // expires:Date.now()+7*24*60*1000,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge:7*24*60*1000,
        httpOnly:true
    }
};
app.use(session(sessionOption));
app.use(flash())
app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


main().then((res) => {
    console.log("connected to DB")
}).catch((err) => { console.log("err") })
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

app.get("/", (req, res) => {
    res.send("server is active")
})

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");

    next()
})
app.get("/demouser", async(req,res,next)=>{
let fakeuser=new User( {
    email:"kumafsdfr@1s23gmail.com",
    username:"aswini"
});
 let registerUser=await User.register(fakeuser,"helloworld")
res.send(registerUser);
next()
})

// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     if (error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(404, errMsg);
//     }
//     next(); // This should always run after the if block if there's no error
// };

app.use("/listings",listingRoute)
app.use("/listings/:id/reviews",reviewRoute)
app.use("/",userRoute)



// app.get("/listings", wrapAsync(async (req, res) => {
//     let alllisting = await listing.find({});
//     res.render("listings/index.ejs", { alllisting })
// }))

// //    NEW LISTINGS
// app.get("/listings/new", (req, res) => {
//     res.render("new.ejs");
// })


// app.get("/listings/:id", wrapAsync(async (req, res) => {
//     // let alllisting= await listing.find({});
//     let { id } = req.params;

//     const Listing = await listing.findById(id).populate("reviews")
//     res.render("listings/show.ejs", { Listing })
// }))

// // ADD LISTINGS
// app.post("/listings", wrapAsync(async (req, res, next) => {
//     // const newListing=new listing(req.body.listings);
//     // await newListing.save()

//     if (!req.body.listings) {
//         throw new ExpressError(400, "send valid data for listing");
//     }

//     //    let result= listingSchema.validate(req.body);
//     //   console.log(result)
//     //         const Listing=(req.body.listings);


//     const newListing = new listing(req.body.listings)
//     await newListing.save()
//     res.redirect("/listings")




//     //WORKING
//     //    let result= listingSchema.validate(req.body);

//     //   console.log(result);



//     //         const newListing=  new listing(req.body.listings)
//     //        await newListing.save()
//     //  res.redirect("/listings")


// }));

// //EDIT ROUTE 

// app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     //    console.log(id)

//     const Listing = await listing.findById(id)
//     res.render("edit.ejs", { Listing })
//     console.log(Listing.price)

//     // res.send(id)
// }));


// // UPDATE ROUTE
// app.put("/listings/:id", wrapAsync(async (req, res) => {
//     if (!req.body.listings) {
//         throw new ExpressError(400, "send valid data for listings")
//     }
//     let { id } = req.params;
//     const updatedListing = req.body.listings;

//     await listing.findByIdAndUpdate(id, updatedListing)

//     res.redirect(`/listings`);
// }))






// app.delete("/listings/:id", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await listing.findByIdAndDelete(id)
//     console.log(deletedListing)
//     res.redirect("/listings")
// }))


// app.post("/listings/:id/reviews", validateReview,wrapAsync(async (req, res) => {

//     let listingId = await listing.findById(req.params.id)
//     //    console.log(req.body.review);
//     let newReview = new Review(req.body.review)
//     listingId.reviews.push(newReview)
//     await newReview.save();
//     await listingId.save();
//     console.log(newReview)
//     res.redirect(`/listings/${listingId._id}`)
    
// }))



// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
//     let { id, reviewId } = req.params;
//     await Review.findByIdAndDelete(reviewId);
//     await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove reference
//     res.redirect(`/listings/${id}`);
// }));








app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"))
})


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { message })
});


app.listen(port, () => {
    console.log(`server is listening  on ${port}`)
})







// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const port = 8000;
// const listing = require("./models/listing.js")
// const path = require("path");
// const wrapAsync = require("./utils/wrapAsync.js")
// const ExpressError = require("./utils/ExpressError.js")
// const { listingSchema,reviewSchema } = require("./schema.js")
// const Review = require("./models/review.js")
// const listingRoute=require("./routes/listing.js")
// const reviewRoute=require("./routes/review.js")
// const session=require("express-session");
// const flash = require("connect-flash");
// const passport = require("passport"); 
// const LocalStrategy=require("passport-local");
// const User=require("./models/user.js")                                                   
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"))
// app.use(express.urlencoded({ extended: true }))
// const methodOverride = require("method-override")
// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "/public/css")))
// const ejsMate = require("ejs-mate");
// const user = require("./models/user.js");
// app.engine('ejs', ejsMate);


// const sessionOption={
//     secret:"mysupersecretcode",
//     resave:false,
//     saveUnintalized:true,
//     cookie:{
//         expires:Date.now()+7*24*60*1000,
//         maxAge:7*24*60*1000,
//         httpOnly:true
//     }
// };
// app.use(session(sessionOption));
// app.use(flash())
// app.use(passport.initialize())
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()))


// main().then((res) => {
//     console.log("connected to DB")
// }).catch((err) => { console.log("err") })
// async function main() {
//     await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
// }

// app.get("/", (req, res) => {
//     res.send("server is active")
// })

// app.use((req,res,next)=>{
//     res.locals.success=req.flash("success");
//     res.locals.error=req.flash("error");

//     next()
// })
// app.get("/demouser", async(req,res,next)=>{
// let fakeuser=new User( {
//     email:"kumafffr@123gmail.com",
//     username:"tafpan"
// });
// //  let registerUser=await User.register(fakeuser,"helloworld")
// let registerUser =await User.register(fakeuser,"bk")
// res.send(registerUser);
// next()
// })

// // const validateReview = (req, res, next) => {
// //     let { error } = reviewSchema.validate(req.body);
// //     if (error) {
// //         let errMsg = error.details.map((el) => el.message).join(",");
// //         throw new ExpressError(404, errMsg);
// //     }
// //     next(); // This should always run after the if block if there's no error
// // };

// app.use("/listings",listingRoute)
// app.use("/listings/:id/reviews",reviewRoute)



// // app.get("/listings", wrapAsync(async (req, res) => {
// //     let alllisting = await listing.find({});
// //     res.render("listings/index.ejs", { alllisting })
// // }))

// // //    NEW LISTINGS
// // app.get("/listings/new", (req, res) => {
// //     res.render("new.ejs");
// // })


// // app.get("/listings/:id", wrapAsync(async (req, res) => {
// //     // let alllisting= await listing.find({});
// //     let { id } = req.params;

// //     const Listing = await listing.findById(id).populate("reviews")
// //     res.render("listings/show.ejs", { Listing })
// // }))

// // // ADD LISTINGS
// // app.post("/listings", wrapAsync(async (req, res, next) => {
// //     // const newListing=new listing(req.body.listings);
// //     // await newListing.save()

// //     if (!req.body.listings) {
// //         throw new ExpressError(400, "send valid data for listing");
// //     }

// //     //    let result= listingSchema.validate(req.body);
// //     //   console.log(result)
// //     //         const Listing=(req.body.listings);


// //     const newListing = new listing(req.body.listings)
// //     await newListing.save()
// //     res.redirect("/listings")




// //     //WORKING
// //     //    let result= listingSchema.validate(req.body);

// //     //   console.log(result);



// //     //         const newListing=  new listing(req.body.listings)
// //     //        await newListing.save()
// //     //  res.redirect("/listings")


// // }));

// // //EDIT ROUTE 

// // app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
// //     let { id } = req.params;
// //     //    console.log(id)

// //     const Listing = await listing.findById(id)
// //     res.render("edit.ejs", { Listing })
// //     console.log(Listing.price)

// //     // res.send(id)
// // }));


// // // UPDATE ROUTE
// // app.put("/listings/:id", wrapAsync(async (req, res) => {
// //     if (!req.body.listings) {
// //         throw new ExpressError(400, "send valid data for listings")
// //     }
// //     let { id } = req.params;
// //     const updatedListing = req.body.listings;

// //     await listing.findByIdAndUpdate(id, updatedListing)

// //     res.redirect(/listings);
// // }))






// // app.delete("/listings/:id", wrapAsync(async (req, res) => {
// //     let { id } = req.params;
// //     let deletedListing = await listing.findByIdAndDelete(id)
// //     console.log(deletedListing)
// //     res.redirect("/listings")
// // }))


// // app.post("/listings/:id/reviews", validateReview,wrapAsync(async (req, res) => {

// //     let listingId = await listing.findById(req.params.id)
// //     //    console.log(req.body.review);
// //     let newReview = new Review(req.body.review)
// //     listingId.reviews.push(newReview)
// //     await newReview.save();
// //     await listingId.save();
// //     console.log(newReview)
// //     res.redirect(/listings/${listingId._id})
    
// // }))



// // app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
// //     let { id, reviewId } = req.params;
// //     await Review.findByIdAndDelete(reviewId);
// //     await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove reference
// //     res.redirect(/listings/${id});
// // }));








// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"))
// })


// app.use((err, req, res, next) => {
//     let { statusCode = 500, message = "Something went wrong!" } = err;
//     // res.status(statusCode).send(message);
//     res.status(statusCode).render("error.ejs", { message })
// });


// app.listen(port, () => {
//     console.log(`server is listening  on ${port}`)
// })








