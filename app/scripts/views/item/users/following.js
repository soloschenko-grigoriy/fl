/**
 * @class Index page layout
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'dao',
  'models/person',
  'hbs!tmpl/item/users/following'
], function(
  Backbone,
  DAO,
  Person,
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
    className: 'col-md-4 mt person-small',

    /**
     * UI elements on this view
     *
     * @type {Object}
     */
    ui: {
      unfollow : '.unfollow',
      loader   : '.loader'
    },

    /**
     * DOM events on this view
     *
     * @type {Object}
     */
    events: {
      'click .unfollow': 'unfollow'
    },

    /**
     * Unfollow this user
     *
     * @return {Backbone.Marionette.ItemView}
     */
    unfollow: function (event)
    {
      this.ui.loader.removeClass('hidden');
      this.ui.unfollow.addClass('hidden');

      DAO.get('user').getActivePerson().unfollow({
        user    : this.model,
        error   : _.bind(this.error, this)
      });

      return this;
    },

    /**
     * Error occurred
     *
     * @return {Backbone.Marionette.ItemView}
     */
    error: function (model, responce, options)
    {
      this.ui.loader.addClass('hidden');
      this.ui.unfollow.removeClass('hidden');

      $.notify({
        title: 'Oops!',
        message: 'Something went wrong... Please, try again later'
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