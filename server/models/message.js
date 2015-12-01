var mongoose = require('mongoose');
var baucis   = require('baucis');

mongoose.model('message', {
  description   : String,
  created       : Number,
  author        : { type: mongoose.Schema.Types.ObjectId, ref: 'person' },
  conversation  : { type: mongoose.Schema.Types.ObjectId, ref: 'chat' },
  readed        : Boolean,
  deleted       : Boolean
});

baucis.rest('message');

