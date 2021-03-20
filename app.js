const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const userRoutes  = require('./routes/user')

const httperror = require('./models/error');

const mongoose = require('mongoose');

app.use(bodyParser .json());

app.use('/api/user',userRoutes)




app.use((req,res,next)=>{
    const error = new httperror('could not find that page',404);
    throw error;
})

app.use((error,req,res,next) => {
    if(res.headerSent){

        return next(error)
    }
    res.status(error.code || 500);
    res.json({message:error.message ||'an unknown error occurred '})
})

mongoose
.connect('mongodb+srv://admin:admin2021@cluster0.m6xpn.mongodb.net/PFE2021?retryWrites=true&w=majority')
.then(()=>{
    app.listen(5000);
})
.catch(err=>{
    console.log(err)

})


