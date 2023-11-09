const express = require('express')
const router = express.Router()


//easy way to manage routes!


router.get('/', (req,res) =>{
    res.render('index')
})

module.exports = router;