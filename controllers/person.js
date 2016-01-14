var Person = require('../schema/person');
var database = require('../database/mongoose');
var mongoose = database.mongoose;
var crypto = require('crypto');
var mongoUrl = 'mongodb://localhost:27017/testdbtwo';

//look into gridfs
//use moment too

//inputs specify what you should be putting in but it will handle the cases when you don't

//todo check the way I'm doing the crypto again
//need to move more stuff up here. Only stuff getting called directly from routes should be exported for now


//I think anything thats a helper should probably be up here
//Also database queries can probably be consolidated more


//may want to store friends _id parameters along with the friends for faster access


//Method Name: getDocByUsername
//Method Status: Ready for Testing
/*
 
  Inputs: 'username' is the user 'username' that has a document in the database
  
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
            user document if user 'username' has a document in the database
                  
            null otherwise 
           
           
   Helpers: None
 
*/

function getDocByUsername(username, finished) {
    mongoose.connect(mongoUrl, function (err, person) {
        if (err) {
            console.log(err);
            finished(null);
        } else {
            Person.find({ username: username }, function (err, person) {
                if (err) {
                    console.log(err);
                    database.disconnectHandler(mongoose, finished, null, null);
                } else {
                    finished(person);
                }
            })
        }
    });
};


//Method Name: isInboundRequest
//Method Status: Ready for Testing
/*
 
  Inputs: '_id' is the id associated with the user that may have an inbound request from 'friend'
  
          'friendId' is the id associated with the user to whom there may be an outbound request to 'username'
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           'true' if user 'username' has an inbound request from 'friend' in their inboundRequests
                  
           'false' if 'user 'username' does not have an inbound request from 'friend' in their inboundRequests
           
           'unknown' if error
           
   Helpers: None
 
*/

function isInboundRequest(_id, friendId, finished) {

    mongoose.connect(mongoUrl, startIsInboundRequestPipeline);

    function startIsInboundRequestPipeline(err) {
        if (err) {
            console.log(err);
            finished('unknown');
        } else {
            getFriendById();
        }
    };

    function getFriendById() {
        var conditions = { _id: friendId };
        Person.findOne(conditions, inboundRequestCheck);
    };

    function inboundRequestCheck(err, person) {
        if (err) {
            console.log(err);
            finished('unknown');
        } else {
            var inboundRequests = person.inboundRequests;
            var isInboundRequest = false;
            inboundRequests.forEach(function (element) {
                if (element._id === _id) {
                    isInboundRequest = true;
                }
            }, this);
            done(isInboundRequest);
        }
    };

    function done(isInboundRequest) {
        if (isInboundRequest) {
            database.disconnectHandler(mongoose, finished, null, true);
        } else {
            database.disconnectHandler(mongoose, finished, null, false);
        }
    };

};


//Method Name: isOutboundRequest
//Method Status: Ready for Testing
/*
 
  Inputs: '_id' is the id associated with the user that may have an outbound request to 'friend'
  
          'friendId' is the id associated with name of the user to whom there may be an inbound request from 'username'
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           'true' if user 'username' has an outbound request to 'friend' in their outboundRequests
                  
           'false' if user 'username' does not have an outbound request to 'friend' in their outboundRequests
           
           'unknown' if error 
           
   Helpers: None
 
*/


function isOutboundRequest(_id, friendId, finished) {

    mongoose.connect(mongoUrl, startIsOutboundRequestPipeline);

    function startIsOutboundRequestPipeline(err) {
        if (err) {
            console.log(err);
            finished('unknown');
        } else {
            getFriendById();
        }
    };

    function getFriendById() {
        var conditions = { _id: friendId };
        Person.findOne(conditions, outboundRequestCheck);
    }

    function outboundRequestCheck(err, person) {
        if (err) {
            console.log(err);
            finished('unknown');
        } else {
            var outboundRequests = person.outboundRequests;
            var isOutboundRequest = false;
            outboundRequests.forEach(function (element) {
                if (element._id === _id) {
                    isOutboundRequest = true;
                }
            }, this);
            done(isOutboundRequest);
        }
    };

    function done(isOutboundRequest) {
        if (isOutboundRequest) {
            database.disconnectHandler(mongoose, finished, null, true);
        } else {
            database.disconnectHandler(mongoose, finished, null, false);
        }
    };

};


//Method Name: isUser
//Method Status: Needs Modification (may want method name change)
/*
 
  Inputs: '_id' is the id of a user in the database.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           true if any user document has the username
                  
           false if there is no user document with username
           
           unknown if error
           
           
   Helpers: None 
 
*/

function isUser(_id, finished) {
    mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished('unknown');
        } else {
            Person.findOne({ _id: _id }, function (err, person) {
                if (err) {
                    database.disconnectHandler(mongoose, finished, null, 'unknown');
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
       
           'true' if user 'username', associated with _id, has 'friend', associated with friendId in their friends
                  
           'false' if user 'username', associated with _id does not have 'friend', associated with friendId in their friends
           
           'unknown' if error
        
   Helpers: None 
 
*/



function isFriend(_id, friendId, finished) {

    mongoose.connect(mongoUrl, startIsFriendPipeline);

    function startIsFriendPipeline(err) {
        if (err) {
            console.log(err);
            finished('unknown');
        } else {
            getFriendById();
        }
    };

    function getFriendById() {
        var conditions = { _id: friendId };
        Person.findOne(conditions, friendCheck);
    }

    function friendCheck(err, person) {
        if (err) {
            console.log(err);
            finished('unknown');
        } else {
            var friends = person.friends;
            var isFriend = false;
            friends.forEach(function (element) {
                if (element._id === _id) {
                    isFriend = true;
                }
            }, this);
            done(isFriend);
        }
    };

    function done(isFriend) {
        if (isFriend) {
            database.disconnectHandler(mongoose, finished, null, true);
        } else {
            database.disconnectHandler(mongoose, finished, null, false);
        }
    };

};


//Method Name: isEmail
//Method Status: Ready for Testing
/*
 
  Inputs: 'email' is a String.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           true if any user document has the email
                  
           false if there is no user document with this email
           
           'unknown' if error
           
   Helpers: None 
 
*/

function isEmail(email, finished) {
    mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished('unknown');
        } else {
            Person.findOne({ email: email }, function (err, person) {
                if (err) {
                    database.disconnectHandler(mongoose, finished, null, 'unknown');
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
                  
           'false' if it is not ok to send a friend request to 'friend'
           
           'unknown' on error
           
           
   Helpers: isOutboundRequest, isFriend, isInboundRequest
 
*/

function isOkToSendFriendRequest(_id, friendId, finished) {

    if (_id !== friendId) {
        alreadySentRequestCheck();
    } else {
        finished(false);
    }

    function alreadySentRequestCheck() {
        isOutboundRequest(_id, friendId, alreadyRecievedRequestCheck);
    };

    function alreadyRecievedRequestCheck(alreadySent) {
        if (alreadySent === 'unknown') {
            finished('unknown');
        } else {
            if (!alreadySent) {
                isInboundRequest(_id, friendId, alreadyFriendsCheck);
            } else {
                finished(false);
            }
        }

    };

    function alreadyFriendsCheck(alreadyRecieved) {
        if (alreadyRecieved === 'unknown') {
            finished('unknown');
        } else {
            if (!alreadyRecieved) {
                isFriend(_id, friendId, done);
            } else {
                finished(false);
            }
        }

    };

    function done(alreadyFriend) {
        if (alreadyFriend === 'unknown') {
            finished('unknown');
        } else {
            if (!alreadyFriend) {
                finished(true);
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
    
    
    client.connect();
    var query = client.query('INSERT INTO people values(username, lastname CHAR(20) )');
    query.on('end', atEnd);
    
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
    

//Method Name: removeRequests
//Method Status: Ready for Testing
/*
 
  Inputs: '_id' is the id associated with the user who sent a friend request to 'friend'.
  
          'username' is the name of the user who sent a friend request to 'friend'
          
          'friendId' is the id associated with the user who received a friend request from 'username'
  
          'friend' is the name of the user who received a friend request from 'username'.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           'true' if user 'username' has their outbound request to 'friend' deleted
                  and if user 'friend' has their inbound request from 'username' deleted.
                  
           'false' otherwise
           
           
  Helpers: None  
 
*/

function removeRequests(_id, username, friendId, friend, finished) {

    mongoose.connect(mongoUrl, startRemoveRequestsPipeline);

    function startRemoveRequestsPipeline(err) {
        if (err) {
            console.log(err);
            finished(false);
        } else {
            removeRequestFromUser();
        }
    };

    function removeRequestFromUser() {
        var conditions = { _id: _id };
        var update = { $pull: { inboundRequests: { id_: friendId, username: friend } } };
        var options = {};
        Person.update(conditions, update, options, removeRequestFromFriend);
    };

    function removeRequestFromFriend(err) {
        if (err) {
            console.log(err);
            database.disconnectHandler(mongoose, finished, null, false);
        } else {
            var conditions = { _id: _id };
            var update = { $pull: { outboundRequests: { id_: _id, username: username } } };
            var options = {};
            Person.update(conditions, update, options, requestsRemoved);
        }
    };

    function requestsRemoved(err) {
        if (err) {
            console.log(err);
            database.disconnectHandler(mongoose, finished, null, false);
        } else {
            database.disconnectHandler(mongoose, finished, null, true);
        }
    };

};


//Method Name: addFriend
//Method Status: Ready for Testing
/*
 
  Inputs: '_id' is the id associated with the user who wants to add 'friend' to friends.
                     and is not already a friend with 'friend'
                     and the id associated with 'friend' !== the id associated with 'username'
                     and 'friend' exists
                     
          'friendId' is the id associated with the friend who the user associated with id is adding to their friends
  
          'friend' is the name of another user who wants to add 'user' to friends.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           'true' if user 'username' has added 'friend' and the id associated with 'friend' to their friends
                  
           'false' otherwise
           
           
   Helpers: isOkToAddFriend 
 
*/

function addFriend(_id, friendId, friend, finished) {


    mongoose.connect(mongoUrl, startAddFriendPipeline);


    function startAddFriendPipeline(err) {
        if (err) {
            console.log(err);
            finished(false);
        } else {
            insertFriend();
        }
    };

    function insertFriend() {
        var conditions = { _id: _id };
        var update = { $push: { friends: { friendId: friendId, username: friend } } };
        var options = {};
        Person.update(conditions, update, options, friendAdded);
    };

    function friendAdded(err) {
        if (err) {
            console.log(err);
            database.disconnectHandler(mongoose, finished, null, false);
        } else {
            database.disconnectHandler(mongoose, finished, null, true);
        }
    };

};


//Method Name: removeFriend
//Method Status: Ready For Testing
/*
 
  Inputs: '_id' is the id associated with the user who is friends with 'friend'.
  
          'friendId' is the id associated with name of the user who friends with 'username'.
          
          'friend' is the name of the user who is friends with the user associated with _id
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           'true' if user the id associated with 'friend' is no longer in friendIds of 'username'
                  
           'false' otherwise
           
           
  Helpers: None 
 
*/

function removeFriend(_id, friendId, friend, finished) {

    mongoose.connect(mongoUrl, startRemoveFriendPipeline);


    function startRemoveFriendPipeline(err) {
        if (err) {
            console.log(err);
            finished(false);
        } else {
            pullFriend();
        }
    };

    function pullFriend() {
        var conditions = { _id: _id };
        var update = { $pull: { friends: { _id: friendId, username: friend } } };
        var options = {};
        Person.update(conditions, update, options, friendRemoved);
    };

    function friendRemoved(err) {
        if (err) {
            database.disconnectHandler(mongoose, finished, null, false);
            console.log(err);
        } else {
            finished(true);
        }
    };

};



module.exports = {
    
    //Method Name: getUserIdFromDoc
    //Method Status: Ready for testing
    /*
    
      Inputs: 'userDoc' is a Person document that resides in the database at mongoUrl.
      
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               doc._id if userDoc is not null
                      
               null otherwise
               
       Helpers: None
    
    */
    
    
    getUserIdFromDoc: function(userDoc, finished){
        if(userDoc === null){
            finished(null);
        }else{
            finished(userDoc._id);
        } 
    },
    

    //Method Name: getFriendId
    //Method Status: Ready for testing
    /*
    
      Inputs: '_id' is associated with the user to look for the id of 'friend' in
      
              'friend' is the username of the id wanted
      
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               doc._id if userDoc is not null
                      
               null otherwise
               
       Helpers: None
    
    */
        
    getFriendId: function (_id, friend, finished) {

        var friendId;

        mongoose.connect(mongoUrl, getUserById); // I think i've been doing this in other methods too so I should probably pull this out
       
        function getUserById(err) {
            if (err) {
                finished(null);
            } else {
                var conditions = { _id: _id }
                Person.findOne(conditions, searchForId);
            }
        };

        function searchForId(err, person) {
            if (err) {
                finished(null);
            } else {
                var friends = person.friends;
                friends.forEach(function (element) {
                    if (friend === element.username) {
                        friendId = element._id;
                    }
                }, this);
                if (friendId === undefined) {
                    finished(null);
                } else {
                    finished(friendId);
                }
            }
        };


    },

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
    
    
    //Method Name: sendFriendRequestTo
    //Method Status: Needs Modificatoin (consider using something like a decorator, also break this up more)
    /*
    
      Inputs: '_id' is the id associated with the user who does not have an outbound friend request to 'friend'
               and does not have an inbound request from 'friend'
               and is not the id associated with 'friend'
               and is not already a friend of 'friend' 
               and wants to send a friend request to 'friend'
               and 'friend' exists 
               
              'username' is the user associated with _id
      
              'friend' is the name of the user to whom a friend request from 'username' will be sent.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               'true' if user 'username' has added the id of 'friend' to their outboundRequests
                      and if user 'friend' has added the id of 'username' to their inboundRequests
                      
               'false' otherwise
               
           
      Helpers: isOkToSendFriendRequest  
    
    */

    sendFriendRequestTo: function (_id, username, friend, finished) {


        getDocByUsername(friend, gotDocByUsername);
        var friendDoc;
        var friendId;

        function gotDocByUsername(person) {
            if (person === null) {
                console.log('error');
                finished(false);
            } else {
                friendDoc = person;
                friendId = person._id;
                isOkToSendFriendRequest(_id, friendId, sendRequest);
            }
        };

        function sendRequest(isOk) {
            if (isOk === 'unknown') {
                finished(false);
            } else {
                if (isOk) {
                    mongoose.connect(mongoUrl, updateInboundRequests);
                } else {
                    console.log('not okay to send request');
                    finished(false);
                }
            }

        };

        function updateInboundRequests(err) {
            if (err) {
                console.log(err);
                database.disconnectHandler(mongoose, finished, null, false);
            } else {
                var conditions = { _id: friendId };
                var update = { $push: { inboundRequests: { _id: _id, username: username } } };
                var options = {};
                Person.update(conditions, update, options, updateOutboundRequests);

            }
        };

        function updateOutboundRequests(err) {
            if (err) {
                console.log(err);
                database.disconnectHandler(mongoose, finished, null, false);
            } else {
                var conditions = { _id: _id };
                var update = { $push: { outboundRequests: { _id: friendId, username: friend } } };
                var options = {};
                Person.update(conditions, update, options, done);

            }
        };

        function done(err) {
            if (err) {
                console.log('this is very bad');
                database.disconnectHandler(mongoose, finished, null, false);
            } else {
                database.disconnectHandler(mongoose, finished, null, true);
            }
        }

    },
                         
       
    //Method Name: acceptFriendRequest
    //Method Status: Ready For Testing
    /*
    
      Inputs: '_id' is the id associated with the user who received a friend request from 'friend'.
      
              'username' is the name of the user who is accepting the friend request from 'friend'
      
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

    acceptFriendRequest: function (_id, username, friend, finished) {

        var inboundRequests;
        var friendId;

        mongoose.connect(mongoUrl, startAcceptPipeline);

        function startAcceptPipeline(err) {
            if (err) {
                finished(false);
            } else {
                var conditions = { _id: _id };
                Person.findOne(conditions, searchInboundRequests);
            }
        };

        function searchInboundRequests(userDoc) {
            if (userDoc) {
                inboundRequests = userDoc.inboundRequests;
                inboundRequests.forEach(function (element) {
                    if (element.username === friend) {
                        friendId = element._id;
                    }
                }, this);
                if (friendId === undefined) {
                    database.disconnectHandler(mongoose, finished, null, false);
                } else {
                    acceptRequests();
                }
            } else {
                database.disconnectHandler(mongoose, finished, null, false);
            }
        };

        function acceptRequests() {
            addFriend(_id, friendId, friend, addUserToFriend);
        };

        function addUserToFriend(friendAdded) {
            if (friendAdded) {
                addFriend(friendId, _id, username, removeReqs);
            } else {
                finished(false);
            }
        }

        function removeReqs(friendsAdded) {
            if (friendsAdded) {
                removeRequests(_id, friendId, friend, finished);
            } else {
                finished(false);
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
               
               
      Helpers: getUser, getRequestIdsAndFriendIds
    
    */

    getRequestsAndFriends: function (_id, finished) {

        var outboundRequests;
        var inboundRequests;
        var friends;

        var outboundRequestsArray;
        var inboundRequestsArray;
        var friendsArray;


        mongoose.connect(mongoUrl, startGetRequestsAndFriendsPipeline);

        function startGetRequestsAndFriendsPipeline(err) {
            if (err) {
                finished({ friends: [], outboundRequests: [], inboundRequests: [] });
            } else {
                getUserDocById();
            }
        };

        function getUserDocById() {
            var conditions = { _id: _id };
            Person.findOne(conditions, getRequestAndFriendUsernames);
        };

        function getRequestAndFriendUsernames(err, person) {
            if (err) {
                console.log(err);
                finished({ friends: [], outboundRequests: [], inboundRequests: [] });
            } else if (!person) {
                finished({ friends: [], outboundRequests: [], inboundRequests: [] });
            } else {
                outboundRequests = person.outboundRequests;
                inboundRequests = person.inboundRequests;
                friends = person.friends;

                outboundRequests.forEach(function (element) {
                    outboundRequestsArray.push(element.username);
                }, this);
                inboundRequests.forEach(function (element) {
                    inboundRequestsArray.push(element.username);
                }, this);
                friends.forEach(function (element) {
                    friendsArray.push(element.username);
                }, this);

                finished({ friends: friendsArray, outboundRequests: outboundRequestsArray, inboundRequests: inboundRequestsArray });
            }
        };

    },
    
    
    //Method Name: unFriend
    //Method Status: Ready For Testing
    /*
    
      Inputs: '_id' is the id associated with the user who wants to remove 'friend' from their friends.
      
              'username' is the name of the user who will no longer be friends with 'friend'
      
              'friend' is the name of the user who will no longer be friends with 'username'.
              
              'finished' is the callback function.
              
              
      Outputs: callsback 'finished' with argument:
           
               'true' if user 'username' associated with _id has removed 'friend' from their friends
                      and if user 'friend' has removed 'username' associated with _id from their friends
                      
               'false' otherwise
               
               
      Helpers: removeFriend, getIdByUsername
    
    */

    unFriend: function (_id, username, friend, finished) {

        var friendId;

        mongoose.connect(mongoUrl, startUnFriendPipeline);

        function startUnFriendPipeline(err) {
            if (err) {
                console.log(err);
                finished(false);
            } else {
                getUserDocById();
            }
        };

        function getUserDocById() {
            var conditions = { _id: _id };
            Person.findOne(conditions, findFriendId);
        };

        function findFriendId(err, person) {
            if (err) {
                console.log(err);
                database.disconnectHandler(mongoose, finished, null, false);
            } else {
                var usersFriends = person.friends;
                usersFriends.forEach(function (element) {
                    if (element.username === friend) {
                        friendId = element._id;
                    }
                }, this);
                removeFriendFromUser();
            }
        };

        function removeFriendFromUser() {
            removeFriend(_id, friendId, friend, removeUserFromFriend);
        };

        function removeUserFromFriend(friendRemoved) {
            if (friendRemoved) {
                removeFriend(friendId, _id, username, done);
            } else {
                database.disconnectHandler(mongoose, finished, null, false);
            }

        };

        function done(userRemoved) {
            if (userRemoved) {
                finished(true);
            } else {
                database.disconnectHandler(mongoose, finished, null, false);
            }
        };

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
                var update = { privacy: privacySetting };
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
                finished({ privacySetting: '' });
            } else {

                var conditions = { _id: _id };

                Person.findOne(conditions, function (err, Person) {
                    if (err) {
                        console.log(err);
                        database.disconnectHandler(mongoose, finished, null, { privacySetting: '' });
                    } else if (!Person) {
                        database.disconnectHandler(mongoose, finished, null, { privacySetting: '' });
                    } else {
                        var privacySetting = Person.privacy;

                        database.disconnectHandler(mongoose, finished, null, { privacySetting: privacySetting });
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

    addEmail: function (_id, email, finished) {
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

    getPrimaryEmail: function (_id, finished) {
        mongoose.connect(mongoUrl, function (err) {
            if (err) {
                console.log(err);
                finished({ email: '' });
            } else {
                var conditions = { _id: _id };
                Person.findOne(conditions, function (err, Person) {
                    if (err) {
                        console.log(err);
                        database.disconnectHandler(mongoose, finished, null, { email: '' });
                    } else if (!Person) {
                        database.disconnectHandler(mongoose, finished, null, { email: '' });
                    } else {
                        database.disconnectHandler(mongoose, finished, null, { email: Person.email });
                    }
                });
            }
        });
    }


}