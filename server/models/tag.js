var mongoose = require('mongoose');
var baucis   = require('baucis');

mongoose.model('tag', {
  name    : String,
  created : Number,
  deleted : Boolean
});

baucis.rest('tag');

