'use strict';

/**
 *
 * Module dependencies
 */
var fs             = require('fs'),
    crypto         = require('crypto'),
    config         = require('./config'),
    multer         = require('multer'),
    exphbs         = require('express-handlebars'),
    express        = require('express'),
    mongoose       = require('mongoose'),
    bodyParser     = require('body-parser'),
    compression    = require('compression'),
    serveStatic    = require('serve-static'),
    cookieParser   = require('cookie-parser'),
    methodOverride = require('method-override'),

    app  = express();


// Connect to mongodb
var connect = function () {
  var options    = { server: { socketOptions: { keepAlive: 1 } } },
      connection = mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

// Compression middleware (should be placed before express.static)
app.use(compression({
  threshold: 512
}));

app.use(multer({
  dest: config.root + config.publicDir + '/uploads/large/',
  rename: function (fieldname, filename){
    var shasum = crypto.createHash('sha1');

    shasum.update(Math.floor(new Date().getTime() / 1000) + filename);

    return shasum.digest('hex');
  }
}));

// Static files middleware
app.use(serveStatic(config.templates));
app.use(express.static(config.root + config.publicDir));
app.use(express.static(config.root + '.tmp'));


app.engine('hbs', exphbs({ extname: '.hbs' }));
app.set('views', config.root + config.publicDir);
app.set('view engine', 'hbs');

app.use(cookieParser());

// bodyParser should be above methodOverride
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// Bootstrap models
fs.readdirSync(__dirname + '/server/models').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/server/models/' + file);
});

//Bootstrap routes
fs.readdirSync(__dirname + '/server/routes').forEach(function (file) {
  if (~file.indexOf('.js')) {
    require('./server/routes/' + file)(app);
  }
});

var Messages = require(__dirname + '/server/controllers/messages');

new Messages(app.listen(config.port));


console.log('FaceLess started on port ' + config.port);
