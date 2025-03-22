// const mongoose=require("mongoose");
// const schema=mongoose.Schema;

// const listingSchema=new schema({
//     title:{
//         type:String,
//         required:true,
//     },
//     description:String,
//     image:{
//         type:String,
// set:(v)=>v==="" ? "https://unsplash.com/photos/a-blurry-image-of-a-man-in-a-suit-k98RB1I7LTQ"
//    :v,
//  },
//     price:Number,
//     location:String,
//     country:String

// });

// const listing=mongoose.model("listing",listingSchema);
// module.exports=listing;



const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review.js")
const listingSchema = new schema({
    title: {
        type: String,
        required: true,
    },
    description: {  // Corrected the typo here
        type: String,
        required: true, // You might want to make this required as well
    },
    // image: {
    //     filename: {
    //         type: String,
    //        // Make filename required if necessary
    //     },
    //     url: {
    //         type: String,
    //         default: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWx8ZW58MHx8MHx8fDA%3D",
    //         set: (v) => v === "" ? "https://plus.unsplash.com/premium_photo-1675745329954-9639d3b74bbf?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    //     },

    // },
    image: {
        url: String,
        filename: String
    },

    price: {
        type: Number,
        required: true, // You might want to make this required as well
    },
    location: {
        type: String,
        required: true, // You might want to make this required as well
    },
    country: {
        type: String,
        required: true, // You might want to make this required as well
    },
    reviews: [
        {
            type: schema.Types.ObjectId,
            ref: "Review"
        },

    ],

    owner:
    {
        type: schema.Types.ObjectId,
        ref: "User",
    },


});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })

    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
