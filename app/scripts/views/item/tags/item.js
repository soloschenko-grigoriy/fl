/**
 * @class     Index page layout
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'dao',
  'hbs!tmpl/item/tags/item'
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
    className: '',

    /**
     * Tag name of view container
     *
     * @type {String}
     */
    tagName: 'a',

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

    /**
     * General preparations
     *
     * @return {Backbone.Marionette.ItemView}
     */
    initialize: function ()
    {
      this.$el.prop('href', 'javascript:;');

      return this;
    }
  });

});