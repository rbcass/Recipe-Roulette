const express = require('express')
const app = express()
const path = require('path')
const router = require('./server/routes/routes')
const port= 4000;

//imports
app.use(express.static(path.join(__dirname, 'public')));



//view engine
// app.set('layout', './layouts/main')
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/',router)



app.listen(port, () =>{
    console.log(`server is running on: ${port}`)
})