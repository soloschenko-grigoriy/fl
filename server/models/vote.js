var mongoose = require('mongoose');
var baucis   = require('baucis');

mongoose.model('vote', {
  created : Number,
  value   : String,

  author  : { type: mongoose.Schema.Types.ObjectId, ref: 'person' }
});

baucis.rest('vote');

