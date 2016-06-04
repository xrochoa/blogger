var express = require('express');
var server = new express();

server.listen(8000, function() {
    server.use(express.static(__dirname + '/dist'));
    console.log('Serving at http://localhost:8000');
});