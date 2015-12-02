'use strict';

var mongoose = require('mongoose'),
    Parent   = require('./_Model');

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

module.exports = new Model('photo', {
  url     : String,
  created : Number,
  deleted : Boolean
});