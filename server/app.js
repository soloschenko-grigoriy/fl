'use strict';

var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');
var hbs = require('express-hbs');
var socketIO = require('socket.io');
var mongoose = require('mongoose');
var baucis = require('baucis');
var config = require('../config');

// start mongoose
mongoose.connect('mongodb://localhost/sit');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {

	fs.readdirSync(__dirname + '/models').forEach(function (file) {
    if (~file.indexOf('.js')) {
      require(__dirname + '/models/' + file);
    }
  });

	var app = express();

  // app.set('view engine', 'handlebars');
  // app.set('views', config.templates + '/scripts/views');

  app.use('/api', baucis());

	// mount static
	app.use(express.static(config.root + config.publicDir));
	app.use(express.static( path.join( __dirname, '../.tmp') ));

	// route index.html
	app.get('/', function(req, res){
	  res.sendfile(config.root + config.publicDir + '/index.html');
	});

	// start server
	http.createServer(app).listen(config.port, function(){
	    console.log('Express App started!');
	});
});


