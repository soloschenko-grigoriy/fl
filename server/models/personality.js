'use strict';

var mongoose = require('mongoose'),
    Parent   = require('./_Model'),
    crypto   = require('crypto'),
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
 * Create model
 *
 * @param  {Object}   options
 * @param  {Function} cb
 *
 * @return {Model}
 */
Model.prototype.create = function(params)
{
  params.data.created = Math.floor(new Date().getTime() / 1000);
  params.data.deleted = false;

  return Parent.prototype.create.call(this, params);
};

/**
 * Update model
 *
 * @param  {Object}   options
 * @param  {Function} cb
 *
 * @return {Model}
 */
Model.prototype.change = function(params)
{
  var token = params.cookies.token;
  if(!token){
    return params.error({'code': 1000, 'details': ['token']}, 401);
  }

  if(params.data.followers && _.isObject(params.data.followers)){
    var followers = _.pluck(params.data.followers, 'id');

    params.data = {
      followers: followers
    };

    return Parent.prototype.change.call(this, params);
  }


  var self = this;
  mongoose.model('user').list({
    data:{
      token: token
    },
    success: function(result){
      result = _.first(result);

      if(!result || !result.id){
        return params.error({'code': 1000, 'details': ['token']}, 401);
      }

      var old = _.any(result.personalities, function(one){
        return one.equals(params.criteria._id);
      });

      if(!old){
        return params.error({'code': 1000, 'details': ['token']}, 401);
      }

      if(_.isObject(params.data.followings)){
        params.data.followings = _.pluck(params.data.followings, 'id');
      }

      Parent.prototype.change.call(self, params);
    },
    error: function (err){
      params.error(err);
    }
  });

  return this;
};

module.exports = new Model('personality', {
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
  followers   : [{ type: mongoose.Schema.Types.ObjectId, ref: 'personality' }],
  followings  : [{ type: mongoose.Schema.Types.ObjectId, ref: 'personality' }]
});