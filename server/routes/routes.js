const express = require('express')
const router = express.Router()
const passport = require('passport')
const { isAuthenticated } = require('./auth')
const User = require('../models/User')
const Recipe = require('../models/Recipe')
const bcrypt = require('bcrypt')
const app = express();


//local (use user data in views)
const setUserLocals = async (req, res, next) => {
    res.locals.user = req.session.userId ? await User.findById(req.session.userId) : null;
    next();
};

router.use(setUserLocals)


//easy way to manage routes!

//landing
router.get('/', (req,res) =>{
    res.render('main', { user: res.locals.user })
})

//about for optics
router.get('/about', (req,res) =>{
    res.render('about',{ user: res.locals.user })
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
        req.session.save()

        res.redirect('/dashboard'); // Redirect to dashboard or home page after login
    } catch (error) {
        console.error(error);
        res.render('login', { error: 'Error occurred during login' });
    }
    
})

//sign up logic
router.get('/signup', (req,res) =>{
    res.render('signup', { user: res.locals.user })
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



  //RECIPE ROUTES & LOGIC

//GET
router.get('/recipe', async (req, res) => {
    try {
        const recipes = await Recipe.find();

        res.render('recipe', { recipes:recipes});
    } catch (error) {
        console.error(error);
        res.render('error', { error: 'Error fetching recipes' });
    }
});

//POST RECIPE
  router.post('/recipe', async (req, res) => {
    const { title, ingredients, instructions, imageUrl, totalTime } = req.body;
    try {
        // new doc
        const newRecipe = new Recipe({
            title,
            ingredients,
            instructions,
            imageUrl,
            totalTime,
        });

        await newRecipe.save();

        
        res.redirect('/recipe');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//individual recipe? yes
router.get('/recipes/:recipeId', async (req, res) => {
    const { recipeId } = req.params;
  
    try {
      const recipe = await Recipe.findById(recipeId);
  
      res.render('recipeDetails', { recipe });
    } catch (error) {
      console.error(error);
      res.render('error', { error: 'Error fetching the recipe' });
    }
  });
  
module.exports = router;


//SEARCH LOGIC
router.post('/search', async (req, res)=>{
   // const searchItem = req.body.searchItem;
    //more specific regex
    let searchPattern = new RegExp(req.body.search, 'i')
    let rgxString = searchPattern.toString().slice(1, -1)
    console.log('Regex String:', rgxString)
    try {
       // const searchResults = await Recipe.find({ title: { $regex: rgxString, $options: 'i' } });
      // const searchResults = await Recipe.find({ title: req.body.search });

       console.log('Raw Search Term:', req.body.search);

         // reget without trim
        let searchPattern = new RegExp(req.body.search, 'i');
        console.log('Regex String:', searchPattern.toString().slice(1, -1));

          // query (debug)
         const searchResults = await Recipe.find({ title: { $regex: searchPattern } });
        res.render('search', { searchResults });
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    
})
