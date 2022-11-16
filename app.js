const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
app.use(bodyParser.urlencoded());
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('views'))
const session = require('express-session');
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET' 
  }));
const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '635690037802-ncr8phftrg1bsn2olm0bib0umiar2rkt.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/loginsuccess') 
  });

//LANDING PAGE 
app.use('/',require('./routes/index.js'));

//CUSTOMERS 
app.use('/customers',require('./routes/customers.js'));
app.use('/locations',require('./routes/customers.js'));


//MANAGERS
app.use('/inventory',require('./routes/managers.js'));
app.use('/saleshistory',require('./routes/managers.js'));
app.use('/employeelist',require('./routes/managers.js'));
app.use('/menu', require('./routes/managers.js'));
app.use('/managers',require('./routes/managers.js'));

//LOGIN
app.use('/managerlogin', require('./routes/managerlogin.js'));
app.use('/serverlogin', require('./routes/serverlogin.js'));
app.get('/loginsuccess', (req, res) => res.render('loginsuccess'));
app.get('/error', (req, res) => res.render('error'));

//SERVERS
app.use('/servers',require('./routes/servers.js'));
app.use('/restockreport',require('./routes/servers.js'));
app.use('/order',require('./routes/servers.js'));
app.use('/itemsales',require('./routes/servers.js'));
app.use('/orderslist',require('./routes/servers.js'));

//ORDER BUTTON ROUTES 
app.use('/bowl',require('./routes/servers.js'));
app.use('/drinks',require('./routes/servers.js'));
app.use('/biggerplate',require('./routes/servers.js'));
app.use('/plate',require('./routes/servers.js'));
app.use('/sides',require('./routes/servers.js'));
app.use('/entrees',require('./routes/servers.js'))


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});