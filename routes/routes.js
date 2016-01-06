var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var person = require('../models/person');

module.exports = function (app, passport) {

    app.set('view engine', 'ejs');
   

    //Index

    app.get('/', function (req, res) {

        res.render('index', {
            isAuthenticated: req.isAuthenticated(),
        });

    });

    app.post('/', function (req, res) {

        res.render('index');

    });


    //SignUp

    app.get('/signup', function (req, res) {
        res.render('signup');
    });

    app.post('/signup', function (req, res) {

        var username = req.body.username;
        var password = req.body.password;
        var email = req.body.email;

        person.createUser(username, password, email, done);

        function done(success) {
            if (success) {
                res.redirect('/signin');
            } else {
                res.redirect('/signup');
            }
        }

    });


    //SignIn

    app.get('/signin', function (req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/dash');
        } else {
            res.render('signin');
        }
    });

    app.post('/signin', passport.authenticate('local', { failureRedirect: '/', successRedirect: '/dash' }));


    //SignOut

    app.get('/signout', function (req, res) {
        if (req.isAuthenticated()) {
            res.render('signout')
        } else {
            res.redirect('/');
        }
    });

    app.post('/signout', function (req, res) {
        if (req.isAuthenticated()) {
            req.logout();
            res.redirect('/');
        } else {
            res.redirect('/');
        }
    });


    //Change password

    app.get('/settings', function (req, res) {
        if (req.isAuthenticated()) {
            res.render('settings');
        } else {
            res.redirect('/');
        }
    });

    app.post('/settings', function (req, res) {
        if (req.isAuthenticated()) {
            var oldPassword = req.body.oldPassword;
            var newPassword = req.body.newPassword;

            person.changePassword(req.user._id, oldPassword, newPassword, done);
        
            function done(success) {
                if(success){
                    res.redirect('/dash');
                }else{
                    console.log('password change was unsuccessful');
                }
            }

        } else {
            
            res.redirect('/');
            
        }
    });


    //Dash
    app.get('/dash', function (req, res) {
        if (req.isAuthenticated()) {
            res.render('dash', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
        } else {
            res.redirect('/');
        }

    });

    app.post('/dash', function (req, res) {

    });


}

//TODO: Recovery, Verification