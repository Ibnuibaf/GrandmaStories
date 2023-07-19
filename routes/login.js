const express = require('express')
const router = express.Router()
const db = require('../config/connection')
const bcrypt = require('bcrypt')

router.get('/', (req, res) => {
    const user = req.cookies.user
    const admin = req.cookies.admin
    if (user) {
        return res.redirect('/home')
    }
    if (admin) {
        return res.redirect('/administration')
    }
    res.render('login')
})
router.post('/', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const user = await db.findOne({ username: username });

        if (!user) {
            return res.render('login', { error: 'User not found!' });
        }

        const samepass = await bcrypt.compare(password, user.password);

        if (samepass) {
            if (user.admin === true) {
                res.cookie('admin', user.admin);
                res.redirect('/administration');
            } else {
                res.cookie('user', username);
                res.redirect('/home');
            }
        } else {
            res.render('login', { error: 'Password is incorrect!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router