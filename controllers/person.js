var Person = require('../schema/person');
var database = require('../database/mongoose');
var mongoose = database.mongoose;
var crypto = require('crypto');
var mongoUrl = 'mongodb://localhost:27017/testdbtwo';

//inputs specify what you should be putting in but it will handle the cases when you don't

//todo check the way I'm doing the crypto again
//need to move more stuff up here. Only stuff getting called directly from routes should be exported for now


//I think anything thats a helper should probably be up here
//Also database queries can probably be consolidated more


//may want to store friends _id parameters along with the friends for faster access 


    //Method Name: getInboundRequests
    //Method Status: Ready for Testing
    /*
    
      Inputs: '_id' is the id associated with the user who has a document in the database at mongoUrl.
      
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               {inboundRequests: [...]} if id associate with user 'username' exists
                      
               {inboundRequests: []} otherwise
               
          
      Helpers: getUser  
    
    */


function getInboundRequests(_id, finished) {

    getUser(_id, done);

    function done(inboundRequestIds) {
        if (inboundRequestIds.length === 0) {
            finished({ inboundRequests: [] });
        } else {
            Person.find({ _id: { $in: inboundRequestIds } }, { _id: 0, username: 1 }, function (err, inboundRequests) {
                if (err) {
                    console.log(err);
                    finished({ inboundRequests: [] });
                } else {
                    finished({ inboundRequests: inboundRequests });
                }
            });
        }
    }
};


//Method Name: getOutboundRequests
//Method Status: Ready for Testing
/*
 
  Inputs: _id' is the id associated with the user that wants to get the usernames in its outboundRequestIds
  
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           { outboundRequests: [...] } if id associated with user 'username' has has friends
                  
           { outboundRequests: [] } otherwise
           
           
   Helpers: None
 
*/

function getOutboundRequests(_id, finished) {

    getUser(_id, done);

    function done(outboundRequestIds) {
        if (outboundRequestIds.length === 0) {
            finished({ outboundRequests: [] });
        } else {
            Person.find({ _id: { $in: outboundRequestIds } }, { _id: 0, username: 1 }, function (err, outboundRequests) {
                if (err) {
                    console.log(err);
                    finished({ outboundRequests: [] });
                } else {
                    finished({ outboundRequests: outboundRequests });
                }
            });
        }
    }
};


//Method Name: getIdByUsername
//Method Status: Ready for Testing
/*
 
  Inputs: 'username' is the user that you want to get an Id for
  
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           id if there is an id associated with user 'username'
                  
           null otherwise
           
           
   Helpers: None
 
*/


function getIdByUsername(username, finished) {
    var conditions = { username: username };
    var userId;
    Person.find(conditions, function (err, person) {
        if (err) {
            database.disconnectHandler(mongoose, finished, null, null);
        } else {
            userId = person._id;
            database.disconnectHandler(mongoose, finished, null, userId);
        }

    });
};


//Method Name: getFriends
//Method Status: Ready for Testing
/*
 
  Inputs: '_id' is the id associated with the user that wants to get the names of its friends
  
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           {friends: [...]} if id associated with user 'username' has has friends
                  
           {friends: []} otherwise
           
           
   Helpers: None
 
*/

function getFriends(_id, finished) {

    getUser(_id, done);

    function done(friendIds) {
        if (friendIds.length === 0) {
            finished({ friends: [] });
        } else {
            Person.find({ _id: { $in: friendIds } }, { _id: 0, username: 1 }, function (err, friends) {
                if (err) {
                    console.log(err);
                    finished({ friends: [] });
                } else {
                    finished({ friends: friends });
                }
            });
        }
    }

};


//Method Name: getRequestIdsAndFriendIds
//Method Status: Ready for Testing
/*
 
  Inputs: '_id' is the id associated with the user that wants to get an object with friendIds, outboundRequestIds and inboundRequestIds
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           {friendIds: [...], outboundRequestIds: [...], inboundRequestIds: [...]} if id associated with user 'username' has has requests
                  
           {friendIds: [''], outboundRequestIds: [''], inboundRequestIds: ['']} otherwise
           
           
   Helpers: None
 
*/

function getRequestIdsAndFriendIds(_id, finished) {

    getUser(_id, callback);

    function callback(user) {
        if (user !== null) {
            var friendIds = user.friendIds;
            var outboundRequestIds = user.outboundRequestIds;
            var inboundRequestIds = user.inboundRequestIds;


            finished({ friendIds: friendIds, outboundRequestIds: outboundRequestIds, inboundRequestIds: inboundRequestIds });
        } else {
            console.log('could not find the user');
            finished({ friendIds: [], outboundRequestIds: [], inboundRequestIds: [] });
        }

    }

};


//Method Name: isInboundRequest
//Method Status: Ready for Testing
/*
 
  Inputs: '_id' is the id associated with the user that may have an inbound request from 'friend'
  
          'friendId' is the id associated with the user to whom there may be an outbound request to 'username'
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           'true' if user 'username' has an inbound request from 'friend' in their inboundRequestIds
                  
           'false' otherwise 
           
           
   Helpers: None
 
*/

function isInboundRequest(_id, friendId, finished) {

    mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished(false);
        } else {
            var conditions = { _id: _id, inboundRequestIds: friendId };
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
 
  Inputs: '_id' is the id associated with the user that may have an outbound request to 'friend'
  
          'friendId' is the name of the user to whom there may be an inbound request from 'username'
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           'true' if user 'username' has an outbound request to 'friend' in their outboundRequestIds
                  
           'false' otherwise 
           
   Helpers: None
 
*/


function isOutboundRequest(_id, friendId, finished) {

    mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished(false);
        } else {
            var conditions = { _id: _id, outboundRequestIds: friendId };
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
 
  Inputs: '_id' is the id of a user in the database.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           true if any user document has the username
                  
           false otherwise 
           
           
   Helpers: None 
 
*/

function isUser(_id, finished) {
    mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished(false);
        } else {
            Person.findOne({ _id: _id }, function (err, person) {
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
 
  Inputs: '_id' is the id associated with the user who has a document in the database at mongoUrl.
  
          'friendId' is the id associated with the another user who has a document in the database at mongoUrl.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           'true' if user 'username', associated with _id, has 'friend', associated with friendId in their friendIds
                  
           'false' otherwise
           
        
   Helpers: None 
 
*/


function isFriend(_id, friendId, finished) {
    mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished(false);
        } else {
            var conditions = { _id: _id, friendId: friendId }
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
 
  Inputs: '_id' is the id associated with the user who wants to send a friend request to 'friend', associated with friendId.
  
          'friendId' is the the id associated with the name of the user to whom 'username' wants to check if it is okay to send a friend request.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           'true' if user 'username', associated with _id, is the name of the user who does not have an outbound friend request to 'friend', associated with friendId.
                  and if 'username' does not have an inbound request from 'friend'
                  and if 'username' is not 'friend'
                  and if 'username' is not already a friend of 'friend' 
                  and if 'friend' exists 
                  
           'false' otherwise 
           
           
   Helpers: isOutboundRequest, isFriend, isUser, isInboundRequest
 
*/

function isOkToSendFriendRequest(_id, friendId, finished) {
    if (_id === friendId) {
        finished(false);
    } else {

        isOutboundRequest(_id, friendId, outboundRequestExists);

        function outboundRequestExists(outboundExists) {
            if (!outboundExists) {

                isFriend(_id, friendId, userExists);

                function userExists(alreadyFriend) {
                    if (!alreadyFriend) {

                        isUser(friendId, inboundRequestExists);
                        function inboundRequestExists(userExists) {
                            if (userExists) {

                                isInboundRequest(_id, friendId, done);
                                
                                function done(inboundRequestExisted){
                                    if(inboundRequestExisted){
                                        finished(false);
                                    }else{
                                        finished(true);
                                    }
                                }
                                
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
 
  Inputs: '_id' is the id associated with the user who wants to check if it is okay to  add 'friend' to friends.
  
          'friendId' is the id associated with the user that 'username' wants to check if it is okay to add.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           'true' if user 'username', associated with id, is not already a friend with 'friend', associated with friendId
                  and if the id associated with 'username' is not the same as the id associated with 'friend'
                  and if 'friend', associated with friend id, exists
                  
           'false' otherwise
           
           
   Helpers: isFriend, isUser 
 
*/

function isOkToAddFriend(_id, friendId, finished) {
    if (_id === friendId) {
        finished(false);
    } else {
        isFriend(_id, friendId, userExists);

        function userExists(alreadyFriend) {
            if (!alreadyFriend) {
                isUser(_id, finished);
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
 
  Inputs: '_id' is associated with a user.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           user document if a user with '_id' exists
                  
           null otherwise
           
           
  Helpers: None  
 
*/


function retrieveUserById(_id, finished) {
    mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished(null);
        } else {
            Person.findOne({ _id: _id }, function (err, person) {
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
 
  Inputs: '_id' is the id associated with the user who has a document in the database at mongoUrl.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           user database document if user 'username' exists
                  
           null otherwise 
           
           
  Helpers: None
 
*/

function getUser(_id, finished) {
    mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished(null);
        } else {
            var conditions = { _id: _id };
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
 
  Inputs: '_id' is the id associated with the user who sent a friend request to 'friend'.
  
          'friend' is the name of the user who received a friend request from 'username'.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           'true' if user 'username' has their outbound request to 'friend' deleted
                  and if user 'friend' has their inbound request from 'username' deleted.
                  
           'false' otherwise
           
           
  Helpers: None  
 
*/    

function removeRequests(_id, friendId, finished) {
    mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished(false);
        } else {

            var conditions = { _id: _id };
            var update = { $pull: { inboundRequestIds: friendId } };
            var options = {};
            Person.update(conditions, update, options, removeInboundRequest);

            function removeInboundRequest(err) {
                if (err) {
                    console.log(err);
                    database.disconnectHandler(mongoose, finished, null, false);
                } else {

                    conditions = { _id: friendId };
                    var update = { $pull: { outboundRequestIds: _id } }; 
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
 
  Inputs: ''_id' is the id associated with the user who wants to add 'friend' to friends.
                     and is not already a friend with 'friend'
                     and the id associated with 'friend' !== the id associated with 'username'
                     and 'friend' exists
  
          'friend' is the name of another user who wants to add 'user' to friends.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           'true' if the id associated with user 'username' has added the id associated with 'friend' to their friendIds
                  
           'false' otherwise
           
           
   Helpers: isOkToAddFriend 
 
*/

function addFriend(_id, friendId, finished) {

    isOkToAddFriend(_id, friendId, finished);

    function proceedToAdd(proceed) {
        if (proceed) {

            mongoose.connect(mongoUrl, function (err) {
                if (err) {
                    console.log(err);
                    finished(false);
                } else {
                    var conditions = { _id: _id };

                    var update = { $push: { friendIds: friendId } };
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
 
  Inputs: '_id' is the id associated with the user who is friends with 'friend'.
  
          'friendId' is the id associated with name of the user who friends with 'username'.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           'true' if user the id associated with 'friend' is no longer in friendIds of 'username'
                  
           'false' otherwise
           
           
  Helpers: None 
 
*/    

function removeFriend(_id, friendId, finished) {
    mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished(false);
        } else {

            var conditions = { _id: _id };
            var update = { $pull: { friendIds: friendId } };
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

    changePassword: function (_id, oldPassword, newPassword, finished) {
        
        retrieveUserById(_id, done);

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
    
    
    //Method Name: getInboundRequestIds
    //Method Status: Ready for Testing
    /*
    
      Inputs: '_id' is the id associated with the user who has a document in the database at mongoUrl.
      
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               {inboundRequests: [...]} if id associate with user 'username' exists
                      
               {inboundRequests: []} otherwise
               
          
      Helpers: getUser  
    
    */

    getInboundRequestIds: function (_id, finished) {

        getUser(_id, callback);

        function callback(user) {
            if (user !== null) {
                var inboundRequestIds = { inboundRequestIds: user.inboundRequestIds };
                finished(inboundRequestIds);
            } else {
                console.log('could not find the user');
                finished({ inboundRequestIds: [] });
            }

        }
    },
    
    
        //Method Name: getOutboundRequestIds
        //Method Status: Ready for Testing
        /*
        
          Inputs: '_id' is the id associated with the user who has a document in the database at mongoUrl.
          
                  'finished' is the callback function.
                  
                  
          Outputs: callsback 'finished' with argument:
               
                   {outboundRequestIds: [...]} if id associated with user 'username' exists
                          
                   {outboundRequestIds: []} otherwise
                   
                
          Helpers: getUser  
        
        */

        getOutboundRequestIds: function (_id, finished) {

            getUser(_id, callback);

            function callback(user) {
                if (user !== null) {
                    var outboundRequestIds = { outboundRequestIds: user.outboundRequestIds };

                    finished(outboundRequestIds);
                } else {
                    console.log('could not find the user');
                    finished({ outboundRequestIds: [] });
                }

            }
        },
    
        //Method Name: getOutboundRequests
        //Method Status: Ready for Testing
        /*
        
          Inputs: '_id' is the id associated with the user who has a document in the database at mongoUrl.
          
                  'finished' is the callback function.
                  
                  
          Outputs: callsback 'finished' with argument:
               
                   {outboundRequests: [...]} if id associated with user 'username' exists
                          
                   {outboundRequests: []} otherwise
                   
                
          Helpers: getUser  
        
        */
        
        getOutboundRequests: function (_id, finished) {

            getUser(_id, done);

            function done(outboundRequestIds) {
                if (outboundRequestIds.length === 0) {
                    finished({ outboundRequests: [] });
                } else {
                    Person.find({ _id: { $in: outboundRequestIds } }, { _id: 0, username: 1 }, function (err, outboundRequests) {
                        if (err) {
                            console.log(err);
                            finished({ outboundRequests: [] });
                        } else {
                            finished({ outboundRequests: outboundRequests });
                        }
                    });
                }
            }
        },
    
    //Method Name: sendFriendRequestTo
    //Method Status: Needs Modificatoin (consider using something like a decorator, also break this up more)
    /*
    
      Inputs: _id' is the id associated with the user who does not have an outbound friend request to 'friend'
               and does not have an inbound request from 'friend'
               and is not the id associated with 'friend'
               and is not already a friend of 'friend' 
               and wants to send a friend request to 'friend'
               and 'friend' exists 
      
              'friend' is the name of the user to whom a friend request from 'username' will be sent.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               'true' if user 'username' has added the id of 'friend' to their outboundRequests
                      and if user 'friend' has added the id of 'username' to their inboundRequests
                      
               'false' otherwise
               
           
      Helpers: isOkToSendFriendRequest  
    
    */

    
    
        sendFriendRequestTo: function (_id, friend, finished) {

            getIdByUsername(friend, gotIdByUsername);

            function gotIdByUsername(friendId) {
                if (friendId !== null) {
                    isOkToSendFriendRequest(_id, friendId, sendReq);
                } else {
                    finished(false);
                }
            };

            function sendReq(success) {

                if (success) {

                    mongoose.connect(mongoUrl, function (err) {
                        if (err) {

                            console.log(err);
                            finished(false);
                        } else {
                            var conditions = { username: friend };
                            var friendId;
                            Person.find(conditions, updateInboundRequestIds);

                            function updateInboundRequestIds(err, person) {
                                if (err) {
                                    console.log(err);
                                    database.disconnectHandler(mongoose, finished, null, false);
                                } else {
                                    friendId = person._id;
                                    person.inboundRequestIds.push(_id);
                                    person.save(updateInboundRequestIds);
                                }
                            }


                            function updateOutboundRequestIds(err, person) {
                                if (err) {
                                    console.log(err);
                                    database.disconnectHandler(mongoose, finished, null, false);
                                } else {
                                    var conditions = { _id: _id };
                                    var update = { $push: { outboundRequestIds: friendId } };
                                    var options = {};
                                    Person.update(conditions, update, options, done);
                                }
                            }

                            function done(err) {
                                if (err) {
                                    console.log(err);
                                    database.disconnectHandler(mongoose, finished, null, false);
                                } else {
                                    database.disconnectHandler(mongoose, finished, null, true);
                                }
                            }

                        }

                    });

                } else {
                    finished(false);
                }
            };
        },
                         
       
    //Method Name: acceptFriendRequest
    //Method Status: Ready For Testing
    /*
    
      Inputs: '_id' is the id associated with the user who received a friend request from 'friend'.
      
              'friend' is the name of the user who sent a friend request to 'username'.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               'true' if user 'username' has added the id associated with 'friend' to their friendIds
                      and if user 'username' has deleted the id associated with 'friend' from their inboundRequestIds 
                      and if user 'friend' has added the id associated wtih 'username' to their friendIds
                      and if user 'friend' has deleted the id associated with 'username' from their outboundRequestIds 
                      
               'false' otherwise
               
               
      Helpers: addFriend, removeRequests  
    
    */
        
      acceptFriendRequest: function (_id, friend, finished) {

          var usersFriendId;

          getIdByUsername(friend, gotIdByUsername);

          function gotIdByUsername(friendId) {
              if (friendId !== null) {
                  usersFriendId = friendId;
                  addFriend(_id, friendId, mirrorAddFriend);
              } else {
                  finished(false);
              }
          };

          function mirrorAddFriend(success) {
              if (success) {
                  addFriend(usersFriendId, _id, removeReqs);
                  function removeReqs(success) {
                      if (success) {
                          removeRequests(_id, usersFriendId, finished);
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
    
      Inputs: '_id' is the id associated with the user who has a document in the database at mongoUrl.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               {friends, [...]} if user 'username' associated with _id exists
                      
               {friends, []} otherwise
               
               
       Helpers: getUser  
    
    */
     
      getFriendIds: function (_id, finished) {

          getUser(_id, callback);

          function callback(user) {
              if (user !== null) {
                  var friendIds = { friendIds: user.friendIds };
                  finished(friendIds);
              } else {
                  console.log('could not find the user');
                  finished({ friendIds: [] });
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
     
    getRequestsAndFriends: function (_id, finished) {

        getRequestIdsAndFriendIds(_id, gotRequestIdsAndFriendIds);

        function gotRequestIdsAndFriendIds(requestIdsAndFriendIds) {


            var friendIds = requestIdsAndFriendIds.friendIds;
            var outboundRequestIds = requestIdsAndFriendIds.outboundRequestIds;
            var inboundRequestIds = requestIdsAndFriendIds.inboundRequestIds;

            var usersFriends;
            var usersOutboundRequests;
            var usersInboundRequests;
            

            getFriends(friendIds, gotFriends);
            
            function gotFriends(friends) {
                getOutboundRequests(outboundRequestIds, gotOutboundRequests);
                usersFriends = friends;

            }
            function gotOutboundRequests(outboundRequests) {
                getInboundRequests(inboundRequestIds, gotInboundRequests);
                usersOutboundRequests = outboundRequests;
            }
            function gotInboundRequests(inboundRequests) {
                usersInboundRequests = inboundRequests;
                finished({ friends: usersFriends, outboundRequests: usersOutboundRequests, inboundRequests: usersInboundRequests });
            }

        }

    },
    
    
    //Method Name: unFriend
    //Method Status: Ready For Testing
    /*
    
      Inputs: '_id' is the id associated with the user who wants to remove 'friend' from their friends.
      
              'friend' is the name of the user who will no longer be friends with 'username'.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               'true' if user 'username' associated with _id has removed 'friend' from their friends
                      and if user 'friend' has removed 'username' associated with _id from their friends
                      
               'false' otherwise
               
               
      Helpers: removeFriend  
    
    */
    
    unFriend: function(_id, friend, finished){
        
        var fId;
        
        getIdByUsername(friend, gotIdByUsername);

          function gotIdByUsername(friendId) {
              if (friendId !== null) {
                  fId = friendId; //this will not work
                  removeFriend(_id, friendId, removeUsername);
              } else {
                  finished(false);
              }
          };
        
        function removeUsername(success){
            if(success){
                removeFriend(fId, _id, finished);
            }else{
                console.log('problem unfriending');
            }
        }
    },
    
    
    //Method Name: setPrivacy
    //Method Status: Ready For Testing
    /*
    
      Inputs: '_id' is the id associated with the user who wants to set their privacy setting.
      
              'privacySetting' is the String setting descriptor user 'username' wants to user to set their privacy setting.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               'true' if user 'username' associated with _id has has their privacy setting set to 'privacySetting'
                      
               'false' otherwise
               
               
      Helpers: None 
    
    */ 
    
        setPrivacy: function (_id, privacySetting, finished) {
        mongoose.connect(mongoUrl, function (err) {
            if (err) {
                console.log(err);
                finished(false);
            } else {
                var conditions = { _id: _id };
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
    
      Inputs: '_id' is the id associated with the user who wants to get their privacy setting.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               {privacySetting: ...} if user 'username' associated with _id has a privacy setting
                      
               {privacySetting: ''} otherwise
               
               
      Helpers: None 
    
    */
    
        getPrivacy: function (_id, finished) {
        mongoose.connect(mongoUrl, function (err) {
            if (err) {
                console.log(err);
                finished({privacySetting:''});
            } else {
                
                var conditions = { _id: _id };

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
    
      Inputs: '_id' is the id associated with the user who wants to add an email account.
      
              'email' is an email address
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               true if user 'username' associated with _id has added 'email' to their alternative emails list
                      
               false otherwise
               
               
      Helpers: None 
    
    */
    
        addEmail: function(_id, email, finished) {
        mongoose.connect(mongoUrl, function (err) {
                if (err) {
                    console.log(err);
                    finished(false);
                } else {
                    var conditions = { _id: _id };

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
    
      Inputs: '_id' is the id associated with the user who wants get their primary email.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               {email: '...'} if user 'username' associated with _id has a primary email
                      
               {email: ''} otherwise
               
               
      Helpers: None 
    
    */

     getPrimaryEmail: function(_id, finished) {
        mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished({email: ''});
        } else {
            var conditions = { _id: _id};
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