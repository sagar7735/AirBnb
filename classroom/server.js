const express=require('express')
const app=express();
const users=require("./routes/user.js")
const posts=require("./routes/post.js");
const cookieParser = require('cookie-parser');
const session=require("express-session")
const flash=require("connect-flash")
const path=require("path")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.use(session({secret:"mysupersecretstring",resave:false,saveUninitialized:true}))
app.use(flash())


app.get("/register",(req,res)=>{

const {name}=req.query;
req.session.name=name;
req.flash("success","user registered sucessfully")
console.log(name)

res.redirect("/home")

})

app.get("/home",(req,res)=>{
    res.locals.messages=req.flash("success")
    res.render("page.ejs",{name:req.session.name})
})





// app.get("/request",(req,res)=>{
//     if(req.session.count){
//         req.session.count ++;
//     }
//     else{
//         req.session.count=1
//     }
//     res.send(`you sent a request x times ${req.session.count}`)
// })





// app.get("/test",(req,res)=>{
//     res.send("test secessfull")
// })

// app.use("/users",users)
// app.use("/posts",posts)
// app.use(cookieParser("secretcode"))


// app.get("/getsignedcookies",(req,res)=>{
// res.cookie("made-in","India",{signed:true})
// res.send("signed cookies sent")
// })

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified")
//     })
    


// app.get("/getcookies",(req,res)=>{
//     res.cookie("great","hello");
//     res.send("sent u some cookies");
// })

// app.get("/",(req,res)=>{
//     console.log(req.cookies)
//     res.send("hii i am root")
// })


app.listen(3000,(req,res)=>{
    console.log("server is listening")
})