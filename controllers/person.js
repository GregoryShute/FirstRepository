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
        
        //this will change later
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


    },
    
    
    //calls back with json object of users
    searchForUser: function (query, finished) {
        mongoose.connect(mongoUrl, function (err) {
            if (err) {
                console.log(err);
                //return no suggestions if we can't connect
                finished({});
            } else {
                var r = new RegExp('^' + query, 'i');
                var conditions = { username: r };
                Person.find(conditions, { _id: 0, username: 1 }, function (err, list) {
                    if (err) {
                        console.log(err);
                        database.disconnectHandler(mongoose, finished, null, {});
                    } else {

                        database.disconnectHandler(mongoose, finished, null, list);
                    }

                })

            }
        });

    },
    
    
    addFriend: function (username, friend, finished) {
        mongoose.connect(mongoUrl, function (err) {
            if (err) {
                console.log(err);
                finished(false);
            } else {
                var conditions = { username: username };
                var update = { $push: { friends: friend } };
                var options = {};
                Person.update(conditions, update, options, callback);

                function callback(err) {
                    if (err) {
                        console.log(err);
                        database.disconnectHandler(mongoose, finished, null, false);
                    } else {
                        database.disconnectHandler(mongoose, finished, null, true);
                    }
                }
            }
        })
    },
    
    
    isFriend: function (username, friend, finished) {
        mongoose.connect(mongoUrl, function (err) {
            if (err) {
                console.log(err);
                finished(false);
            } else {
                var conditions = { username: username, friend: friend }
                Person.findOne(conditions, function (err, Person) {
                    if (err) {
                        console.log(err);
                        finished(false);
                    } else {
                        if (!Person) {
                            database.disconnectHandler(mongoose, finished, null, false);
                        } else {
                            database.disconnectHandler(mongoose, finished, null, true);
                        }
                    }
                });
            }

        });

    },
    

    getRequests: function (username, finished) {
        var getUser = this.getUser;

        getUser(username, callback);

        function callback(user) {
            if (user !== null) {
                var requests = user.requests;
                finished(requests);
            } else {
                console.log('could not find the user');
                finished([]);
            }

        }
    },
    
 
    //need to add check to make sure there isn't already a request too
    //also need to make is so I can't send requests to myself
    sendFriendRequestTo: function (username, requestedFriend, finished) {
        
        //should also take the option off to do this in the view
        if(username === requestedFriend){
            finished(false);
        }
        
        mongoose.connect(mongoUrl, function (err) {
            if (err) {

                console.log(err);
                finished(false);
            } else {
                var conditions = { username: requestedFriend };
                var update = { $push: { requests: username } };
                var options = {};
                Person.update(conditions, update, options, updateOutboundRequests);


                function updateOutboundRequests(err) {
                    if (err) {
                        console.log(err);
                        database.disconnectHandler(mongoose, finished, null, false);
                    } else {
                        var conditions = { username: username };
                        var update = { $push: { outboundRequests: requestedFriend } };
                        var options = {};
                        Person.update(conditions, update, options, callback);
                    }

                }


                function callback(err) {
                    if (err) {

                        console.log(err);
                        database.disconnectHandler(mongoose, finished, null, false);
                    } else {

                        database.disconnectHandler(mongoose, finished, null, true);
                    }
                }
            }
        })
    },
    
    
    isOutboundRequest: function(username, friend, finished){
        
    },
    
    
    acceptFriendRequest: function (username, friend, finished) {
        //calls add friend for both users
        
        var addFriend = this.addFriend;

        addFriend(username, friend, callback);

        function callback(success) {
            if (success) {
                addFriend(friend, username, finished);
            } else {
                console.log('error accepting friend request');
            }

        }

    },
    
    
    //different from retrieveUser because this doesn't require password.
    //should maybe break up retrieveUser later
    
    getUser: function (username, finished) {
        mongoose.connect(mongoUrl, function (err) {
            if (err) {
                console.log(err);
                finished(null);
            } else {
                var conditions = { username: username };
                Person.findOne(conditions, function (err, Person) {

                    function callback(err) {
                        if (err) {
                            console.log(err);
                            database.disconnectHandler(mongoose, finished, null, null);
                        } else {
                            var user = Person;
                            database.disconnectHandler(mongoose, finished, null, user);
                        }
                    }
                });
            }
        });

    },
    
    
    getFriends: function (username, finished) {
        var getUser = this.getUser;

        getUser(username, callback);

        function callback(user) {
            if (user !== null) {
                var friends = user.friends;
                finished(friends);
            } else {
                console.log('could not find the user');
                finished([]);
            }

        }

    }    
        
              
}