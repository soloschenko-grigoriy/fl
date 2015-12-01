/**
 * @class     Index page layout
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'dao',
  'communicator',
  'hbs!tmpl/item/messages/chat'
], function(
  Backbone,
  DAO,
  Communicator,
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
    className: 'chat media mn pa', // unread active

    /**
     * List of avaible regions
     *
     * @type {Object}
     */
    regions: {},

    /**
     * UI elements on this view
     *
     * @type {Object}
     */
    ui: {},

    /**
     * DOM events on this view
     *
     * @type {Object}
     */
    events: {
      'click':'activate'
    },

    initialize: function()
    {
      this.$el.prop('href', '/messages/' + this.model.id);

      this.listenTo(this.model, 'change:active', this.activated);

      return this;
    },

    activate: function()
    {
      Communicator.mediator.trigger('ROUTER:navigate', '/messages/' + this.model.id, { trigger: true });

      return this;
    },

    activated: function(model, value)
    {
      if(this.model.get('active')){
        this.$el.addClass('active');
      }else{
        this.$el.removeClass('active');
      }

      return this;
    },

    onRender: function()
    {
      this.activated();

      return this;
    }

  });

});