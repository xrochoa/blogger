var express = require('express');
var server = new express();
var bodyParser = require('body-parser')


var mongoose = require('mongoose');
var passport = require('passport');

require('./server/models/posts.js');
require('./server/models/comments.js');
require('./server/models/users.js');
require('./server/config/passport.js');
mongoose.connect('mongodb://localhost/news');


server.use(bodyParser.json())

/*----------  ROUTES  ----------*/

var posts = require('./server/routes/posts.js');
var signup = require('./server/routes/signup.js');


server.use(express.static(__dirname + '/dist'));
server.use(passport.initialize());
server.use(signup);
server.use(posts);


server.listen(4000, function() {
    console.log('Serving at http://localhost:8000');
});
