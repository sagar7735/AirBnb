
const express=require("express")
const router=express.Router();


router.get("/",(req,res)=>{
    res.send('get request for post')
})

router.get("/:id",(req,res)=>{
    res.send('get request for post id')
})
router.post("/",(req,res)=>{
    res.send('post request for post ')
})
router.delete("/:id",(req,res)=>{
    res.send('delete  request for post ')
})

module.exports=router;
