/**
 * @class     Index page layout
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'dao',
  'hbs!tmpl/item/messages/message'
], function(
  Backbone,
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
    className: 'pa message', // unread active

    /**
     * Tag name of view container
     *
     * @type {String}
     */
    tagName: 'li',

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
    events: {},

    initialize: function()
    {
      if(DAO.get('user').isSamePerson(this.model.get('author'))){
        this.model.set('isMine', true);
      }else{
        this.listenTo(this.model, 'change:readed', this.readed);
        this.readed();
      }

      return this;
    },

    readed: function(mode, value)
    {
      if(this.model.get('readed')){
        this.$el.removeClass('unread');
      }else{
        this.$el.addClass('unread');
      }

      return this;
    },

    setReaded: function()
    {
      if(this.model.get('readed')){
        return this;
      }

      this.model
        .set({ readed: true })
        .save({ readed: true }, { patch: true });

      return this;
    },

    onShow: function()
    {
      this.$el.data('id', this.model.id);

      _.delay(_.bind(this.setReaded, this), 2000);

      return this;
    }
  });

});