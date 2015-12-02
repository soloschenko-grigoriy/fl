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

  if(_.isObject(params.data.user1)){
    params.data.user1 = params.data.user1.id;
  }

  if(_.isObject(params.data.user2)){
    params.data.user2 = params.data.user2.id;
  }

  if(_.isObject(params.data.message)){
    params.data.message = params.data.message.id;
  }

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
  if(_.isObject(params.data.message)){
    params.data.message = params.data.message.id;
  }

  return Parent.prototype.change.call(this, params);
};

module.exports = new Model('conversation', {
  user1: { type: mongoose.Schema.Types.ObjectId, ref: 'personality' },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: 'personality' },
  message: { type: mongoose.Schema.Types.ObjectId, ref: 'message' },
  created: Number,
  deleted: Boolean
});