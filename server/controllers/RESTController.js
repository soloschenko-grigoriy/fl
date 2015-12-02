'use strict';

var _ = require('underscore');

/**
 * @class REST controller
 *
 * @author Soloschenko G. soloschenko@gmail.com
 *
 */
var RESTController = function(model, shop, admin)
{
  this.model = model;
  this.shop  = shop;
  this.admin = admin;

  return this;
};

/**
 * @constructor
 */
RESTController.prototype.constructor = RESTController;

/**
 * Index page
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 *
 * @return {ShopAuth}
 */
RESTController.prototype.options = function(req, res, next)
{
  res.json(true);

  return this;
};

/**
 * Load one item
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 *
 * @return {Controller}
 */
RESTController.prototype.count = function(req, res, next)
{
  this.model.count({
    data   : req.query,
    success: function(result)
    {
      return res.json(result);
    },
    error  : function(err, status)
    {
      return res.status(status || 500).send(err);
    }
  });

  return this;
};

/**
 * Load one item
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 *
 * @return {Controller}
 */
RESTController.prototype.load = function(req, res, next)
{
  this.model.load({
    id     : req.params.id,
    data   : req.query,
    cookies: req.cookies,
    success: function(result)
    {
      return res.json(result);
    },
    error  : function(err, status)
    {
      return res.status(status || 500).send(err);
    }
  });

  return this;
};

/**
 * Get list of items
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 *
 * @return {Controller}
 */
RESTController.prototype.list = function(req, res, next)
{
  this.model.list({
    data   : req.query,
    cookies: req.cookies,
    success: function(result)
    {
      return res.json(result);
    },
    error  : function(err, status)
    {
      return res.status(status || 500).send(err);
    }
  });

  return this;
};

/**
 * Create one item
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 *
 * @return {Controller}
 */
RESTController.prototype.create = function(req, res, next)
{
  this.model.create({
    data   : req.body,
    cookies: req.cookies,
    headers: req.headers,
    success: function(result)
    {
      return res.json(result);
    },
    error  : function(err, status)
    {
      return res.status(status || 500).send(err);
    }
  });

  return this;
};

/**
 * Update one item
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 *
 * @return {Controller}
 */
RESTController.prototype.update = function(req, res, next)
{
  this.model.change({
    data      : req.body,
    criteria  : {_id: req.params.id},
    cookies   : req.cookies,
    headers   : req.headers,
    additional: {},
    success   : function(result)
    {
      return res.json(result);
    },
    error     : function(err, status)
    {
      return res.status(status || 500).send(err);
    }
  });

  return this;
};

/**
 * Delete one item
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 *
 * @return {Controller}
 */
RESTController.prototype.destroy = function(req, res, next)
{
  this.model.destroy({
    criteria: {_id: req.params.id},
    headers : req.headers,
    cookies : req.cookies,
    success : function(result)
    {
      return res.json(result);
    },
    error   : function(err, status)
    {
      return res.status(status || 500).send(err);
    }
  });

  return this;
};

module.exports = RESTController;