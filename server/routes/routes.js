const express = require('express')
const router = express.Router()
const passport = require('passport')



//easy way to manage routes!


router.get('/', (req,res) =>{
    res.render('main')
})

router.get('/login', (req,res) =>{
    res.render('login')
})

module.exports = router;