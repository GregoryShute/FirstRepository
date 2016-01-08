var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var passportLocal = require('passport-local');
var crypto = require('crypto');
var person = require('../controllers/person');

module.exports = function (app) {


    //Authentication Using Passport
    //Passport takes care of creating unique session ids.
   passport.use(new passportLocal.Strategy(function (username, password, done) {

        var matchedId;
        var matchedUsername;
        var foundUser = false;

        person.retrieveUser(username, password, next);

        function next(user) {
            if (user !== null && user !== undefined) {
                matchedId = user.id;
                matchedUsername = user.username;
                foundUser = true;
            }

            if (foundUser === true) {
                done(null, { _id: matchedId, username: matchedUsername });
            } else {
                done(null, null);
            }
        }


    }));


    //Makes a memento that can be restored upon request during an active session.
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    //Restores the session object when there is a request.
    passport.deserializeUser(function (id, done) {

        function next(user) {
            if (user !== null) {
                done(null, { _id: id, username: user.username });
            } else {
                done(null, null);
            }   
        }
        person.retrieveUserById(id, next);
    });
    
    
    return passport;
}