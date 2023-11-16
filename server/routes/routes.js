const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/User')
const bcrypt = require('bcrypt')


//local (use user data in views)
const setUserLocals = async (req, res, next) => {
    res.locals.user = req.session.userId ? await User.findById(req.session.userId) : null;
    next();
};

app.use(setUserLocals)


//easy way to manage routes!

//landing
router.get('/', (req,res) =>{
    res.render('main', { username: user.username, user: user })
})

//LOG IN ROUTES
router.get('/login', (req,res) =>{
    res.render('login', { user: req.session.user || null })
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
    res.render('signup', { user: req.session.user })
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

//dashboard (after log in), maybe add image, bio if have time
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

        res.render('dashboard', { user: user }); 
    } catch (error) {
        console.error(error);
        res.render('dashboard', { error: 'Error fetching user information' });
    }
})

//logout logic
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.redirect('/'); 
    });
  });

module.exports = router;