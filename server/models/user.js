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
  var shasum  = crypto.createHash('sha1');

  var token = params.cookies.token;
  if(!token){
    return params.error({'code': 1000, 'details': ['token']}, 401);
  }

  var self = this;
  this.load({
    id      : params.criteria._id,
    success : function (result){
      if(result.token !== token){
        return params.error({'code': 1000, 'details': ['token']}, 401);
      }

      if(params.data.password){
        shasum.update(params.data.password);
        params.data.password = shasum.digest('hex');
      }

      if(params.data.email && result.email !== params.data.email){
        self.list({
          data: {
            email: params.data.email
          },
          success: function (old){
            if(old.length > 0){
              return params.error({'code': 1003, 'details': ['email']}, 400);
            }

            Parent.prototype.change.call(self, params);
          },
          error: function (err){
            params.error(err);
          }
        });

        return this;
      }

      if(_.isObject(params.data.personalities)){
        params.data.personalities = _.pluck(params.data.personalities, 'id');
      }

      Parent.prototype.change.call(self, params);
    },
    error: function (err){
      params.error(err);
    }
  });


  return this;
};

/**
 * Check if provided string is valid email
 *
 * @param  {String}  email
 *
 * @return {Boolean}
 */
Model.prototype.isEmailValid = function(email)
{
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(email);
};

/**
 * Static params setter
 *
 * @return {Model}
 */
Model.prototype.setStatics = function()
{
  this.schema.statics = {
    load   : this.load,
    list   : this.list,
    create : this.create,
    change : this.change,
    destroy: this.destroy,
    count  : this.count,

    isEmailValid  : this.isEmailValid
  };

  return this;
};

module.exports = new Model('user', {
  email       : String,
  password    : String,
  token       : String,
  fbId        : String,
  googleId    : String,
  created     : Number,
  lastLogin   : Number,
  recoverCode : String,
  updated     : Number,

  personalities : [{ type: mongoose.Schema.Types.ObjectId, ref: 'personality' }],
  deleted       : Boolean
});