var mongoose = require('mongoose');
var baucis   = require('baucis');

mongoose.model('comment', {
  description : String,
  created     : Number,
  deleted     : Boolean,

  author : { type: mongoose.Schema.Types.ObjectId, ref: 'person' }
});

baucis.rest('comment');

