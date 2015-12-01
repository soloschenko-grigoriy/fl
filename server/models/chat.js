var mongoose = require('mongoose');
var baucis   = require('baucis');

mongoose.model('chat', {
  user1: { type: mongoose.Schema.Types.ObjectId, ref: 'person' },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: 'person' },
  message: { type: mongoose.Schema.Types.ObjectId, ref: 'message' },
  created: Number,
  deleted: Boolean
});

baucis.rest('chat');

