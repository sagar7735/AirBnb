const mongoose=require("mongoose");
const initdata=require("./data.js");
const listing=require("../models/listing.js");
 const mongo_url="mongodb://127.0.0.1:27017/wanderlust";

 main().then((res)=>{
    console.log("connected to DB")
}).catch((err)=>{console.log(err)})
async function main(){
 await mongoose.connect(mongo_url)
}

const initdb=async()=>{
    await listing.deleteMany({});
    initdata.data= initdata.data.map((obj)=>({...obj,owner:"67d2505d115b59e4eeaf7020"}))
    // console.log("all data deleted");

    await listing.insertMany(initdata.data);
    console.log("data was intialized");
}
initdb();