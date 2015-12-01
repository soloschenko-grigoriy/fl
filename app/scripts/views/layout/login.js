/**
 * @class Login page layout
 *
 * version 0.0.1
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 * @copyright FaceLess Inc (c) 2015 faceless.club
 *
 */
define([
  'backbone',
  'communicator',
  'dao',
  'auth',
  'hbs!tmpl/layout/login'
], function(
  Backbone,
  Communicator,
  DAO,
  Auth,
  Tmpl
){

  'use strict';

  return Backbone.Marionette.LayoutView.extend({

    /**
     * Wrapper template
     *
     * @type {String}
     */
    template: Tmpl,

    /**
     * Class name of view container
     *
     * @type {String}
     */
    className: 'container-fluid login',

    /**
     * List of avaible regions
     *
     * @type {Object}
     */
    regions: {},

    /**
     * List of ui elements
     *
     * @type {Object}
     */
    ui: {
      showSignUp: '.show-signUp',
      showSignIn: '.show-signIn',
      showRecover: '.show-recover',
      signUp: '.sign-up',
      signIn: '.sign-in',
      recover: '.recover',
      signUpButton: '.sign-up button',
      signInButton: '.sign-in button',
      recoverButton: '.recover button',

      signInEmail   : '.sign-in input[type=email]',
      signInPassword: '.sign-in input[type=password]',
      signInLoader  : '.sign-in .loader',

      signUpName    : '.sign-up input[type=text]',
      signUpEmail   : '.sign-up input[type=email]',
      signUpLoader  : '.sign-up .loader',

      recoverEmail  : '.recover input[type=email]',
      recoverLoader : '.recover .loader',

      viaSocial: '.via-social',

      facebook : '.facebook button',
      google   : '.google button'
    },

    /**
     * DOM events on this view
     *
     * @type {Object}
     */
    events: {
      'click @ui.showSignUp': 'showSignUp',
      'click @ui.showSignIn': 'showSignIn',
      'click @ui.showRecover': 'showRecover',

      'click @ui.signUpButton': 'signUp',
      'click @ui.signInButton': 'signIn',
      'click @ui.recoverButton': 'recover',

      'keydown input': 'check',

      'click @ui.facebook': 'facebook',
      'click @ui.google': 'google'
    },

    /**
     * Show sign-up form
     *
     * @param  {Event} event
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    showSignUp: function (event)
    {
      this.ui.signUp.removeClass('hidden');
      this.ui.recover.addClass('hidden');
      this.ui.signIn.addClass('hidden');

      this.ui.signUpName.focus();

      return this;
    },

    /**
     * Show sign-in form
     *
     * @param  {Event} event
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    showSignIn: function (event)
    {
      this.ui.signUp.addClass('hidden');
      this.ui.recover.addClass('hidden');
      this.ui.signIn.removeClass('hidden');

      this.ui.signInEmail.focus();

      return this;
    },

    /**
     * Show recover form
     *
     * @param  {Event} event
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    showRecover: function (event)
    {
      this.ui.signUp.addClass('hidden');
      this.ui.recover.removeClass('hidden');
      this.ui.signIn.addClass('hidden');

      this.ui.recoverEmail.focus();

      return this;
    },

    /**
     * Submit sign-in
     *
     * @param  {Event} event
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    signIn: function  (event)
    {
      var email    = $.trim(this.ui.signInEmail.val()),
          password = $.trim(this.ui.signInPassword.val());

      this.clear();

      if(!email || !password){
        if(!password){
          this.ui.signInPassword.parent().addClass('has-error');
          this.ui.signInPassword.focus();
        }

        if(!email){
          this.ui.signInEmail.parent().addClass('has-error');
          this.ui.signInEmail.focus();
        }

        return this;
      }

      if(!Auth.isEmailValid(email)){
        this.ui.signInEmail.parent().addClass('has-error');
        this.ui.signInEmail.focus();

        return this;
      }

      if(!Auth.isPasswordValid(password)){
        this.ui.signInPassword.parent().addClass('has-error');
        this.ui.signInPassword.focus();

        return this;
      }

      this.beforeRequest();

      Auth.login(email, password, _.bind(this.signInError, this));

      return this;
    },

    /**
     * Submit sign-up
     *
     * @param  {Event} event
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    signUp: function  (event)
    {
      var email = $.trim(this.ui.signUpEmail.val()),
          name  = $.trim(this.ui.signUpName.val());

      this.clear();

      if(!email || !name){
        if(!email){
          this.ui.signUpEmail.parent().addClass('has-error');
          this.ui.signUpEmail.focus();
        }

        if(!name){
          this.ui.signUpName.parent().addClass('has-error');
          this.ui.signUpName.focus();
        }

        return this;
      }

      if(!Auth.isEmailValid(email)){
        this.ui.signUpEmail.parent().addClass('has-error');
        this.ui.signUpEmail.focus();

        return this;
      }

      if(!Auth.isNameValid(name)){
        this.ui.signUpName.parent().addClass('has-error');
        this.ui.signUpName.focus();

        return this;
      }

      this.beforeRequest();

      Auth.registration(name, email, _.bind(this.signUpError, this));

      return this;
    },

    /**
     * Submit facebook sign-in/sign-up
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    facebook: function()
    {
      this.clear();
      this.beforeRequest();

      Auth.fbLogin({
        error:      _.bind(this.showSocialError, this),
        emailError: _.bind(this.showEmailError, this)
      });

      return this;
    },

    /**
     * Submit google sign-in/sign-up
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    google: function()
    {
      this.clear();
      this.beforeRequest();

      Auth.googleLogin({
        error: _.bind(this.showSocialError, this)
      });

      return this;
    },


    /**
     * Submit recover
     *
     * @param  {Event} event
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    recover: function  (event)
    {
      var email = $.trim(this.ui.recoverEmail.val());

      this.clear();

      if(!email){
        this.ui.recoverEmail.parent().addClass('has-error');
        this.ui.recoverEmail.focus();

        return this;
      }

      if(!Auth.isEmailValid(email)){
        this.ui.recoverEmail.parent().addClass('has-error');
        this.ui.recoverEmail.focus();

        return this;
      }

      this.beforeRequest();

      Auth.recover(email, _.bind(this.recoverError, this), function(){
        Communicator.reqres.request('ROUTER:navigate', 'recover', {trigger: true});
      });

      return this;
    },

    /**
     * Clear all errors
     *
     * @param  {Event} event - A fired event
     *
     * @return {Backbone.Marionette.Layout}
     */
    clear: function(event)
    {
      this.$el.find('.has-error').removeClass('has-error');
      this.$el.find('.error').addClass('hidden');

      return this;
    },

    /**
     * Prepare forms before submit
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    beforeRequest: function()
    {
      this.ui.viaSocial.addClass('hidden');

      this.ui.signUpButton.addClass('hidden');
      this.ui.signUpLoader.removeClass('hidden');

      this.ui.signInButton.addClass('hidden');
      this.ui.signInLoader.removeClass('hidden');

      this.ui.recoverButton.addClass('hidden');
      this.ui.recoverLoader.removeClass('hidden');

      this.$el.find('input').prop('disabled', true);

      this.$el.find('.helper').addClass('hidden');

      return this;
    },

    /**
     * Reset forms after submit
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    afterResponce: function()
    {
      this.clear();

      this.ui.signUpButton.removeClass('hidden');
      this.ui.signInButton.removeClass('hidden');
      this.ui.recoverButton.removeClass('hidden');

      this.ui.viaSocial.removeClass('hidden');

      this.ui.signInPassword.val('');

      this.$el.find('input').prop('disabled', false);
      this.$el.find('.helper').removeClass('hidden');

      return this;
    },

    /**
     * Tab or submit
     *
     * @return {Backbone.Marionette.Layout}
     */
    check: function(event)
    {
      this.clear();

      if(event.keyCode !== 13){
        return this;
      }

      var last = $(event.currentTarget).parent().parent().find('input').last();
      if($(event.currentTarget).is(last)){
        var container = $(event.currentTarget).parent().parent().parent().parent().parent();
        if(container.hasClass('sign-up')){
          return this.signUp();
        }

        if(container.hasClass('sign-in')){
          return this.signIn();
        }

        if(container.hasClass('recover')){
          return this.recover();
        }
      }else{
        last.focus();
      }

      return this;
    },

    /**
     * Hide all errors in all forms
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    hideAllLoaders: function ()
    {
      this.ui.signInLoader.addClass('hidden');
      this.ui.signUpLoader.addClass('hidden');
      this.ui.recoverLoader.addClass('hidden');

      this.$el.find('.helper').removeClass('hidden');

      return this;
    },

    /**
     * When server respond for auth with error
     *
     * @chainable
     *
     * @return {Backbone.Marionette.Layout}
     */
    signUpError: function(response)
    {
      this.hideAllLoaders();

      if(response.status === 400){
        this.$el.find('.sign-up .error.auth').removeClass('hidden');
      }else{
        this.$el.find('.sign-up .error.server').removeClass('hidden');
      }

      _.delay(_.bind(this.afterResponce, this), 2000);

      return this;
    },

    /**
     * When server respond for auth with error
     *
     * @chainable
     *
     * @return {Backbone.Marionette.Layout}
     */
    signInError: function(response)
    {
      this.hideAllLoaders();

      if(response.status === 400){
        this.$el.find('.sign-in .error.auth').removeClass('hidden');
      }else{
        this.$el.find('.sign-in .error.server').removeClass('hidden');
      }

      _.delay(_.bind(this.afterResponce, this), 2000);

      return this;
    },

    /**
     * When server respond for auth with error
     *
     * @chainable
     *
     * @return {Backbone.Marionette.Layout}
     */
    recoverError: function(response)
    {
      this.hideAllLoaders();

      if(response.status === 400){
        this.$el.find('.recover .error.auth').removeClass('hidden');
      }else{
        this.$el.find('.recover .error.server').removeClass('hidden');
      }

      _.delay(_.bind(this.afterResponce, this), 2000);

      return this;
    },

    /**
     * When server respond for auth with email error
     *
     * @chainable
     *
     * @return {Backbone.Marionette.Layout}
     */
    showEmailError: function()
    {
      this.hideAllLoaders();

      this.$el.find('.error.fb').removeClass('hidden');

      _.delay(_.bind(this.afterResponce, this), 2000);

      return this;
    },

    /**
     * When server respond for auth with error
     *
     * @chainable
     *
     * @return {Backbone.Marionette.Layout}
     */
    showSocialError: function(response)
    {
      this.hideAllLoaders();

      this.$el.find('.sign-in .error.server').removeClass('hidden');
      this.$el.find('.sign-up .error.server').removeClass('hidden');

      _.delay(_.bind(this.afterResponce, this), 2000);

      return this;
    },

    /* Render occured
     *
     * @return {Backbone.Marionette.Layout}
     */
    onRender: function()
    {
      var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
      po.src = 'https://apis.google.com/js/client:plusone.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);

      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = '//connect.facebook.net/en_US/sdk.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));

      window.fbAsyncInit = function(){
        FB.init({
          appId      : DAO.get('fbAppId'),
          xfbml      : true,
          version    : 'v2.4'
        });
      };

      return this;
    },

    /**
     * When show occurred
     *
     * @return {Backbone.Marionette.Layout}
     */
    onShow: function()
    {
      this.$el.find('[data-toggle="tooltip"]').tooltip();
      this.$el.find('[data-toggle="popover"]').popover();

      this.ui.signInEmail.focus();

      return this;
    }
  });

});