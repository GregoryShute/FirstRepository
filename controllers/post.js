var Post = require('../schema/post');
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


//Method Name: createPost
//Method Status: Not Done
/*
 
  Inputs: 'owner' is the name of the user who wants to create a post.
  
          'parent' is the name of the post that this post will be made as a reply.
  
          'content' is a String that will be the content of the post.
          
          'finished' is the callback function.
          
          
  Outputs: callsback 'finished' with argument:
       
           true if post was created
                  
           false otherwise
           
           
  Helpers:
 
*/

function createPost(owner, parent, content, postedTo, finished) {

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

function getPosts(){
    
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
function setPostPrivacy(){
    
}

function getPostPrivacy(){
    
}

module.exports ={
    
    
    
    
    
}