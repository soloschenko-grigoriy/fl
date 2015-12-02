'use strict';

var mongoose = require('mongoose'),
    Parent   = require('./_Model'),
    _        = require('underscore');

/**
 * @class Model model
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
var Model = function(name, schema)
{
  return Parent.apply(this, arguments);
};

/**
 * @constructor
 */
Model.prototype.constructor = Model;

/**
 * @inherits
 */
Model.prototype = Object.create(Parent.prototype);

/**
 * Array of fileds that have to be skiped during sanitazing
 *
 * @type {Array}
 */
Model.prototype.skipSanize = ['description'];

/**
 * Create model
 *
 * @param  {Object}   options
 * @param  {Function} cb
 *
 * @return {Model}
 */
Model.prototype.create = function(params)
{
  var token = params.cookies.token;
  if(!token){
    return params.error({'code': 1000, 'details': ['token']}, 401);
  }

  var self = this;
  mongoose.model('user').list({
    data: {
      token: token
    },
    success : function (result){
      result = _.first(result);

      if(!result || !result.id){
        return params.error({'code': 1000, 'details': ['token']}, 401);
      }

      var author = params.data.author;

      if(_.isObject(author)){
        author = author.id;
      }
      var authorFound = _.any(result.personalities, function(one){
        return one.equals(author);
      });

      if(!authorFound){
        return params.error({'code': 1000, 'details': ['token']}, 401);
      }

      /**
       * @todo add real image
       */
      params.data.photo  = '5615a6cd01cdedcb1fd363f4';
      params.data.author  = author;
      params.data.created = Math.floor(new Date().getTime() / 1000);
      params.data.deleted = false;

      if(_.isObject(params.data.tags)){
        params.data.tags = _.pluck(params.data.tags, 'id');
      }

      return Parent.prototype.create.call(self, params);

    },
    error: function (err){
      params.error(err);
    }
  });

  return this;
};

module.exports = new Model('post', {
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

  author  : { type: mongoose.Schema.Types.ObjectId, ref: 'personality' },
  photo : { type: mongoose.Schema.Types.ObjectId, ref: 'photo' }
});