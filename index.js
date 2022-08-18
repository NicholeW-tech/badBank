var express = require('express');
var app     = express();
var cors    = require('cors');
var dal     = require('./dal.js');
var passport = require('passport');
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;


// used to serve static files from public directory
app.use(express.static('public'));
app.use(cors());
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
   });

   passport.deserializeUser(function(user, done) {
    done(null, user);
   });

   passport.use(
    new GoogleStrategy(
     {
    
      callbackURL: "https://badbanktest1.herokuapp.com/auth/google/callback"
     },
     function(accessToken, refreshToken, profile, done) {
      var userData = {
       email: profile.emails[0].value,
       name: profile.displayName,
       token: accessToken
      };
      done(null, userData);
     }
    )
   );


app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });


  

app.get("/", function(req, res, next) {
	res.render("index", { title: "Express" });
});

/* GET Google Authentication API. */
app.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/", session: false }),
	function(req, res) {
		var token = req.user.token;
		res.redirect("https://badbanktest1.herokuapp.com?token=" + token);
	}
);
// create user account
app.get('/account/create/:name/:email/:password', function (req, res) {

    // check if account exists
    dal.find(req.params.email).
        then((users) => {

            // if user exists, return error message
            if(users.length > 0){
                console.log('User already in exists');
                res.send('User already in exists');    
            }
            else{
                // else create user
                dal.create(req.params.name,req.params.email,req.params.password).
                    then((user) => {
                        console.log(user);
                        res.send(user);            
                    });            
            }

        });
});


// login user 
app.get('/account/login/:email/:password', function (req, res) {

    dal.find(req.params.email).
        then((user) => {

            // if user exists, check password
            if(user.length > 0){
                if (user[0].password === req.params.password){
                    res.send(user[0]);
                }
                else{
                    res.send('Login failed: wrong password');
                }
            }
            else{
                res.send('Login failed: user not found');
            }
    });
    
});

// find user account
app.get('/account/find/:email', function (req, res) {

    dal.find(req.params.email).
        then((user) => {
            console.log(user);
            res.send(user);
    });
});

// find one user by email - alternative to find
app.get('/account/findOne/:email', function (req, res) {

    dal.findOne(req.params.email).
        then((user) => {
            console.log(user);
            res.send(user);
    });
});


// update - deposit/withdraw amount
app.get('/account/update/:email/:amount', function (req, res) {

    var amount = Number(req.params.amount);

    dal.update(req.params.email, amount).
        then((response) => {
            console.log(response);
            res.send(response);
    });    
});

// all accounts
app.get('/account/all', function (req, res) {

    dal.all().
        then((docs) => {
            console.log(docs);
            res.send(docs);
    });
});

var PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log('Running on port: ' + PORT);
