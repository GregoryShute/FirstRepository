var Post = require('../schema/post');
var Person = require('../schema/person');
var database = require('../database/mongoose');
var mongoose = database.mongoose;
var mongoUrl = 'mongodb://localhost:27017/testdbtwo';


//might change the way this is done later
//for loading posts onto a users page
    //get all posts posted to username
    //parents should already be ordered by time
    //children of those parents should be ordered by time with respect to the parent
    //Just limit to a certain number of posts and let the client sort them out on their end
    //make sure to check for best cases first, if something isn't right on the client they can sort it out
    
//need to check on complexity of database operations in mongodb / mongoose.
//will it loop through all posts checking postedTo field
//or does it have direct access based on the field value
//how does it handle the arrays 
//It might be just the _id parameter that gives me direct access constant time access


//Creation///////////////////////////////////////////////


//Method Name: insertPost
//Method Status: Not Done
/*
 
  Inputs: 'owner' is the name of the user who wants to insert a post into the database.
  
          'parent' is the name of the post that this post will be made as a reply.
                   Set parent as '' if this is not a reply.
  
          'content' is a String that will be the content of the post.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           post._id if post was inserted into database
                  
           null otherwise
           
           
  Helpers:
 
  Notes: remember to use momentjs on the client to get the dates right
*/

function insertPost(owner, parent, content, finished) {
    mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished(null);
        } else {
            var currentTime = new Date();
            var usersPost = new Post({ owner: owner, parent: parent, content: content, createdAt: currentTime});
            usersPost.save(function (err, post) {
                if (err) {
                    database.disconnectHandler(mongoose, finished, null, null);
                } else {
                    database.disconnectHandler(mongoose, finished, null, post._id);
                }
            });
        }
    });
};


//Method Name: createPost
//Method Status: Not Done
/*
 
  Inputs: '_id' is the id associated with name of the user who wants to create a post.
  
          'owner' is the username associated with _id.
  
          'friendId' is the id associated with the page the user associated with _id is posting to
                     this could be the same as _id if you're posting to your own page
  
          'parent' is the name of the post that this post will be made as a reply.
                   Set parent as '' if this is not a reply.
  
          'content' is a String that will be the content of the post.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           true if post was created
                  
           false otherwise
           
           
  Helpers: insertPost, addPostsToOwners
 
*/

function createPost(_id, owner, friendId, parent, content, finished){
      
      insertPost(owner, parent, content, addPostsToOwners);
      
      function postInsertionDone(postId){
          if(postId === null){
              finished(false);
          }else{
              addPostsToOwners(_id, friendId, postId, finished);
          }
      };
};








function addPostsToOwners(_id, friendId, postId, finished){
    mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished(false);
        } else {

            var conditions = { _id: _id };
            var update = { $push: { myPostIds: postId }};
            var options = {};
            Person.update(conditions, update, options, next);
            function next(err) {
                if(err){
                    console.log(err);
                    database.disconnectHandler(mongoose, finished, null, false);
                }else{
                    var conditions = { _id: friendId };
                    var update = { $push: { othersPostIds: postId }};
                    var options = {};
                    Person.update(conditions, update, options, done);
                    function done(err){
                        if(err){
                            console.log(err);
                            database.disconnectHandler(mongoose, finished, null, false);
                        }else{
                            database.disconnectHandler(mongoose, finished, null, true);
                        }
                    }
                }
                
            }
        }
    });
};


//Method Name: okToSetPost
//Method Status: Not Done
/*
 
  Note: I don't know that I want people editing their posts. I think they should delete them and repost.
 
  Inputs: 'owner' is the name of the user who wants to change the post content.
  
          'postId' is the id of the post we want to set.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           true if it is okay to set post 'postId'
                  
           false otherwise
           
           
  Helpers:
 
*/

function okToSetPost(owner, postId, finished){
    
};


//Method Name: setPost
//Method Status: Not Done
/*
 
  Inputs: 'owner' is the name of the user who wants change the post content.
  
          'postId' is the id of the post we want to set.
          
          'content' is a String which will be the posts contents.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           true if post content was updated
                  
           false otherwise
           
           
  Helpers:
 
*/

function setPost(owner, postId, content, finished){
    
};


//Method Name: setChild
//Method Status: Not Done
/*
 
  Inputs: 'owner' is the name of the user who wants change the post content.
  
          'parent' is the name of the post which the child post has replied
          
          'child' is a String which will be the posts contents.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           true if 
                  
           false otherwise
           
           
  Helpers:
 
*/



function setChild(owner, parent, child, finished){
    
}

function setParent(){
    
}

//Gets/////////////////////////////////////////////////////////////
function okToGetPost(){
    
};

// id is you and friendId is basically what page you're on which could be the same is id in this case
//returns the an object with an array of posts at that users page

//let the user assemble the posts
function getPosts(pageId, finished){
     mongoose.connect(mongoUrl, function (err) {
        if (err) {
            
        finished({ postIds: [] });
             
        } else {
            var postIds;
             Person.find({ _id: pageId } , function (err, person) {
                 if(err){
                     console.log(err);
                     database.disconnectHandler(mongoose, finished, null, {posts: []});
                 }else{
                     postIds = person.othersPostIds;
                     Post.find({ _id: { $in: postIds } }, { _id:0, owner:1, content: 1, privacy:1, parent:1, createdAt:1 }, function (err, posts) {
                        if(err){
                            console.log(err);
                            database.disconnectHandler(mongoose, finished, null, {posts: []} );
                        }else{
                            database.disconnectHandler(mongoose, finished, null, {posts: posts} );
                        }
                     });
                 }
                
                
            });
            
        }


    });
};

function getPost(){
    
};

function getPostContent(){
    
};

//Sends/////////////////////////////////////////////////////////
function okToSendPost(){
    
};

function sendPostTo(){
    
};


function sendPost(){
    
};

//Deletes////////////////////////////////////////////////////////
//can only delete a post if you are owner or postedTo
function okToDeletePost(){
    
}

function deletePosts(){
    
}

function deletePost(){
    
}

//Options////////////////////////////////////////////////////////
function setPostPrivacy(postId, privacy, finished) {
    mongoose.connect(mongoUrl, function (err) {
        if (err) {
            console.log(err);
            finished(false);
        } else {

            var conditions = { _id: postId };
            var update = { privacy: privacy };
            var options = {};
            Post.update(conditions, update, options, function (err) {
                if (err) {
                    console.log(err);
                    database.disconnectHandler(mongoose, finished, null, false);
                } else {
                    database.disconnectHandler(mongoose, finished, null, true);
                }
            });
        }
    });
};

function getPostPrivacy(postId){
    
}

module.exports ={
    
    
    
    
    
}