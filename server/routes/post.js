'use strict';

var modelName  = 'post',
    mongoose   = require('mongoose'),
    Controller = require('../controllers/RESTController'),
    controller = new Controller(mongoose.model(modelName)),
    root       = '/api/' + modelName.toLowerCase() + 's';

module.exports = function(app){

  app.options(root,  function(req, res, next){
    controller.options(req, res, next);
  });

  app.options(root + '/:id',  function(req, res, next){
    controller.options(req, res, next);
  });

  app.get(root,  function(req, res, next){
    controller.list(req, res, next);
  });

  app.get(root + '/:id',  function(req, res, next){
    controller.load(req, res, next);
  });

  app.post(root,  function(req, res, next){
    controller.create(req, res, next);
  });

  // app.put(root + '/:id',  function(req, res, next){
  //   controller.update(req, res, next);
  // });

  // app.patch(root + '/:id',  function(req, res, next){
  //   controller.update(req, res, next);
  // });

};