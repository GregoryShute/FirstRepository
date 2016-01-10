var Person = require('../schema/person');
var database = require('../database/mongoose');
var mongoose = database.mongoose;
var crypto = require('crypto');
var mongoUrl = 'mongodb://localhost:27017/testdbtwo';

//todo check the way I'm doing the crypto again
//need to move more stuff up here. Only stuff getting called directly from routes should be exported for now


//I think anything thats a helper should probably be up here
//Also database queries can probably be consolidated more




//Method Name: isInboundRequest
//Method Status: Ready for Testing
/*
 
  Inputs: 'username' is the name of the user that may have an inbound request to 'friend'
  
          'friend' is the name of the user to whom there may be an outbound request from 'username'
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           'true' if user 'username' has an inInbound request to 'friend' in their outboundRequests
                  
           'false' otherwise 
           
           
   Helpers: None
 
*/

function isInboundRequest(username, friend, finished) {

    mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished(false);
        } else {
            var conditions = { username: username, inboundRequests: friend };
            Person.findOne(conditions, function (err, Person) {
                if (err) {
                    console.log(err);
                    database.disconnectHandler(mongoose, finished, null, false);
                } else if (!Person) {
                    database.disconnectHandler(mongoose, finished, null, false);
                } else {
                    database.disconnectHandler(mongoose, finished, null, true);
                }
            });
        }
    });
};

    //Method Name: isOutboundRequest
    //Method Status: Ready for Testing
    /*
    
      Inputs: 'username' is the name of the user that may have an outbound request to 'friend'
      
              'friend' is the name of the user to whom there may be an inbound request from 'username'
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               'true' if user 'username' has an outbound request to 'friend' in their outboundRequests
                      
               'false' otherwise 
               
       Helpers: None
    
    */
    
function isOutboundRequest(username, friend, finished) {

    mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished(false);
        } else {
            var conditions = { username: username, outboundRequests: friend };
            Person.findOne(conditions, function (err, Person) {
                if (err) {
                    console.log(err);
                    database.disconnectHandler(mongoose, finished, null, false);
                } else if (!Person) {
                    database.disconnectHandler(mongoose, finished, null, false);
                } else {
                    database.disconnectHandler(mongoose, finished, null, true);
                }
            });
        }
    });
};
    
    
//Method Name: isUser
//Method Status: Needs Modification (may want method name change)
/*
 
  Inputs: 'username' is a String.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           true if any user document has the username
                  
           false otherwise 
           
           
   Helpers: None 
 
*/

function isUser(username, finished) {
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
};
    
  
//Method Name: isFriend
//Method Status: Ready for Testing
/*
 
  Inputs: 'username' is the name of the user who has a document in the database at mongoUrl.
  
          'friend' is the name of another user who has a document in the database at mongoUrl.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           'true' if user 'username' has 'friend' in their friends
                  
           'false' otherwise
           
        
   Helpers: None 
 
*/

function isFriend(username, friend, finished) {
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

};


//Method Name: isEmail
//Method Status: Ready for Testing
/*
 
  Inputs: 'email' is a String.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           true if any user document has the email
                  
           false otherwise
           
           
   Helpers: None 
 
*/

function isEmail(email, finished) {
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
};




//Method Name: isOkToSendFriendRequest
//Method Status: Needs Modificatoin (consider turning this and functions like it into something like a decorator)
/*
 
  Inputs: 'username' is the name of the user who wants to send a friend request to 'friend'
  
          'friend' is the name of the user to whom 'username' wants to check if it is okay to send a friend request.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           'true' if user 'username' is the name of the user who does not have an outbound friend request to 'friend'
                  and if 'username' does not have an inbound request from 'friend'
                  and if 'username' is not 'friend'
                  and if 'username' is not already a friend of 'friend' 
                  and if 'friend' exists 
                  
           'false' otherwise 
           
           
   Helpers: isOutboundRequest, isFriend, isUser, isInboundRequest
 
*/

function isOkToSendFriendRequest(username, friend, finished) {
    if (username === friend) {
        finished(false);
    } else {

        isOutboundRequest(username, friend, outboundRequestExists);

        function outboundRequestExists(outboundExists) {
            if (!outboundExists) {

                isFriend(username, friend, userExists);

                function userExists(alreadyFriend) {
                    if (!alreadyFriend) {

                        isUser(friend, inboundRequestExists);
                        function inboundRequestExists(userExists) {
                            if (userExists) {

                                isInboundRequest(username, friend, finished);
                            } else {
                                finished(false);
                            }
                        };
                    } else {
                        finished(false);
                    }
                };
            } else {
                finished(false);
            }
        };
    }
};


//Method Name: isOkToAddFriend
//Method Status: Ready for Testing
/*
 
  Inputs: 'username' is the name of the user who wants to check if it is okay to  add 'friend' to friends.
  
          'friend' is the name of the user that 'username' wants to check if it is okay to add.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           'true' if user 'username' is not already a friend with 'friend'
                  and if 'username' is not 'friend'
                  and if 'friend' exists
                  
           'false' otherwise
           
           
   Helpers: isFriend, isUser 
 
*/

function isOkToAddFriend(username, friend, finished) {
    if (username === friend) {
        finished(false);
    } else {
        isFriend(username, friend, userExists);

        function userExists(alreadyFriend) {
            if (!alreadyFriend) {
                isUser(username, finished);
            } else {
                finished(false);
            }
        }
    }
};


//Method Name: updatePassword
//Method Status: Needs Modification (may want to change name so this isn't called directly by mistake)
/*
 
  Inputs: 'user' is a Person document associated with the database at mongoUrl.
          
          'newPassword' is a String that 'user' wants to be their new password
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           true if the 'newPassword' is now the associated with 'user' in place of their old password.
                  
           false otherwise
           
           
  Helpers: createSalt, createHash 
 
*/

function updatePassword(user, newPassword, finished) {
    var salt = createSalt();
    var hashedPassword = createHash(newPassword + salt);
    mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished(false);
        } else {
            //might want to use something other than _id
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
};   


function createSalt() {
    return crypto.randomBytes(32).toString('hex');
};

function createHash(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}; 


//Method Name: checkPassword
//Method Status: Ready for Testing
/*
 
  Inputs: 'user' is a Person document associated with the database at mongoUrl.
          
          'password' is a String
          
          
  Outputs: callsback 'finished' with argument:
       
           true if the 'password' is associated with the 'user' document
                  
           false otherwise
           
           
  Helpers: createHash 
 
*/

function checkPassword(user, password) {
    var salt = user.salt;
    var hash = createHash(password + salt);

    if (hash === user.hashedPassword) {
        return true;
    } else {
        return false;
    }
};


//Method Name: retrieveUserById
//Method Status: Needs Modification (may want method name change)
/*
 
  Inputs: 'id' is a String.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           user document if a user with 'id' exists
                  
           null otherwise
           
           
  Helpers: None  
 
*/


function retrieveUserById(id, finished) {
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

};


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
           
           
  Helpers: None  
 
*/

function insertUser(username, hashedPassword, salt, email, finished) {
    mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished(false);
        } else {

            var user = new Person({ username: username, hashedPassword: hashedPassword, salt: salt, friends: [], email: email });
            user.save(function (err) {
                if (err) {
                    database.disconnectHandler(mongoose, finished, null, false);
                } else {
                    database.disconnectHandler(mongoose, finished, null, true);
                }
            });
        }
    });

};
    

//Method Name: getUser
//Method Status: Ready for Testing
/*
 
  Inputs: 'username' is the name of the user who has a document in the database at mongoUrl.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           user database document if user 'username' exists
                  
           null otherwise 
           
           
  Helpers: None
 
*/

function getUser(username, finished) {
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

};


//Method Name: removeRequests
//Method Status: Ready for Testing
/*
 
  Inputs: 'username' is the name of the user who sent a friend request to 'friend'.
  
          'friend' is the name of the user who received a friend request from 'username'.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           'true' if user 'username' has their outbound request to 'friend' deleted
                  and if user 'friend' has their inbound request from 'username' deleted.
                  
           'false' otherwise
           
           
  Helpers: None  
 
*/

function removeRequests(username, friend, finished) {
    mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished(false);
        } else {

            var conditions = { username: username };
            var update = { $pull: { inboundRequests: friend } };
            var options = {};
            Person.update(conditions, update, options, removeInboundRequest);

            function removeInboundRequest(err) {
                if (err) {
                    console.log(err);
                    database.disconnectHandler(mongoose, finished, null, false);
                } else {

                    conditions = { username: friend };
                    var update = { $pull: { outboundRequests: username } }; //throws a warning if I don't add var, check this out later
                    options = {};
                    Person.update(conditions, update, options, requestsRemoved);

                    function requestsRemoved() {
                        if (err) {
                            console.log(err);
                            database.disconnectHandler(mongoose, finished, null, false);
                        } else {
                            database.disconnectHandler(mongoose, finished, null, true);
                        }
                    }
                }
            }
        }
    })

};
    

//Method Name: addFriend
//Method Status: Ready for Testing
/*
 
  Inputs: 'username' is the name of the user who wants to add 'friend' to friends.
                     and is not already a friend with 'friend'
                     and 'friend' !== 'username'
                     and 'friend' exists
  
          'friend' is the name of another user who wants to add 'user' to friends.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           'true' if user 'username' has added 'friend' to their friends
                  
           'false' otherwise
           
           
   Helpers: isOkToAddFriend 
 
*/

function addFriend(username, friend, finished) {

    isOkToAddFriend(username, friend, finished);

    function proceedToAdd(proceed) {
        if (proceed) {

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

        } else {
            finished(false);
        }
    }


};


//Method Name: removeFriend
//Method Status: Ready For Testing
/*
 
  Inputs: 'username' is the name of the user who is friends with 'friend'.
  
          'friend' is the name of the user who friends with 'username'.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           'true' if user 'friend' is no longer in friends of 'username'
                  
           'false' otherwise
           
           
  Helpers: None 
 
*/

function removeFriend(username, friend, finished) {
    mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished(false);
        } else {

            var conditions = { username: username };
            var update = { $pull: { friends: friend } };
            var options = {};
            Person.update(conditions, update, options, removedFriend);
            function removedFriend(err) {
                if (err) {
                    database.disconnectHandler(mongoose, finished, null, false);
                } else {
                    database.disconnectHandler(mongoose, finished, null, true);
                }
            }
        }
    });
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
               
       Helpers: retrieveUserById, updatePassword 
    
    */

    changePassword: function (userId, oldPassword, newPassword, finished) {
        
        retrieveUserById(userId, done);

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
               
      Helpers: createHash, isEmail, isUser, insertUser
    
    */
    
    createUser: function (username, password, email, finished) {
        
        //this will change later
        if (username === undefined || password === undefined || email === undefined) {
            finished(false);
        } else {

            var salt = createSalt();
            var hashedPassword = createHash(password + salt);

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
        }
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
               
               
      Helpers: checkPassword  
    
    */

    retrieveUser: function (username, password, finished) {

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
               
      Helpers: None  
    
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
    
    
    //Method Name: getInboundRequests
    //Method Status: Ready for Testing
    /*
    
      Inputs: 'username' is the name of the user who has a document in the database at mongoUrl.
      
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               {inboundRequests: [...]} if user 'username' exists
                      
               {inboundRequests: []} otherwise
               
          
      Helpers: getUser  
    
    */
  
    getInboundRequests: function (username, finished) {

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
           
               {outboundRequests: [...]} if user 'username' exists
                      
               {outboundRequests: []} otherwise
               
            
      Helpers: getUser  
    
    */
    
    getOutboundRequests: function (username, finished) {

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
    //Method Status: Needs Modificatoin (consider using something like a decorator, also break this up more)
    /*
    
      Inputs: 'username' is the name of the user who does not have an outbound friend request to 'friend'
               and does not have an inbound request from 'friend'
               and is not 'friend'
               and is not already a friend of 'friend' 
               and wants to send a friend request to 'friend'
               and 'friend' exists 
      
              'friend' is the name of the user to whom a friend request from 'username' will be sent.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               'true' if user 'username' has added 'friend' to their outboundRequests
                      and if user 'friend' has added 'username' to their inboundRequests
                      
               'false' otherwise
               
           
      Helpers: isOkToSendFriendRequest  
    
    */

    sendFriendRequestTo: function (username, friend, finished) {

        isOkToSendFriendRequest(username, friend, sendReq);


        function sendReq(success) {

            if (!success) {

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
            } else {
                database.disconnectHandler(mongoose, finished, null, false);
            }
        }//sendReq
         
        
    },
    
       
    //Method Name: acceptFriendRequest
    //Method Status: Ready For Testing
    /*
    
      Inputs: 'username' is the name of the user who received a friend request from 'username'.
      
              'friend' is the name of the user who sent a friend request to 'username'.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               'true' if user 'username' has added 'friend' to their friends
                      and if user 'username' has deleted 'friend' from their inboundRequests 
                      and if user 'friend' has added 'username' to their friends
                      and if user 'friend' has deleted 'username' from their outboundRequests 
                      
               'false' otherwise
               
               
      Helpers: addFriend, removeRequests  
    
    */
    
    acceptFriendRequest: function (username, friend, finished) {

        var addFriend = this.addFriend;

        addFriend(username, friend, mirrorAddFriend);

        function mirrorAddFriend(success) {
            if (success) {
                addFriend(friend, username, removeReqs);
                function removeReqs(success) {
                    if (success) {
                        removeRequests(username, friend, finished);
                    } else {
                        console.log('error accepting friend request');
                    }
                }
            } else {
                console.log('error accepting friend request');
            }

        }

    },
    
  
    //Method Name: getFriends
    //Method Status: Ready for Testing
    /*
    
      Inputs: 'username' is the name of the user who has a document in the database at mongoUrl.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               {friends, [...]} if user 'username' exists
                      
               {friends, []} otherwise
               
               
       Helpers: getUser  
    
    */
    
    getFriends: function (username, finished) {

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
               
               
      Helpers: getUser  
    
    */
    getRequestsAndFriends: function (username, finished) {

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
    
    
    //Method Name: unFriend
    //Method Status: Ready For Testing
    /*
    
      Inputs: 'username' is the name of the user who wants to remove 'friend' from their friends.
      
              'friend' is the name of the user who will no longer be friends with 'username'.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               'true' if user 'username' has removed 'friend' from their friends
                      and if user 'friend' has removed 'username' from their friends
                      
               'false' otherwise
               
               
      Helpers: removeFriend  
    
    */
    
    unFriend: function(username, friend, finished){
        removeFriend(username, friend, removeUsername);
        
        function removeUsername(success){
            if(success){
                removeFriend(friend, username, finished);
            }else{
                console.log('problem unfriending');
            }
        }
    },
    
    
    //Method Name: setPrivacy
    //Method Status: Ready For Testing
    /*
    
      Inputs: 'username' is the name of the user who wants to set their privacy setting.
      
              'privacySetting' is the String setting descriptor user 'username' wants to user to set their privacy setting.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               'true' if user 'username' has has their privacy setting set to 'privacySetting'
                      
               'false' otherwise
               
               
      Helpers: None 
    
    */
    
    setPrivacy: function (username, privacySetting, finished) {
        mongoose.connect(mongoUrl, function (err) {
            if (err) {
                console.log(err);
                finished(false);
            } else {
                var conditions = { username: username };
                var update = { privacy: privacySetting};
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
    
    
    //Method Name: getPrivacy
    //Method Status: Ready For Testing
    /*
    
      Inputs: 'username' is the name of the user who wants to get their privacy setting.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               {privacySetting: ...} if user 'username' has a privacy setting
                      
               {privacySetting: ''} otherwise
               
               
      Helpers: None 
    
    */
    
    getPrivacy: function (username, finished) {
        mongoose.connect(mongoUrl, function (err) {
            if (err) {
                console.log(err);
                finished({privacySetting:''});
            } else {
                
                var conditions = { username: username };

                Person.findOne(conditions, function (err, Person) {
                if (err) {
                    console.log(err);    
                    database.disconnectHandler(mongoose, finished, null, {privacySetting: ''});
                } else if (!Person) {
                    database.disconnectHandler(mongoose, finished, null, {privacySetting: ''});
                } else {
                    var privacySetting = Person.privacy;
                    
                    database.disconnectHandler(mongoose, finished, null, {privacySetting: privacySetting});
                }
            });

            }
        });
    },


    //Method Name: addEmail
    //Method Status: Ready For Testing
    /*
    
      Inputs: 'username' is the name of the user who wants to add an email account.
      
              'email' is an email address
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               true if user 'username' has added 'email' to their alternative emails list
                      
               false otherwise
               
               
      Helpers: None 
    
    */
    
    addEmail: function(username, email, finished) {
        mongoose.connect(mongoUrl, function (err) {
                if (err) {
                    console.log(err);
                    finished(false);
                } else {
                    var conditions = { username: username };

                    var update = { $push: { altEmails: email } };
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
    
    
    //Method Name: getPrimaryEmail
    //Method Status: Ready For Testing
    /*
    
      Inputs: 'username' is the name of the user who wants get their primary email.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               {email: '...'} if user 'username' has a primary email
                      
               {email: ''} otherwise
               
               
      Helpers: None 
    
    */
    
    getPrimaryEmail: function(username, finished) {
        mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished({email: ''});
        } else {
            var conditions = { username: username};
            Person.findOne(conditions, function (err, Person) {
                if (err) {
                    console.log(err);
                    database.disconnectHandler(mongoose, finished, null, {email: ''});
                } else if (!Person) {
                    database.disconnectHandler(mongoose, finished, null, {email: ''});
                } else {
                    database.disconnectHandler(mongoose, finished, null, {email: Person.email});
                }
            });
        }
    });
    }
      
                   
}