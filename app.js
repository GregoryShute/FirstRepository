






var express = require('express');
var app = express();

var register = require('./middlewares/register');
app = register(app);

//var initDatabase = require('./database/postgresStarter.js');
var initDatabase = require('./database/sequelize');
initDatabase();


//var localPassportMaker = require('./middlewares/localPassportMaker');
//var passport = localPassportMaker();

//var routes = require('./routes/routes');
//routes(app, passport);

var port = process.env.PORT || 3000;
app.listen(port);