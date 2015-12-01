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
  'hbs!tmpl/layout/recover'
], function(
    Backbone,
    Communicator,
    DAO,
    Auth,
    Tmpl)
{

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
    className: 'container-fluid',

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
      submit: 'button',

      email  : 'input[type=email]',
      code   : 'input[type=password]',
      loader : '.loader'
    },

    /**
     * DOM events on this view
     *
     * @type {Object}
     */
    events: {
      'click @ui.submit': 'submit',

      'keydown input': 'check',
      'submit form':'stopSubmit'
    },

    submit: function  (event)
    {
      var email = $.trim(this.ui.email.val()),
          code  = $.trim(this.ui.code.val());

      this.clear();

      if(!email || !code){
        if(!code){
          this.ui.code.parent().addClass('has-error');
          this.ui.code.focus();
        }

        if(!email){
          this.ui.email.parent().addClass('has-error');
          this.ui.email.focus();
        }

        return this;
      }

      if(!Auth.isEmailValid(email)){
        this.ui.email.parent().addClass('has-error');
        this.ui.email.focus();

        return this;
      }

      this.beforeRequest();

      Auth.recover2(code, email, _.bind(this.error, this));

      return this;
    },

    beforeRequest: function()
    {
      this.ui.submit.addClass('hidden');
      this.ui.loader.removeClass('hidden');

      this.$el.find('input').prop('disabled', true);

      this.$el.find('.helper').addClass('hidden');

      return this;
    },

    afterResponce: function()
    {
      this.clear();

      this.ui.submit.removeClass('hidden');
      this.ui.loader.addClass('hidden');

      this.ui.code.val('');

      this.$el.find('input').prop('disabled', false);

      this.$el.find('.helper').removeClass('hidden');

      return this;
    },

    /**
     * Tab on password elm
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
        this.submit();
      }else{
        last.focus();
      }

      return this;
    },

    /**
     * When server respond for auth with error
     *
     * @chainable
     *
     * @return {Backbone.Marionette.Layout}
     */
    error: function(response)
    {
      this.ui.loader.addClass('hidden');

      if(response.status === 400){
        this.$el.find('.error.auth').removeClass('hidden');
      }else{
        this.$el.find('.error.server').removeClass('hidden');
      }

      _.delay(_.bind(this.afterResponce, this), 2000);

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
     * When show occurred
     *
     * @return {Backbone.Marionette.Layout}
     */
    onShow: function()
    {
      this.$el.find('[data-toggle="tooltip"]').tooltip();
      this.$el.find('[data-toggle="popover"]').popover();

      this.ui.email.focus();

      return this;
    }
  });

});