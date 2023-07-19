const express=require('express')
const router=express.Router()



router.get('/',(req,res)=>{
    const user=req.cookies.user
    const admin=req.cookies.admin
    if(user){
      return res.redirect('/home')
    }
    if(admin){
      return res.redirect('/administration')
    }
    res.render('index')
})

module.exports=router