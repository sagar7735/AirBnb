const express=require("express");
const router=express.Router();
const User=require("../models/user.js");                                                   
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport")
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup",  wrapAsync(async(req,res)=>{
   
   try{
    const {username,email,password}=req.body;
    console.log(username,email,password);
    const newUser=new User({username,email});
    const registeredUser= await User.register(newUser,password)
   
    req.flash("success","welcome to Wanderlust");
    res.redirect("/listings");

   }
   catch(err){
req.flash("error",err.message);
res.redirect("/signup")
   }
    
}))

//LOGIN

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})

router.post("/login", passport.authenticate("local", {
    failureRedirect: '/login',
    failureFlash: true
}),async (req, res) => {
   
    req.flash("success","welcome back to Wanderlust");
    res.redirect("/listings")
});


// router.get("/logout",(req,res,next)=>{
//     const{username}=req.params;
//     console.log(username)
// })








module.exports=router;