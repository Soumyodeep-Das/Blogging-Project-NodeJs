const express = require("express")
const User = require("../models/user")

const router = express.Router();

router.get('/signup', (req, res) => {
    return res.render('signup')
})

router.get('/login', (req, res) => {
    return res.render('login')
})

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body
    await User.create({
        fullName,
        email,
        password,
    })
    return res.redirect('/')
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = User.matchPassword(email, password)

    console.log(user)
    return res.redirect('/')
})

module.exports = router