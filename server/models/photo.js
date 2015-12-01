var mongoose = require('mongoose');
var baucis   = require('baucis');

mongoose.model('photo', {
  url     : String,
  created : Number,
  deleted : Boolean
});

baucis.rest('photo');

