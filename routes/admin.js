const express = require('express')
const router = express.Router()
const db = require('../config/connection')
const bcrypt=require('bcrypt');
const session = require('express-session');

const usernameRegex = /^[a-z]+$/;

router.get('/', async (req, res) => {
    const admin=req.cookies.admin
    const user=req.cookies.admin
    if(admin){
        try {
            const usersData = await db.find().sort({admin:-1})
    
            return res.render('admin', { usersData })
        } catch (error) {
            console.error(error.message);
            return res.status(500).send('Internal Server Error');
        }
    }else{
        if(user){
            return res.redirect('/home')
        }
        return res.redirect('/')
    }
})
router.post('/', async (req, res) => {
    try {
        const user = req.body.search
        let query = {}
        if (user) {
            query = { username: user }

        }
        const usersData = await db.find(query)

        res.render('admin', { usersData })
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})
router.post('/createuser', async (req, res) => {
    try {
        const data = req.body;
        const username = data.username;
        const pass=await bcrypt.hash(data.password,3)
        data.password=pass
        console.log(pass);
        if (!usernameRegex.test(username)) {
          return res.render('admin', { usererror: '* Only lowercase letters are allowed, no digits or symbols.' });
        }
    
        if (data.password.length < 8) {
          return res.render('admin', { passerror: '* Password must be at least 8 characters long.' });
        }
    
        const userExist = await db.findOne({ username: username });
        if (userExist) {
          return res.render('admin', { error: 'User Already Exists' });
        }
    
        await db.create(data);

        res.redirect('/administration')
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})
router.post('/edituser', async (req, res) => {
    try {
        const expr = req.body.username
        const user = await db.findOne({ username: expr });

        if (user) {
            const email = req.body.email
            const admin = req.body.admin

            await db.updateOne(
                { username: expr },
                {
                    $set: {
                        email: email,
                        admin: admin
                    }
                }
            )
            console.log("user updated");
            res.redirect('/administration');
        } else {
            res.render('admin', { editmessage: "user not found" });
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/deleteuser', async (req, res) => {
    try {
        const userid = req.body.user
        await db.deleteOne({ _id: userid })
        res.redirect('/administration')
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }

})
router.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.clearCookie('connect.sid')
        res.clearCookie('user')
        res.clearCookie('admin')
        res.redirect('/')
    })

})

module.exports = router