/**
 * @class Index page layout
 *
 * @author Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'hbs!tmpl/layout/layout'
], function(
  Backbone,
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
    className: 'container-fluid mn pn',

    /**
     * List of avaible regions
     *
     * @type {Object}
     */
    regions: {},

    /**
     * UI events on this view
     *
     * @type {Object}
     */
    ui:{},

    /**
     * DOM events on this view
     *
     * @type {Object}
     */
    events: {}
  });

});