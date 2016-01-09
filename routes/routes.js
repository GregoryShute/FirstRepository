var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var person = require('../controllers/person');

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

    //todo: I want to start pulling stuff out of here and do this a little differently 
    app.post('/dash', function (req, res) {
        if(req.isAuthenticated()) {
            var username = req.user.username;
            if(req.body.runMethod === "initDash"){
                
                person.getRequestsAndFriends(username, callback);
                
                function callback(requestsAndFriends){
                    
                        var friends = requestsAndFriends.friends;
                        var outboundRequests = requestsAndFriends.outboundRequests;
                        var inboundRequests = requestsAndFriends.inboundRequests; 
                        var data = {friends: friends, outboundRequests: outboundRequests, inboundRequests: inboundRequests};

                        res.json(data);
                }
            }else if(req.body.runMethod === "goToFriend"){
               //for now, but needs to be changed
               
               
            }else if(req.body.runMethod === "acceptRequest"){
                var friend =req.body.friend;
                
                person.addFriend(username, friend, friendAdded);
                
                function friendAdded(success){
                    res.json({success: success});
                }
                
            }else{
                res.json({});
            }
            
        }else{
            
            res.redirect('/');
            
        }
    });
    
    
    //Search

    app.get('/search', function(req, res){
       if(req.isAuthenticated()){

           res.render('search');
       }else{
           res.redirect('/');
       } 
    });
    
    app.post('/search', function(req, res){

       if(req.isAuthenticated()){
           var query = req.body.term;

           person.searchForUser(query, finished);
           
           function finished(list){
               res.json(list);
           };
           
       }else{
           res.redirect('/');
       } 
    });
    
    
    //User
    
    app.post('/user', function(req, res){
        if(req.isAuthenticated()){
            //implement check to see if this user has permission to see this other user
            //then actually load the relevant stuff from that user

            res.render('user',{
                user: req.body.selectedUsername
            });
        }else{
            res.redirect('/');
        }
    });
    
    
    //AddFriend
    
    app.post('/requestFriend', function(req, res){
        if(req.isAuthenticated()){
            var username = req.user.username;
            var friend = req.body.username;
            person.sendFriendRequestTo(username, friend, callback);
            function callback(success){
                //do same thing regardless for now
                if(success){
                    res.render('user', {
                        user: req.user.username
                    });
                } else {
                    res.render('user', {
                        user: req.user.username
                    });
                }
            }
            
        } else {
            res.redirect('/');
        }
    })
        
    

}

//TODO: Recovery, Email Verification, Look into CAPTCHA, set up system to block emails,
//Let users add a photo after verification.
//Make better urls
//Start commenting methods