const express = require('express')
const router = express.Router()
const db = require('../config/connection')
const bcrypt=require('bcrypt')

const usernameRegex = /^[a-z]+$/;

router.get('/', (req, res) => {
    const user=req.cookies.user
    const admin=req.cookies.admin
    if(user){
      return res.redirect('/home')
    }
    if(admin){
      return res.redirect('/administration')
    }
    res.render('signup')
})
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        const username = data.username;
        const pass=await bcrypt.hash(data.password,3)
        data.password=pass
        console.log(pass);
        if (!usernameRegex.test(username)) {
          return res.render('signup', { usererror: '* Only lowercase letters are allowed, no digits or symbols.' });
        }
    
        if (data.password.length < 8) {
          return res.render('signup', { passerror: '* Password must be at least 8 characters long.' });
        }
    
        const userExist = await db.findOne({ username: username });
        if (userExist) {
          return res.render('signup', { error: 'User Already Exists' });
        }
    
        await db.create(data);
        res.cookie('user',username)
        res.redirect('/home');
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
      }
})

module.exports = router