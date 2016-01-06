var express = require('express');
var app = express();

var register = require('./middlewares/register');
app = register(app);

var localPassportMaker = require('./middlewares/localPassportMaker');
var passport = localPassportMaker();

var routes = require('./routes/routes');
routes(app, passport);

var port = process.env.PORT || 3000;
app.listen(port);