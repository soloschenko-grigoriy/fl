var mongoose = require('mongoose');
var baucis   = require('baucis');

mongoose.model('view', {
  created: Number,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'person' }
});

baucis.rest('view');

