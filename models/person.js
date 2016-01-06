var Person = require('../schema/person');
var database = require('../database/mongoose');
var mongoose = database.mongoose;
var crypto = require('crypto');
var mongoUrl = 'mongodb://localhost:27017/testdbtwo';

function createSalt() {
    return crypto.randomBytes(32).toString('hex');
};

function createHash(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
};


module.exports = {
    

    changePassword: function (userId, oldPassword, newPassword, finished) {
        
        var checkPassword = this.checkPassword;
        var updatePassword = this.updatePassword;

        this.retrieveUserById(userId, done);

        function done(user) {
            if (user) {
                var passwordMatch = checkPassword(user, oldPassword);
                if (passwordMatch) {
                    updatePassword(user, newPassword, finished);
                } else {
                    finished(false);
                }
            } else {
                finished(false);
            }



        }
    },    

    
    updatePassword: function (user, newPassword, done) {
        var salt = createSalt();
        var hashedPassword = createHash(newPassword + salt);
        mongoose.connect(mongoUrl, function (err) {
            if (err) {
                console.log(err);
                done(false);
            } else {
                var conditions = { _id: user._id };
                var update = { hashedPassword: hashedPassword, salt: salt };
                var options = {};
                Person.update(conditions, update, options, callback);

                function callback(err) {
                    if (err) {
                        console.log(err);
                        database.disconnectHandler(mongoose, done, null, false);
                    } else {
                        database.disconnectHandler(mongoose, done, null, true);
                    }
                }

            }
        });
    },    

  
    checkPassword: function (user, password) {
        var salt = user.salt;
        var hash = createHash(password + salt);

        if (hash === user.hashedPassword) {
            return true;
        } else {
            return false;
        }
    },
            

    insertUser:function(username, hashedPassword, salt, email, done){
        mongoose.connect(mongoUrl, function(err){
            if(err){
                console.log(err);
                done(false);
            }else{
                
                var user = new Person({username: username,
                                    hashedPassword: hashedPassword,
                                    salt: salt,
                                    friends: [],
                                    email: email});
                user.save(function(err){
                    if(err){
                        database.disconnectHandler(mongoose, done, null, false); 
                    }else{
                        database.disconnectHandler(mongoose, done, null, true); 
                    }
                });
            }
        });
        
    },


    retrieveUserById: function (id, finished) {
        mongoose.connect(mongoUrl, function (err) {
            if (err) {
                console.log(err);
                finished(null);
            } else {
                Person.findOne({ _id: id }, function (err, person) {
                    if (err) {
                        database.disconnectHandler(mongoose, finished, null, null);
                    };
                    if (!person) {
                        database.disconnectHandler(mongoose, finished, null, null);
                    } else {
                        var user = person;
                        database.disconnectHandler(mongoose, finished, null, user);
                    }
                });
            }
        });

    },


    isUser: function (username, done) {
        mongoose.connect(mongoUrl, function (err) {
            if (err) {
                console.log(err);
                done(false);
            } else {
                Person.findOne({ username: username }, function (err, person) {
                    if (err) {
                        database.disconnectHandler(mongoose, done, null, false);
                    } else if (!person) {
                        database.disconnectHandler(mongoose, done, null, false);
                    } else {
                        database.disconnectHandler(mongoose, done, null, true);
                    }
                });
            }
        });
    },

    
    isEmail: function (email, done) {
        mongoose.connect(mongoUrl, function (err) {
            if (err) {
                console.log(err);
                done(false);
            } else {
                Person.findOne({ email: email }, function (err, person) {
                    if (err) {
                        database.disconnectHandler(mongoose, done, null, false);
                    } else if (!person) {
                        database.disconnectHandler(mongoose, done, null, false);
                    } else {
                        database.disconnectHandler(mongoose, done, null, true);
                    }
                });
            }
        });
    },


    createUser: function (username, password, email, finished) {

        if (username === undefined || password === undefined || email === undefined) {
            return false;
        }

        var salt = createSalt();
        var hashedPassword = createHash(password + salt);


        var isEmail = this.isEmail;
        var isUser = this.isUser;
        var insertUser = this.insertUser;

        function create() {
            isEmail(email, emailCheck);
        };

        function emailCheck(emailExists) {
            if (!emailExists) {
                isUser(username, usernameCheck);
            } else {
                finished(false);
            }

        };

        function usernameCheck(usernameExists) {
            if (!usernameExists) {
                insertUser(username, hashedPassword, salt, email, done);
            } else {
                finished(false);
            }
        };

        function done(success) {
            finished(success);
        };

        create();
    },


    retrieveUser: function (username, password, finished) {

        var checkPassword = this.checkPassword;

        mongoose.connect(mongoUrl, function (err) {
            if (err) {
                console.log(err);
                finished(null);
            } else {
                Person.findOne({ username: username }, function (err, Person) {
                    if (err) {
                        console.log(err);
                        database.disconnectHandler(mongoose, finished, null, null);
                    };
                    if (!Person) {
                        database.disconnectHandler(mongoose, finished, null, null);
                    } else {
                        var pwOK = checkPassword(Person, password);

                        if (pwOK) {
                            var user = Person;
                            database.disconnectHandler(mongoose, finished, null, user);
                        } else {
                            database.disconnectHandler(mongoose, finished, null, null);
                        }
                    }

                });
            }
        });


    }


}