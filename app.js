const express = require('express')
const app = express()
const path = require('path')
const router = require('./server/routes/routes')
const mongoose = require('mongoose');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const port= 4000;
const env = require('dotenv')
env.config()
const {randomString} = require('./utility')
const bodyParser = require('body-parser');

//bla
const secretKey = randomString(666);
const User = require('./server/models/User')

//middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
  secret: secretKey,
  resave: true,
  saveUninitialized: true
}))
app.use((req, res, next) => {
    req.User = User;
    next();
  });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




//view engine
// app.set('layout', './layouts/main')
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/',router)



//connect to server & cluster
app.listen(port, () =>{
    console.log(`server is running on: ${port}`);
    mongoose.connect(`${process.env.MONGOURI}`, {
        //deprecated, change.
        
        dbName: 'Roulette',
        }).then(() => {
          console.log('Connected to MongoDB');
        }).catch(err => {
          console.error('Error connecting to MongoDB:', err);
        });
})

