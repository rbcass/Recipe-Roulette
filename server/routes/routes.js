const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/User')
const bcrypt = require('bcrypt')



//easy way to manage routes!


router.get('/', (req,res) =>{
    res.render('main')
})

router.get('/login', (req,res) =>{
    res.render('login')
})

//sign up logic
router.get('/signup', (req,res) =>{
    res.render('signup')
})

router.post('/signup', async (req,res) => {
 const {email,password, username} = req.body;

 try{
    //does user exist?
     const existingUser = await User.findOne({email})

     if(existingUser){
        return res.render ('signup', {error:'User with email already exists'})
     }
 
    //hash password for security
    const hashedPassword = await bcrypt.hash(password, 10)
     //new user
     const newUser = new User({email, password: hashedPassword,username})
     await newUser.save()
     res.redirect('/login')

 } 
 catch (error){

    console.error(error);
        res.render('signup', {error:'Error occured.'})
    
 }
 
})



module.exports = router;