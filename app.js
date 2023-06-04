const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { User, Seat, Reservedseat } = require('./models/bus');
const jwt = require('jsonwebtoken');
const url = require('url');

const reserve = require('./reserve');
const reset = require('./reset');

const secretKey = 'secret-secret-blank';

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://test_node:test_6543@cluster0.0pfxku2.mongodb.net/cmtdb";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    console.log('Connection state:', mongoose.connection.readyState);
    // Continue with your application logic
    app.listen(3000);
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.json())
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});


// Set custom options for query string parsing
app.set('query parser', (str) => qs.parse(str, { /* custom options */ }));

//cmt

app.get('/cmt/noaccess', (req, res) => {
  res.render('no_access', { title: 'abc' });
});

app.get('/cmt/nonadmin_home', (req, res) => {
  res.render('nonadmin_home', { title: 'abc', });
});

app.get('/cmt/admin_home', (req, res) => {
  res.render('admin_home', { title: 'abc', });
});

app.get('/cmt/login', (req, res) => {
  res.render('login_cmt', { title: 'Please login to cmt' });
});

app.post('/cmt/login', (req, res) => {

  const email = req.body.email;
  const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
  const user = new User({
  email: email,
  token: token,
  });

  user.save()
    .then(result => {
      console.log('User saved successfully:', result);
      //res.setHeader('Set-Cookie', `email=${email}; Max-Age=3600; Secure; HttpOnly; SameSite=Strict`);
      res.cookie('email', email, {maxAge: 360000});
      res.cookie('token', token, {maxAge: 360000});
      res.cookie('cseatnumber', 0, {maxAge: 360000});


      console.log('Cookies set in login!');
    
      //res.status(200).json({ token: user.token });
      if (email == "admin@createmytrip.com"){
        res.redirect(`/cmt/seat/reset`);
        reset();
      }
      else {
        res.redirect(`/cmt/seat/reserve`);
      }

      //const token = result.token;
      //res.redirect(`/cmt/seat/reserve?token=${encodeURIComponent(token)}`);
      //req.url = `/cmt/seat/reserve?token=${token}`;
      //app.handle(req, res);
      console.log("token1", token);
    })
    .catch(err => {
      console.error('Error saving user:', err);
      // Handle the error as needed
      res.status(500).send('Error saving user');
    });
});

app.post('/cmt/seat/reserve', (req, res) => {

    //let seatnumber = reserve(req);
    //console.log('Seat number reserved:', seatnumber);
    //res.render('seat_reserved', { title: 'seat reserved', seatnumber: seatnumber });
    const cookieValue = req.cookies.email;
    console.log('Cookie Value inside Reserve for email:', cookieValue);
    if (cookieValue == 'admin@createmytrip.com'){
      res.redirect('/cmt/admin_home');
    }
    else{
      res.redirect('/cmt/nonadmin_home');
    }

})

app.get('/cmt/seat/reserve', (req, res) => {
  res.render('seat_reserve', { title: 'reserve' });
});

app.post('/cmt/seat/reset', (req, res) => {

  reset();
  //res.render('seat_reserved', { title: 'seat reserved', seatnumber: seatnumber });
  res.redirect('/cmt/admin_home');

})

app.get('/cmt/seat/reset', (req, res) => {
  const cookieValue = req.cookies.email;
  console.log('Cookie Value inside Reserve for email:', cookieValue);
  const tokValue = req.cookies.token;
  console.log('Cookie Value inside Reserve for token:', tokValue);
  if (cookieValue == "admin@createmytrip.com"){
    res.render('seat_reset', { title: 'reset' });
  }
  else{
    res.redirect('/cmt/noaccess');
  }
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
 
module.exports = app;