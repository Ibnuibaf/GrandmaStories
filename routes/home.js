const express=require('express')
const router=express.Router()

router.get('/',(req,res)=>{
    const user=req.cookies.user
    const admin=req.cookies.admin
    if(user || admin){
        return res.render('home')
    }
    res.redirect('/')
})
router.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.clearCookie('connect.sid')
        res.clearCookie('user')
        res.clearCookie('admin')
        res.redirect('/')
    })

})

module.exports=router