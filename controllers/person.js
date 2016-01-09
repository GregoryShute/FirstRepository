var Person = require('../schema/person');
var database = require('../database/mongoose');
var mongoose = database.mongoose;
var crypto = require('crypto');
var mongoUrl = 'mongodb://localhost:27017/testdbtwo';

//todo check the way I'm doing the crypto again

function createSalt() {
    return crypto.randomBytes(32).toString('hex');
};

function createHash(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
};


module.exports = {
    
    
    //Method Name: changePassword
    //Method Status: Needs Modification (may want to change the inputs on this)
    /*
    
      Inputs: 'userId' is an id associated with a Person document that resides in the database at mongoUrl.
      
              'oldPassword' is the current password associated with 'userId'
              
              'newPassword' is a String that 'user' 'userId' wants to be their new password
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               true if 'oldPassword' matches the current password of 'user' 'userId'
                    and if 'newPassword' is now the associated with 'user' in place of their old password.
                      
               false otherwise 
    
    */

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


    //Method Name: updatePassword
    //Method Status: Needs Modification (may want to change name so this isn't called directly by mistake)
    /*
    
      Inputs: 'user' is a Person document associated with the database at mongoUrl.
              
              'newPassword' is a String that 'user' wants to be their new password
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               true if the 'newPassword' is now the associated with 'user' in place of their old password.
                      
               false otherwise 
    
    */
    
    updatePassword: function (user, newPassword, finished) {
        var salt = createSalt();
        var hashedPassword = createHash(newPassword + salt);
        mongoose.connect(mongoUrl, function (err) {
            if (err) {
                console.log(err);
                finished(false);
            } else {
                var conditions = { _id: user._id };
                var update = { hashedPassword: hashedPassword, salt: salt };
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
        });
    },    


    //Method Name: checkPassword
    //Method Status: Ready for Testing
    /*
    
      Inputs: 'user' is a Person document associated with the database at mongoUrl.
              
              'password' is a String
              
              
      Outputs: callsback 'finished' with argument:
           
               true if the 'password' is associated with the 'user' document
                      
               false otherwise 
    
    */
  
    checkPassword: function (user, password) {
        var salt = user.salt;
        var hash = createHash(password + salt);

        if (hash === user.hashedPassword) {
            return true;
        } else {
            return false;
        }
    },
 
       
    //Method Name: insertUser
    //Method Status: Needs Modification (may want to change collection name)
    /*
    
      Inputs: 'username' is the 'username' of the user to be inserted into the database.
      
              'hashedPassword' is a hash of the password associated with user 'username'
              
              'salt' is a salt associated with the 'hashedPassword'
              
              'email' is the email of the user to be inserted into the database.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               true if new user document with 'username', 'hashedPassword', 'salt' and 'email' was inserted 
                    into the Person collection.
                      
               false otherwise 
    
    */     

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


    //Method Name: retrieveUserById
    //Method Status: Needs Modification (may want method name change)
    /*
    
      Inputs: 'id' is a String.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               user document if a user with 'id' exists
                      
               null otherwise 
    
    */


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


    //Method Name: isUser
    //Method Status: Needs Modification (may want method name change)
    /*
    
      Inputs: 'username' is a String.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               true if any user document has the username
                      
               false otherwise 
    
    */
    
    isUser: function (username, finished) {
        mongoose.connect(mongoUrl, function (err) {
            if (err) {
                console.log(err);
                finished(false);
            } else {
                Person.findOne({ username: username }, function (err, person) {
                    if (err) {
                        database.disconnectHandler(mongoose, finished, null, false);
                    } else if (!person) {
                        database.disconnectHandler(mongoose, finished, null, false);
                    } else {
                        database.disconnectHandler(mongoose, finished, null, true);
                    }
                });
            }
        });
    },


    //Method Name: isEmail
    //Method Status: Ready for Testing
    /*
    
      Inputs: 'email' is a String.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               true if any user document has the email
                      
               false otherwise 
    
    */
    
    isEmail: function (email, finished) {
        mongoose.connect(mongoUrl, function (err) {
            if (err) {
                console.log(err);
                finished(false);
            } else {
                Person.findOne({ email: email }, function (err, person) {
                    if (err) {
                        database.disconnectHandler(mongoose, finished, null, false);
                    } else if (!person) {
                        database.disconnectHandler(mongoose, finished, null, false);
                    } else {
                        database.disconnectHandler(mongoose, finished, null, true);
                    }
                });
            }
        });
    },


    //Method Name: createUser
    //Method Status: Needs Modification **
    /*
    
      Inputs: 'username' is the name identifier a person has chosen to use to sign up.
      
              'password' is the password a person has chosen to use to sign up.
              
              'email' is the email a person has chosen to use to sign up.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               true if a user document was created for this person
                    and if username, password and email fit appropriate criteria **
                    and if no currently existing user has the requested email
                    and if no currently existing user has the requested username
                      
               false otherwise 
    
    */
    
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


    //Method Name: retrieveUser
    //Method Status: Ready for Testing
    /*
    
      Inputs: 'username' is the name of the user who has a document in the database at mongoUrl.
      
              'password' is the password associated with user 'username'
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               user document if 'username' and 'password' are correct
                      
               null otherwise 
    
    */

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
    
    
    //Method Name: searchForUser
    //Method Status: Ready for Testing
    /*
    
      Inputs: 'query' is a String
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               [{username:...},{username:...},...] if there is/are user/users in the Person collection
               for whom 'query' matches the first query.length number of characters in their username.
                      
               [] otherwise 
    
    */
    
    searchForUser: function (query, finished) {
        mongoose.connect(mongoUrl, function (err) {
            if (err) {
                console.log(err);

                finished([]);
            } else {
                var r = new RegExp('^' + query, 'i');
                var conditions = { username: r };
                Person.find(conditions, { _id: 0, username: 1 }, function (err, list) {
                    if (err) {
                        console.log(err);
                        database.disconnectHandler(mongoose, finished, null, []);
                    } else {
                        database.disconnectHandler(mongoose, finished, null, list);
                    }

                })

            }
        });

    },
    
    
    //Method Name: addFriend
    //Method Status: Ready for Testing
    /*
    
      Inputs: 'username' is the name of the user who wants to add 'friend' to friends.
      
              'friend' is the name of another user who wants to add 'user' to friends.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               'true' if user 'username' has added 'friend' to their friends
                      
               'false' otherwise 
    
    */
    
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
    
    
    //Method Name: isFriend
    //Method Status: Ready for Testing
    /*
    
      Inputs: 'username' is the name of the user who has a document in the database at mongoUrl.
      
              'friend' is the name of another user who has a document in the database at mongoUrl.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               'true' if user 'username' has 'friend' in their friends
                      
               'false' otherwise 
    
    */
    
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
    
    
    //Method Name: getInboundRequests
    //Method Status: Ready for Testing
    /*
    
      Inputs: 'username' is the name of the user who has a document in the database at mongoUrl.
      
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               {inboundRequests, [...]} if user 'username' exists
                      
               {inboundRequests, []} otherwise 
    
    */
  
    getInboundRequests: function (username, finished) {
        var getUser = this.getUser;

        getUser(username, callback);

        function callback(user) {
            if (user !== null) {
                var inboundRequests = { inboundRequests: user.inboundRequests };
                finished(inboundRequests);
            } else {
                console.log('could not find the user');
                finished({ inboundRequests: [] });
            }

        }
    },
    
    
    //Method Name: getOutboundRequests
    //Method Status: Ready for Testing
    /*
    
      Inputs: 'username' is the name of the user who has a document in the database at mongoUrl.
      
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               {outboundRequests, [...]} if user 'username' exists
                      
               {outboundRequests, []} otherwise 
    
    */
    
    getOutboundRequests: function (username, finished) {
        var getUser = this.getUser;

        getUser(username, callback);

        function callback(user) {
            if (user !== null) {
                var outboundRequests = { outboundRequest: user.outboundRequests };

                finished(outboundRequests);
            } else {
                console.log('could not find the user');
                finished({ outboundRequests: [] });
            }

        }
    },
    
    
    //Method Name: sendFriendRequestTo
    //Method Status: Needs modification **
    /*
    
      Inputs: 'username' is the name of the user who does not have an outbound friend request to 'friend' **
               and is not 'friend'
               and wants to send a friend request to 'friend',
      
              'friend' is the name of the user to whom a friend request from 'username' will be sent.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               'true' if user 'username' has added 'friend' to their outboundRequests
                      and if user 'friend' has added 'username' to their inboundRequests
                      
               'false' otherwise 
    
    */
    
    sendFriendRequestTo: function (username, friend, finished) {
        
        //should also take the option off to do this in the view
        if (username === friend) {
            finished(false);
        }

        mongoose.connect(mongoUrl, function (err) {
            if (err) {

                console.log(err);
                finished(false);
            } else {
                var conditions = { username: friend };
                var update = { $push: { inboundRequests: username } };
                var options = {};
                Person.update(conditions, update, options, updateOutboundRequests);


                function updateOutboundRequests(err) {
                    if (err) {
                        console.log(err);
                        database.disconnectHandler(mongoose, finished, null, false);
                    } else {
                        var conditions = { username: username };
                        var update = { $push: { outboundRequests: friend } };
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
    
       
    //Method Name: acceptFriendRequest
    //Method Status: Needs modification **
    /*
    
      Inputs: 'username' is the name of the user who received a friend request from 'username'.
      
              'friend' is the name of the user who sent a friend request to 'username'.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               'true' if user 'username' has added 'friend' to their friends
                      and if user 'username' has deleted 'friend' from their inboundRequests **
                      and if user 'friend' has added 'username' to their friends
                      and if user 'friend' has deleted 'username' from their outboundRequests **
                      
               'false' otherwise 
    
    */
    
    acceptFriendRequest: function (username, friend, finished) {


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
    
    
    //Method Name: getUser
    //Method Status: Ready for Testing
    /*
    
      Inputs: 'username' is the name of the user who has a document in the database at mongoUrl.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               user database document if user 'username' exists
                      
               null otherwise 
    
    */
    
    getUser: function (username, finished) {
        mongoose.connect(mongoUrl, function (err) {
            if (err) {
                console.log(err);
                finished(null);
            } else {
                var conditions = { username: username };
                Person.findOne(conditions, function (err, Person) {

                    if (err) {
                        console.log(err);
                        database.disconnectHandler(mongoose, finished, null, null);
                    } else {
                        var user = Person;

                        database.disconnectHandler(mongoose, finished, null, user);
                    }

                });
            }
        });

    },
    
    
    //Method Name: getFriends
    //Method Status: Ready for Testing
    /*
    
      Inputs: 'username' is the name of the user who has a document in the database at mongoUrl.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               {friends, [...]} if user 'username' exists
                      
               {friends, []} otherwise 
    
    */
    
    getFriends: function (username, finished) {
        var getUser = this.getUser;

        getUser(username, callback);

        function callback(user) {
            if (user !== null) {
                var friends = { friends: user.friends };
                finished(friends);
            } else {
                console.log('could not find the user');
                finished({ friends: [] });
            }

        }

    },
    
    
    //Method Name: getRequestsAndFriends
    //Method Status: Ready for Testing
    /*
    
      Inputs: 'username' is the name of the user who has a document in the database at mongoUrl.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               {friends: [...], outboundRequests: [...], inboundRequests: [...]} if user 'username' exists
                      
               {friends: [], outboundRequests: [], inboundRequests: []} otherwise 
    
    */
    getRequestsAndFriends: function (username, finished) {
        var getUser = this.getUser;

        getUser(username, callback);

        function callback(user) {
            if (user !== null) {
                var friends = user.friends;
                var outboundRequests = user.outboundRequests;
                var inboundRequests = user.inboundRequests;


                finished({ friends: friends, outboundRequests: outboundRequests, inboundRequests: inboundRequests });
            } else {
                console.log('could not find the user');
                finished({ friends: [], outboundRequests: [], inboundRequests: [] });
            }

        }

    },
    
    
    //Method Name: removeRequest
    //Method Status: Not Done
    /*
    
      Inputs: 'username' is the name of the user who sent a friend request to 'friend'.
      
              'friend' is the name of the user who received a friend request from 'username'.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               'true' if user 'username' has their outbound request to 'friend' deleted
                      and if user 'friend' has their inbound request from 'username' deleted.
                      
               'false' otherwise 
    
    */
    
    removeRequest: function (username, friend, finished) {
        mongoose.connect(mongoUrl, function (err) {
            if (err) {
                console.log(err);
                finished(false);
            } else {
                var conditions = { username: username };

                var update = { $pull: { inboundRequests: friend } };
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

    }
        
        
              
}