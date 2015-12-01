/**
 * @class Index page layout
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'hbs!tmpl/layout/errors/e404'
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
    className: '',

    /**
     * List of avaible regions
     *
     * @type {Object}
     */
    regions: {},

    /**
     * DOM events on this view
     *
     * @type {Object}
     */
    events: {}
  });

});