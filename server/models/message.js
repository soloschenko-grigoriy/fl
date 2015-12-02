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
  params.data.readed  = false;
  params.data.deleted = false;

  if(_.isObject(params.data.author)){
    params.data.author = params.data.author.id;
  }

  return Parent.prototype.create.call(this, params);
};

module.exports = new Model('message', {
  description   : String,
  created       : Number,
  author        : { type: mongoose.Schema.Types.ObjectId, ref: 'personality' },
  conversation  : { type: mongoose.Schema.Types.ObjectId, ref: 'conversation' },
  readed        : Boolean,
  deleted       : Boolean
});