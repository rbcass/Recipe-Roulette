const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/User')
const bcrypt = require('bcrypt')



//easy way to manage routes!


router.get('/', (req,res) =>{
    res.render('main')
})

//LOG IN ROUTES
router.get('/login', (req,res) =>{
    res.render('login')
})

router.post('/login', async (req,res) =>{
    const {email, password} = req.body;

    try{
        //Comparison against database values
        const u_ser = await User.findOne({email});
        if(!u_ser){
            return res.render('login', {error: 'Invalid email or password'})
        }

        const passport_Match = await bcrypt.compare(password, u_ser.password)
        if(!passport_Match){
            return res.render('login', {error:'incorrect password'})
        }

        //user session and redirection if succesful
        req.session.userId = u_ser._id;

        res.redirect('/dashboard'); // Redirect to dashboard or home page after login
    } catch (error) {
        console.error(error);
        res.render('login', { error: 'Error occurred during login' });
    }
    
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

//dashboard (after log in)
router.get('/dashboard', async (req, res) => {
    try {
        //check session
        if (!req.session.userId) {
            return res.redirect('/login'); 
        }

        const user = await User.findById(req.session.userId);

        if (!user) {
            return res.redirect('/login'); 
        }

        res.render('dashboard', { username: user.username }); 
    } catch (error) {
        console.error(error);
        res.render('dashboard', { error: 'Error fetching user information' });
    }
})


module.exports = router;