/**
 * @class     Chats composite view
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'dao',
  'models/chat',
  'views/item/messages/chat',
  'hbs!tmpl/composite/messages/chats'
], function(
  Backbone,
  DAO,
  Model,
  ChildView,
  Tmpl
){

  'use strict';

  return Backbone.Marionette.CompositeView.extend({

    /**
     * Ref to midel, represented in this composite
     *
     * @type {Backbone.Model}
     */
    childView: ChildView,

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
    className: 'chats',

    /**
     * Child view container in this view
     *
     * @type {Object}
     */
    childViewContainer: '.chats-list',

    /**
     * UI elements of this view
     *
     * @type {Object}
     */
    ui: {
      add: '.add'
    },

    /**
     * DOM events in this view
     *
     * @type {Object}
     */
    events:{
      'click @ui.add':'add'
    },

    initialize: function()
    {
      this.collection.invoke('set', { active: false });

      var active = this.collection.get(this.options.active);
      if(active){
        active.set('active', true);
      }
    },

    add: function(event)
    {
      // new Model({
      //   user1: DAO.get('user').getActivePerson().id
      // });

      return this;
    }
  });
});