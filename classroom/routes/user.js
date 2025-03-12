
const express=require("express")
const router=express.Router();
router.get("/",(req,res)=>{
    res.send('get request for user')
})

router.get("/:id",(req,res)=>{
    res.send('get request for user id')
})
router.post("/",(req,res)=>{
    res.send('post request for user ')
})
router.delete("/:id",(req,res)=>{
    res.send('delete  request for user ')
})

module.exports=router;