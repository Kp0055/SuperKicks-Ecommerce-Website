const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')  
const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');
const nodemailer = require('nodemailer');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const multer = require('multer');
const connectDB = require('./public/javascripts/mongo');
const errorHandler = require('./middileware/errormiddleware');



require('dotenv').config()

//mongoconnected 

connectDB();


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//session 

app.use(session({
  secret:'happy',
  resave:false,
  saveUninitialized:true
}));

//errormiddleware



// jwt 

app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   res.status(err.status || 500);
//   res.render('error');
// });
app.use(errorHandler);

app.get('*',(req,res)=>{
  res.render('404')
})

app.listen(5000)
