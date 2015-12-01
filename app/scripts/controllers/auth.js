/**
 * @class Auth - managin authentification
*
 * @author    Soloschenko G. soloschenko@gmail.com
 * @copyright FaceLess Inc (c) 2015 faceless.club
 *
 */
define([
  'backbone',
  'communicator',
  'dao',
  'cookie',
  'collections/users',
  'models/user',
  'generatePassword'

], function(
  Backbone,
  Communicator,
  DAO,
  Cookie,
  Users,
  User,
  generatePassword
){

  'use strict';

  var Auth = Backbone.Marionette.Controller.extend({

    /**
     * Check if the user is authentificated
     *
     * @return {Boolean}
     */
    is: function()
    {
      if(Cookie.get('token') && DAO.get('user')){
        return true;
      }

      return false;
    },


    /**
     * Check if current user is authentificated now
     *
     * @return {Backbone.Marionette.Controller}
     */
    authentificate: function(error, success)
    {
      var self = this;
      $.ajax({
        method:   'post',
        url:      '/api/auth',
        data: {
          token: Cookie.get('token')
        },
        success:  function(responce){
          DAO.set('user',  User.findOrCreate(responce));

          if(success){
            success();
          }
        },
        error: function(){
          if(error){
            error();
          }
        }
      });

      return this;
    },

    /**
     * Check if provided string is valid email
     *
     * @param  {String}  email
     *
     * @return {Boolean}
     */
    isEmailValid: function(email)
    {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      return re.test(email);
    },

    /**
     * Check if provided string is valid password
     *
     * @param  {String}  password
     *
     * @return {Boolean}
     */
    isPasswordValid: function(password)
    {
      password = $.trim(password);
      if(!password || password.length < 4){
        return false;
      }

      return true;
    },

    /**
     * Check if provided string is valid phone
     *
     * @param  {String}  phone
     *
     * @return {Boolean}
     */
    isNameValid: function(name)
    {
      var re = /^[a-zA-Z0-9а-яА-Я.'\-_\s]{1,30}$/;

      return name.match(re);
    },


    /**
     * Login user
     *
     * @return {Backbone.Marionette.Controller}
     */
    login: function(email, password, error)
    {
      var self = this;
      $.ajax({
        method: 'post',
        url: '/api/login',
        data: {
          email     : email,
          password  : password
        },
        success: function(response){
          window.location.href = '/';
        },
        error  : function(response){
          if(error){
            error(response);
          }
        }
      });

      return this;
    },

    /**
     * Register user
     *
     * @param  {String} name
     * @param  {String} email
     * @param  {Number} phone
     * @param  {Function} error
     *
     * @return {Backbone.Marionette.Controller}
     */
    registration: function(name, email, error, success)
    {
      $.ajax({
        url: '/api/registration',
        method: 'post',
        data:{
          name        : name,
          email       : email,
          password    : generatePassword(_.random(6,12), false)
        },
        success: function  (){
          if(success){
            return success();
          }

          window.location.href = '/';
        },
        error: error
      });

      return this;
    },

    /**
     * Recover password
     *
     * @param  {String}   email
     * @param  {Function} error
     *
     * @return {Backbone.Marionette.Controller}
     */
    recover: function(email, error, success)
    {
      $.ajax({
        url        : '/api/recover',
        method     : 'post',
        dataType   : 'json',
        data       : { email: email },
        success    : success,
        error      : error
      });

      return this;
    },

    /**
     * Recover password step 2
     *
     * @param  {String}   email
     * @param  {Function} error
     *
     * @return {Backbone.Marionette.Controller}
     */
    recover2: function(code, email, error)
    {
      $.ajax({
        url        : '/api/recover2',
        method     : 'post',
        dataType   : 'json',
        data       : {
          code     : code,
          email    : email,
          password : generatePassword(_.random(6,12), false)
        },
        success    : function(){
          window.location.reload();
        },
        error      : error
      });

      return this;
    },

    /**
     * Connect to FB
     *
     * @param  {Object} options
     *
     * @return {Backbone.Marionette.Controller}
     */
    fbConnect: function(options)
    {
      FB.login(function(response) {
        if(response.status === 'connected'){ // connected to FB
          FB.api('/me', {fields: 'email, first_name, id'}, function(response){ // get basic info
            if(!response.email){ // if no email - ask for it
              FB.api('/me/permissions', 'delete', function(response) {
                options.emailError();
              });
            }else{ // if ok - continue
              options.success(response);
            }
          });
        }else if(response.status === 'not_authorized'){ // The person is logged into Facebook, but not your app.
          options.error(response);
        }else{ // The person is not logged into Facebook
          options.error(response);
        }
      }, {scope: 'public_profile,email', return_scopes: true});

      return this;
    },

    /**
     * Auth through FB
     *
     * @param  {Object} options
     *
     * @return {Backbone.Marionette.Controller}
     */
    fbLogin: function(options)
    {
      this.fbConnect({
        success: function (response){
          $.ajax({
            url: '/api/login/fb',
            method: 'post',
            data:{
              name  : response.first_name,
              fbId  : response.id,
              email : response.email
            },
            success:    function(){
              window.location.reload();
            },
            error: options.error
          });
        },
        error:      options.error,
        emailError: options.emailError
      });

      return this;
    },

    /**
     * Connect to google
     *
     * @param  {Object} options
     *
     * @return {Backbone.Marionette.Controller}
     */
    googleConnect: function (options)
    {
      var clientId   = DAO.get('googleAppId'),
          scope      = 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
          immediate  = false;

      gapi.auth.authorize({ 'client_id': clientId, scope: scope, immediate: immediate }, function(authResult){
        if(authResult.access_token){
          gapi.auth.setToken(authResult);
          gapi.client.load('oauth2', 'v2', function() {
            gapi.client.oauth2.userinfo.get().execute(function(obj){
              options.success(obj);
            });
          });
        }else{
          options.error(authResult);
        }
      });

      return this;
    },

    /**
     * Auth through google
     *
     * @param  {Object} options
     *
     * @return {Backbone.Marionette.Controller}
     */
    googleLogin: function (options)
    {
      this.googleConnect({
        success: function (response){
          $.ajax({
            url: '/api/login/google',
            method: 'post',
            data:{
              name    : response.name,
              googleId: response.id,
              email   : response.email
            },
            success: function(){
              window.location.reload();
            },
            error:   options.error
          });
        },
        error: options.error
      });

      return this;
    },

    /**
     * Logout user
     *
     * @return {Backbone.Marionette.Controller}
     */
    logout: function(error)
    {
      DAO.remove('user');
      Cookie.remove('token');

      window.location.reload();

      return this;
    }

  });

  return new Auth();
});