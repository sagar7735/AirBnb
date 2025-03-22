const User=require("../models/user")
module.exports.renederSignupForm=(req, res) => {
    res.render("users/signup.ejs")
}


module.exports.signUp=async (req, res,next) => {

    try {
        const { username, email, password } = req.body;
        console.log(username, email, password);
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password)
     req.login(registeredUser,(err)=>{
        if(err){
            return next(err)
        }
        req.flash("success", "welcome to Wanderlust");
        res.redirect("/listings");
     })
     

    }
    catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup")
    }

}

module.exports.renderLoginForm=(req, res) => {
    res.render("users/login.ejs")
}

module.exports.login= async (req, res) => {

    req.flash("success", "welcome back to Wanderlust");
    // res.redirect("/listings")
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)

}

module.exports.logout= (req, res, next) => {

    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "You have been logged out !")
        res.redirect("/listings")
    })
}