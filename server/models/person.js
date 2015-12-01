var mongoose = require('mongoose');
var baucis   = require('baucis');

mongoose.model('person', {
  name        : String,
  created     : Number,
  updated     : Number,
  moto        : String,
  about       : String,
  job         : String,
  gender      : String,
  birthDay    : Number,
  birthMonth  : Number,
  birthYear   : Number,
  active      : Boolean,
  deleted     : Boolean,

  followers   : [{ type: mongoose.Schema.Types.ObjectId, ref: 'person' }],
  followings  : [{ type: mongoose.Schema.Types.ObjectId, ref: 'person' }]
});

baucis.rest('person');

