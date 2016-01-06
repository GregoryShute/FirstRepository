module.exports={
    
    mongoose: require('mongoose'),
    
    disconnectHandler: function (mongoose, next, onErr, onSuccess) {
        this.mongoose.disconnect(function (err) {
            if (err) {
                console.log(err);
            } else {
                next(onSuccess);
            }
        });
    }

}

