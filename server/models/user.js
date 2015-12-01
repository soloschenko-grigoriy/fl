var mongoose = require('mongoose');
var baucis = require('baucis');

mongoose.model('user', {
  email       : String,
  password    : String,
  token       : String,
  fbId        : String,
  googleId    : String,
  created     : Number,
  lastLogin   : Number,
  recoverCode : String,
  updated     : Number,

  personalities : [{ type: mongoose.Schema.Types.ObjectId, ref: 'person' }],
  deleted       : Boolean
});

baucis.rest('user');