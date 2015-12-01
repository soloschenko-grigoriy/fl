/**
 * @class Index page layout
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'dao',
  'hbs!tmpl/item/users/tabs'
], function(
    Backbone,
    DAO,
    Tmpl)
{

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
    className: 'nav nav-tabs',

    /**
     * Tag name of view container
     *
     * @type {String}
     */
    tagName: 'ul',

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
    events: {}

  });

});