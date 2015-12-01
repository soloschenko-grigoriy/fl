var mongoose = require('mongoose');
var baucis   = require('baucis');

mongoose.model('post', {
  name        : String,
  description : String,
  created     : Number,
  updated     : Number,
  deleted     : Boolean,

  viewsCount    : Number,
  votesCount    : Number,
  commentsCount : Number,

  tags     : [{ type: mongoose.Schema.Types.ObjectId, ref: 'tag' }],
  views    : [{ type: mongoose.Schema.Types.ObjectId, ref: 'view' }],
  votes    : [{ type: mongoose.Schema.Types.ObjectId, ref: 'vote' }],
  comments : [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],

  author  : { type: mongoose.Schema.Types.ObjectId, ref: 'person' },
  photo   : { type: mongoose.Schema.Types.ObjectId, ref: 'photo' }
});

baucis.rest('post');

