/**
 * @class Index page layout
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'auth',
  'dao',
  'hbs!tmpl/item/settings/security'
], function(
  Backbone,
  Auth,
  DAO,
  Tmpl
){

  'use strict';

  return Backbone.Marionette.ItemView.extend({

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
    className: '',

    /**
     * UI elements on this view
     *
     * @type {Object}
     */
    ui: {
      email       : '.user-email input',
      password    : '.user-password input',
      confirm     : '.user-confirm input',

      submit: '.btn-primary',
      loader: '.loader'
    },

    /**
     * DOM events on this view
     *
     * @type {Object}
     */
    events: {
      'click @ui.submit':'submit',
      'keydown input'   : 'clear'
    },

    /**
     * Submit form
     *
     * @param  {Event} event
     *
     * @return {Backbone.Marionette.ItemView}
     */
    submit: function(event)
    {
      var email      = $.trim(this.ui.email.val()),
          password   = $.trim(this.ui.password.val()),
          confirm    = $.trim(this.ui.confirm.val());

      if(!email || !Auth.isEmailValid(email)){
        this.ui.email.parent().addClass('has-error');
        this.ui.email.focus();

        return this;
      }

      if(!password || !Auth.isPasswordValid(password)){
        this.ui.password.parent().addClass('has-error');
        this.ui.password.focus();

        return this;
      }

      if(!confirm || !Auth.isPasswordValid(confirm)){
        this.ui.confirm.parent().addClass('has-error');
        this.ui.confirm.focus();

        return this;
      }

      if(confirm !== password){
        this.ui.confirm.parent().addClass('has-error');
        this.ui.confirm.focus();

        return this;
      }

      var data = {
        email    : email,
        password : password,
        confirm  : confirm
      };

      this.ui.loader.removeClass('hidden');
      this.ui.submit.addClass('hidden');

      DAO.get('user')
        .set(data)
        .once('sync',  _.bind(this.sync,  this))
        .once('error', _.bind(this.error, this))
        .save(data, { patch: true });

      return this;
    },

    clear: function (event)
    {
      this.$el.find('.has-error').removeClass('has-error');

      return this;
    },

    /**
     * When model been synced
     *
     * @param  {Bacbone.Model} model
     * @param  {Object}        response
     * @param  {Object}        options
     *
     * @return {Backbone.Marionette.ItemView}
     */
    sync: function (model, response, options)
    {
      model.off('error');

      this.ui.loader.addClass('hidden');
      this.ui.submit.removeClass('hidden');

      $.notify({
        title: 'Done!',
        message: 'All data successfully been saved'
      },{
        type: 'success',
        animate: {
          enter: 'animated fadeInDown',
          exit: 'animated fadeOutUp'
        }
      });

      return this;
    },

    /**
     * Error occurred while saving model
     *
     * @param  {Bacbone.Model} model
     * @param  {Object}        response
     * @param  {Object}        options
     *
     * @return {Backbone.Marionette.ItemView}
     */
    error: function (model, response, options)
    {
      model.off('sync');

      this.ui.loader.addClass('hidden');
      this.ui.submit.removeClass('hidden');

      var text = 'Something went wrong... Please, try again later';
      if(response.status === 401){
        text = 'You are not allowed to do that';
      }

      var responseText = $.parseJSON(response.responseText);

      if(responseText.code === 1003){
        text = 'This email is allready used by another user';
      }

      $.notify({
        title: 'Oops!',
        message: text
      },{
        type: 'danger',
        animate: {
          enter: 'animated fadeInDown',
          exit: 'animated fadeOutUp'
        }
      });

      return this;
    }
  });

});