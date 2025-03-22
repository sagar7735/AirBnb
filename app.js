if(process.env.NODE_ENV !="production"){
    require("dotenv").config()

}
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
const MongoStore = require('connect-mongo');

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
let dbUrl=process.env.ATLASDB_URL
const ejsMate = require("ejs-mate");
app.engine('ejs', ejsMate);

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE")
})
const sessionOption={
    store,
    secret:process.env.SECRET,
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
// var dbUrl=process.env.ATLASDB_URL

main().then((res) => {
    console.log("connected to DB")
}).catch((err) => { console.log("err") })
async function main() {
    // await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
await mongoose.connect(dbUrl)
}

// app.get("/", (req, res) => {
//     res.send("server is active")
// })

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
res.locals.currUser=req.user;
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




