/**
 * @class     Feature input composite view
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'views/item/comments/item',
  'hbs!tmpl/composite/comments/list'
], function(
  Backbone,
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
    className: 'pb mb',

    /**
     * Child view container in this view
     *
     * @type {Object}
     */
    childViewContainer: '.comments-list',

    /**
     * UI elements of this view
     *
     * @type {Object}
     */
    ui: {},

    /**
     * DOM events in this view
     *
     * @type {Object}
     */
    events:{},

    /**
     * When render occurred
     *
     * @return {Backbone.Marionette.CompositeView}
     */
    onRender: function  ()
    {
      if(this.collection.length === 0){
        this.$el.find('.no-comments').removeClass('hidden');
      }

      return this;
    }
  });
});