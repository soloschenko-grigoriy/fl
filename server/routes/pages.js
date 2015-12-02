'use strict';

var Controller = require('../controllers/controller'),
    controller = new Controller();

module.exports = function(app){

  /*=============================================
  =                 PAGE ROUTES                 =
  =============================================*/
  app.get('/',  function(req, res, next){
    controller.render(req, res, next);
  });

  app.get('/login',  function(req, res, next){
    controller.render(req, res, next);
  });

  app.get('/posts',  function(req, res, next){
    controller.render(req, res, next);
  });

  app.get('/posts/add',  function(req, res, next){
    controller.render(req, res, next);
  });

  app.get('/posts/:id',  function(req, res, next){
    controller.render(req, res, next);
  });

  app.get('/messages',  function(req, res, next){
    controller.render(req, res, next);
  });

  app.get('/messages/:id',  function(req, res, next){
    controller.render(req, res, next);
  });

  app.get('/profile',  function(req, res, next){
    controller.render(req, res, next);
  });

  app.get('/profile/:id',  function(req, res, next){
    controller.render(req, res, next);
  });

  app.get('/profile/:id/:subpage',  function(req, res, next){
    controller.render(req, res, next);
  });

  app.get('/community',  function(req, res, next){
    controller.render(req, res, next);
  });

  app.get('/settings',  function(req, res, next){
    controller.render(req, res, next);
  });

  app.get('/recover',  function(req, res, next){
    controller.render(req, res, next);
  });

  app.get('/logout',  function(req, res, next){
    controller.render(req, res, next);
  });

  app.get('/e404',  function(req, res, next){
    controller.render(req, res, next);
  });

  app.get('/e500',  function(req, res, next){
    controller.render(req, res, next);
  });



  /*=============================================
  =                 API ROUTES                  =
  =============================================*/
  app.post('/api/auth',  function(req, res, next){
    controller.auth(req, res, next);
  });

  app.post('/api/registration',  function(req, res, next){
    controller.registration(req, res, next);
  });

  app.post('/api/login',  function(req, res, next){
    controller.authDefault(req, res, next);
  });

  app.post('/api/recover',  function(req, res, next){
    controller.recover(req, res, next);
  });

  app.post('/api/recover2',  function(req, res, next){
    controller.recover2(req, res, next);
  });

  app.post('/api/login/fb',  function(req, res, next){
    controller.authByFB(req, res, next);
  });

  app.post('/api/login/google',  function(req, res, next){
    controller.authByGoogle(req, res, next);
  });
};