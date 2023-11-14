const express = require('express')
const app = express()
const path = require('path')
const router = require('./server/routes/routes')
const { default: mongoose } = require('mongoose')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const port= 4000;
const env = require('dotenv')
env.config()
const {randomString} = require('./utility')

//bla
const secretKey = randomString(666);

//middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
  secret: secretKey,
  resave: true,
  saveUninitialized: true
}))




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
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'Roulette',
        }).then(() => {
          console.log('Connected to MongoDB');
        }).catch(err => {
          console.error('Error connecting to MongoDB:', err);
        });
})

