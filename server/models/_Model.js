'use strict';

var mongoose        = require('mongoose'),
    _               = require('underscore'),
    sanitizerPlugin = require('mongoose-sanitizer'),
    deepPopulate    = require('mongoose-deep-populate')(mongoose);

/**
 * @class   Product model
 *
 * @author  Soloschenko G. soloschenko@gmail.com
 *
 */
var Model = function(name, schema)
{
  this
      .setSchema(schema)
      .setStatics()
      .registerModel(name);

  return this;
};

/**
 * @constructor
 */
Model.prototype.constructor = Model;

/**
 * Schema setter
 *
 * @return {Model}
 */
Model.prototype.setSchema = function(schema)
{
  this.schema = new mongoose.Schema(schema);

  sanitizerPlugin(this.schema, { skip: this.skipSanize });
  this.schema.plugin(deepPopulate, {});

  this.schema.set('toJSON', {
    transform: function(doc, ret, options)
    {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      delete ret.token;
    }
  });

  return this;
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
    count  : this.count
  };

  return this;
};

/**
 * Register model with mongoose
 *
 * @return {Model}
 */
Model.prototype.registerModel = function(name)
{
  mongoose.model(name, this.schema);

  return this;
};

/**
 * Find model by id
 *
 * @param {Object} params
 *
 * @return {Model}
 */
Model.prototype.count = function(params)
{
  var criteria = {};

  _.each(params.data, function(value, key)
  {
    switch(key){
      case 'like':
        _.each(value, function(v, k)
        {
          criteria[k] = {$regex: v};
        });
        break;
      case 'likeI':
        _.each(value, function(v, k)
        {
          criteria[k] = {$regex: new RegExp(v, 'i')};
        });
        break;
      case 'likeOr':
        var orStatement = [];
        _.each(value, function(v, k)
        {
          var elm = {};
          elm[k]  = {$regex: v, $options: '-i'};
          orStatement.push(elm);
        });
        criteria.$or    = orStatement;
        break;
      case 'in':
        _.each(value, function(v, k)
        {
          criteria[k] = {$in: v};
        });
        break;
      case 'gt':
        _.each(value, function(v, k)
        {
          criteria[k] = {$gt: v};
        });
        break;
      case 'lt':
        _.each(value, function(v, k)
        {
          criteria[k] = {$lt: v};
        });
        break;
      case 'gte':
        _.each(value, function(v, k)
        {
          criteria[k] = {$gte: v};
        });
        break;
      case 'lte':
        _.each(value, function(v, k)
        {
          criteria[k] = {$lte: v};
        });
        break;
      default        :
        criteria[key] = value;
        break;
    }
  });


  this
      .find(criteria)
      .count()
      .exec(function(err, result)
      {
        if(err){
          params.error(err, result);
        }
        params.success(result);
      });


  return this;
};
/**
 * Find model by id
 *
 * @param {Object} params
 *
 * @return {Model}
 */
Model.prototype.load     = function(params)
{
  var populate = '';

  _.each(params.data, function(value, key)
  {
    switch(key){
      case 'populate':
        populate = value;
        break;
    }
  });

  if(populate){
    populate = populate.join(' ');
  }

  this
      .findById(params.id)
      .deepPopulate(populate)
      .exec(function(err, result)
      {
        if(err){
          params.error(err, result);
        }
        params.success(result);
      });

  return this;
};

/**
 * Get count of models by provided creteria
 *
 * @param {Object} options
 * @param {Function} cb
 *
 * @return {Model}
 */
Model.prototype.list = function(params)
{
  var criteria = {},
      fields   = '',
      limit    = 50,
      page     = 0,
      sort     = '_id',
      populate = '';

  _.each(params.data, function(value, key)
  {
    switch(key){
      case 'limit'   :
        limit = value;
        break;
      case 'page'    :
        page = value;
        break;
      case 'sort'    :
        sort = value;
        break;
      case 'lastId'  :
        criteria._id = {$gt: value};
        break;
      case 'lastField':
        _.each(value, function(v, k)
        {
          criteria[k] = {$gte: v};
        });
        break;
      case 'lastMinField':
        _.each(value, function(v, k)
        {
          criteria[k] = {$lte: v};
        });
        break;
      case 'like':
        _.each(value, function(v, k)
        {
          criteria[k] = {$regex: v};
        });
        break;
      case 'likeI':
        _.each(value, function(v, k)
        {
          criteria[k] = {$regex: new RegExp(v, 'i')};
        });
        break;
      case 'likeOr':
        var or = [];
        _.each(value, function(v, k)
        {
          var elm = {};
          elm[k]  = {$regex: v, $options: '-i'};
          or.push(elm);
        });
        criteria.$or = or;
        break;
      case 'or':
        if(!criteria.$or){
          criteria.$or = [];
        }
        _.each(value, function(v, k)
        {
          criteria.$or.push(v);
        });
        break;
      case 'in':
        _.each(value, function(v, k)
        {
          criteria[k] = {$in: v};
        });
        break;
      case 'gt':
        _.each(value, function(v, k)
        {
          criteria[k] = {$gt: v};
        });
        break;
      case 'lt':
        _.each(value, function(v, k)
        {
          criteria[k] = {$lt: v};
        });
        break;
      case 'gte':
        _.each(value, function(v, k)
        {
          criteria[k] = {$gte: v};
        });
        break;
      case 'lte':
        _.each(value, function(v, k)
        {
          criteria[k] = {$lte: v};
        });
        break;
      case 'populate':
        populate = value;
        break;
      case 'fields'  :
        fields = value;
        break;
      default        :
        criteria[key] = value;
        break;
    }
  });

  if(populate){
    populate = populate.join(' ');
  }

  this
      .find(criteria)
      .select(fields)
      .limit(limit)
      .skip(page * limit)
      .deepPopulate(populate)
      .sort(sort)
      .exec(function(err, result)
      {
        if(err){
          params.error(err, result);
        }
        params.success(result);
      });

  return this;
};


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
  new this(params.data).save(function(err, result)
  {
    if(err){
      params.error(err, result);
    }
    params.success(result);
  });

  return this;
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
  this.findOneAndUpdate(params.criteria, params.data, params.additional, function(err, result)
  {
    if(err){
      params.error(err, result);
    }
    params.success(result);
  });

  return this;
};

/**
 * Delete model
 *
 * @param  {Object}   options
 * @param  {Function} cb
 *
 * @return {Model}
 */
Model.prototype.destroy = function(params)
{
  this.remove(params.criteria, function(err, result)
  {
    if(err){
      params.error(err, result);
    }
    params.success(result);
  });

  return this;
};

module.exports = Model;