'use strict';

var config = require('../../config'),
    _            = require('underscore'),
    mandrill     = require('mandrill-api/mandrill'),
    mClient      = new mandrill.Mandrill('tNOZS73XxMca27Ka8Z80nQ'),
    crypto       = require('crypto'),
    genPass      = require('password-generator'),
    cookieParser = require('cookie-parser'),
    mongoose     = require('mongoose');

/**
 * @class Default controller
 *
 * @author Soloschenko G. soloschenko@gmail.com
 * @copyright FaceLess Inc (c) 2015 faceless.club
 *
 */
var Controller = function()
{
  this.user         = mongoose.model('user');
  this.personality  = mongoose.model('personality');

  this.mClient = mClient;

  return this;
};

/**
 * @constructor
 */
Controller.prototype.constructor = Controller;

/**
 * Default route
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 *
 * @return {Controller}
 */
Controller.prototype.show = function(req, res, next)
{

  return this.render(req, res, next);
};

/**
 * Render page
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 *
 * @return {Controller}
 */
Controller.prototype.render = function(req, res, next)
{
  mongoose.model('tag').list({
    data:{
      deleted:false,
      limit:100
    },
    success: function(tags){
      res.render('index.hbs', {
        dev         : config.dev,
        fbAppId     : config.fbAppId,
        googleAppId : config.googleAppId,
        tags        : JSON.stringify(tags)
      });
    },
    error: function(err){
      res.status(500).senf(err);
    }
  });


  return this;
};

/**
 * Auth page
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 *
 * @return {AdminAuth}
 */
Controller.prototype.auth = function (req, res, next)
{
  if(!req.body.token){
    res.status(400).json({ 'code': 1001, 'details': ['token'] });

    return this;
  }

  this.user.list({
    data: {
      token: req.body.token,
      populate: ['personalities', 'personalities.followers']
    },
    success: function(result){
      if(result.length < 1){
        res.status(401).json([]);

        return this;
      }

      res.json(_.first(result));
    },
    error: function(err){
      return res.status(500).json(err);
    }
  });

  return this;
};

/**
 * Registration page
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 *
 * @return {Controller}
 */
Controller.prototype.registration = function(req, res, next)
{
  if(!req.body.name){
    res.status(400).json({'code': 1001, 'details': ['name']});

    return this;
  }

  if(!req.body.email){
    res.status(400).json({'code': 1001, 'details': ['email']});

    return this;
  }

  if(!this.user.isEmailValid(req.body.email)){
    res.status(400).json({'code': 1004, 'details': ['email']});

    return this;
  }

  var self = this;
  this.user.list({
    data   : {
      email: req.body.email,
      limit: 1
    },
    success: function(result)
    {
      if(result.length === 0){
        return self.createNewUser(req, res, next);
      }

      res.status(400).json({'code': 1003, 'details': ['email']});
    },
    error  : function(err)
    {
      return res.status(500).json(err);
    }
  });

  return this;
};

/**
 * Create new user during registration
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 *
 * @return {Controller}
 */
Controller.prototype.createNewUser = function(req, res, next)
{
  var self    = this,
      created = Math.floor(new Date().getTime() / 1000),
      shasum  = crypto.createHash('sha1');

  if(!req.body.password){ // if fb or vk
    req.body.password = genPass(_.random(6, 12), false);
  }

  shasum.update(req.body.password);

  self.personality.create({
    data: {
      name    : req.body.name,
      active  : true,
      deleted : false
    },
    success: function(personality){
      self.user.create({
        data   : {
          email         : req.body.email,
          password      : shasum.digest('hex'),
          fbId          : req.body.fbId,
          googleId      : req.body.googleId,
          created       : created,
          updated       : created,
          personalities : [personality.id],
          deleted       : false
        },
        success: function(result){
          return self.sendRegMails(req, res, next, result);
        },
        error: function(err){
          return res.status(500).json(err);
        }
      });
    },
    error: function(err){
      return res.status(500).json(err);
    }
  });



  return this;
};

/**
 * Send neccessary email to user after registration
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 *
 * @return {Controller}
 */
Controller.prototype.sendRegMails = function(req, res, next, user)
{
  var self = this;
  this.mClient.messages.sendTemplate({
    'template_name'   : 'faceless-registration',
    'template_content': [],

    'message': {
      'merge_language'   : 'handlebars',
      'to'               : [{
        'email': user.email,
        'name' : user.name,
        'type' : 'to'
      }],
      'global_merge_vars': [
        {
          'name'   : 'name',
          'content': user.name
        },
        {
          'name'   : 'email',
          'content': user.email
        },
        {
          'name'   : 'password',
          'content': req.body.password
        }
      ]
    },
    'async'  : true,
    'ip_pool': 'Main Pool'
  }, function(result)
  {
    self.updateToken(req, res, next, user);
  }, function(err)
  {
    res.status(500).json(err);
  });

  return this;
};

/**
 * Controller page
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 *
 * @return {Controller}
 */
Controller.prototype.authDefault = function(req, res, next)
{
  var self = this;
  if(!req.body.email){
    res.status(400).json({'code': 1001, 'details': ['email']});

    return this;
  }

  if(!req.body.password){
    res.status(400).json({'code': 1001, 'details': ['password']});

    return this;
  }

  if(req.body.email && !this.user.isEmailValid(req.body.email)){
    res.status(400).json({'code': 1004, 'details': ['email']});

    return this;
  }

  var shasum   = crypto.createHash('sha1').update(req.body.password),
      password = shasum.digest('hex');

  // find user by provided email and password
  this.user.list({
    data   : {
      email    : req.body.email,
      password : password
    },
    success: function(result)
    {
      result = _.first(result);

      if(!result || !result.id){
        res.status(400).json({'code': 1002, 'details': ['email', 'password']});

        return self;
      }

      self.updateToken(req, res, next, result);
    },
    error: function(err)
    {
      return res.status(500).json(err);
    }
  });

  return this;
};

/**
 * Update user's token in DB and in cookie
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 * @param  {Model}            user
 *
 * @return {Controller}
 */
Controller.prototype.updateToken = function(req, res, next, user)
{
  var self   = this,
      now    = Math.floor(new Date().getTime() / 1000),
      token  = user.email + now + user.name + user.fbId + user.vkId,
      shasum = crypto.createHash('sha1');

  shasum.update(token);
  token = shasum.digest('hex');

  this.user.findOneAndUpdate({_id: user.id}, { lastLogin: now, token: token }, function(err, result){
    if(err){
      return res.status(500).json(err);
    }

    res.cookie('token', token, {
      expires: new Date(Date.now() + 30 * 24 * 3600000),
      path: '/'
    });

    res.json(user);
  });

  return this;
};

/**
 * Controller user by FB id and token
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 *
 * @return {Controller}
 */
Controller.prototype.authByFB = function(req, res, next)
{
  if(!req.body.fbId){
    res.status(400).json({'code': 1001, 'details': ['fbId']});

    return this;
  }

  if(!req.body.email){
    res.status(400).json({'code': 1001, 'details': ['email']});

    return this;
  }

  var self = this;

  this.user.list({
    data   : {
      fbId:  req.body.fbId
    },
    success: function(result)
    {
      result = _.first(result);

      if(!result || !result.id){
        self.createNewUser(req, res, next);
      }else{
        self.updateToken(req, res, next, result);
      }
    },
    error  : function(err)
    {
      return res.status(500).json(err);
    }
  });

  return this;
};


/**
 * Aut by VK
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 *
 * @return {Controller}
 */
Controller.prototype.authByGoogle = function(req, res, next)
{
  if(!req.body.googleId){
    res.status(400).json({'code': 1001, 'details': ['googleId']});

    return this;
  }

  if(!req.body.email){
    res.status(400).json({'code': 1001, 'details': ['email']});

    return this;
  }

  var self = this;

  this.user.list({
    data   : {
      googleId : req.body.googleId
    },
    success: function(result){
      result = _.first(result);

      if(!result || !result.id){
        self.createNewUser(req, res, next);
      }else{
        self.updateToken(req, res, next, result);
      }
    },
    error: function(err){
      return res.status(500).json(err);
    }
  });

  return this;
};

/**
 * Recover user's pass
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 *
 * @return {Controller}
 */
Controller.prototype.recover = function(req, res, next)
{
  if(!req.body.email){
    res.status(400).json({'code': 1001, 'details': ['email']});

    return this;
  }

  if(!this.user.isEmailValid(req.body.email)){
    res.status(400).json({'code': 1004, 'details': ['email']});

    return this;
  }

  var self = this;
  this.user.list({
    data   : {
      email: req.body.email
    },
    success: function(user){
      self.changeUsersRecoverCode(req, res, next, _.first(user));
    },
    error  : function(err){
      return res.status(500).json(err);
    }
  });

  return this;
};

/**
 * When recovery user founded - update his recoverCode
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 * @param  {Model}            user
 *
 * @return {Controller}
 */
Controller.prototype.changeUsersRecoverCode = function(req, res, next, user)
{
  if(!user || !user.id){
    res.status(400).json({'code': 1002, 'details': ['email']});

    return this;
  }

  var now    = Math.floor(new Date().getTime() / 1000),
      shasum = crypto.createHash('sha1'),
      self   = this;

  shasum.update(user.name + now + user.email + user.phone);

  var code = shasum.digest('hex');

  this.user.findOneAndUpdate({_id: user.id}, { recoverCode: code }, function(err, result){
    if(err){
      return res.status(500).json(err);
    }

    self.sendRecoverEmail(req, res, next, user, code);
  });

  return this;
};

/**
 * After reciver code been changed - inform user about it
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 * @param  {Model}            user
 *
 * @return {Controller}
 */
Controller.prototype.sendRecoverEmail = function(req, res, next, user, code)
{
  this.mClient.messages.sendTemplate({
    'template_name'   : 'faceless-recover',
    'template_content': [],
    'message'         : {
      'merge_language'   : 'handlebars',
      'to'               : [
        {
          'email': user.email,
          'name' : user.name,
          'type' : 'to'
        }
      ],
      'global_merge_vars': [
        {
          'name'   : 'code',
          'content': code
        },{
          'name'   : 'name',
          'content': user.name
        },{
          'name'   : 'email',
          'content': user.email
        },{
          'name'   : 'page',
          'content': req.protocol + '://' + req.headers.host + '/recover'
        }
      ]
    },
    'async'           : true,
    'ip_pool'         : 'Main Pool'
  }, function(result)
  {
    return res.json(true);
  }, function(err)
  {
    res.status(500).json(err);
  });

  return this;
};

/**
 * When user has a code and tries to change passsword
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 *
 * @return {Controller}
 */
Controller.prototype.recover2 = function(req, res, next)
{
  if(!req.body.email){
    res.status(400).json({'code': 1001, 'details': ['email']});

    return this;
  }

  if(!req.body.code){
    res.status(400).json({'code': 1001, 'details': ['code']});

    return this;
  }

  if(!req.body.password){
    res.status(400).json({'code': 1001, 'details': ['password']});

    return this;
  }

  if(!this.user.isEmailValid(req.body.email)){
    res.status(400).json({'code': 1004, 'details': ['email']});

    return this;
  }

  var self = this;
  this.user.list({
    data   : {
      email      : req.body.email,
      recoverCode: req.body.code
    },
    success: function(result)
    {
      self.changeUserPasswordByRecover(req, res, next, _.first(result));
    },
    error  : function(err)
    {
      return res.status(500).json(err);
    }
  });

  return this;
};

/**
 * Change password while recovering
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 * @param  {Model}            user
 *
 * @return {Controller}
 */
Controller.prototype.changeUserPasswordByRecover = function(req, res, next, user)
{
  if(!user || !user.id){
    res.status(400).json({'code': 1002, 'details': ['email', 'code']});

    return this;
  }

  if(!req.body.password){
    res.status(400).json({'code': 1001, 'details': ['password']});

    return this;
  }

  var self   = this,
      shasum = crypto.createHash('sha1');

  shasum.update(req.body.password);

  this.user.findOneAndUpdate({_id: user.id}, { password: shasum.digest('hex'), recoverCode: null }, function(err, result){
    if(err){
      return res.status(500).json(err);
    }

    self.sendRecover2Email(req, res, next, user, req.body.password);
  });

  return this;
};

/**
 * After reciver code been changed - inform user about it
 *
 * @param  {Express.Request}  req
 * @param  {Express.Responce} res
 * @param  {Function}         next
 * @param  {Model}            user
 *
 * @return {Controller}
 */
Controller.prototype.sendRecover2Email = function(req, res, next, user, password)
{
  var self = this;
  this.mClient.messages.sendTemplate({
    'template_name'   : 'faceless-recover2',
    'template_content': [],
    'message'         : {
      'merge_language'   : 'handlebars',
      'to'               : [
        {
          'email': user.email,
          'name' : user.name,
          'type' : 'to'
        }
      ],
      'global_merge_vars': [
        {
          'name'   : 'email',
          'content': user.email
        },
        {
          'name'   : 'name',
          'content': user.name
        },
        {
          'name'   : 'password',
          'content': password
        }
      ]
    },
    'async'           : true,
    'ip_pool'         : 'Main Pool'
  }, function(result)
  {
    self.updateToken(req, res, next, user);
  }, function(err)
  {
    res.status(500).json(err);
  });

  return this;
};


module.exports = Controller;