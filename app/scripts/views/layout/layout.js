/**
 * @class Index page layout
 *
 * @author Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'communicator',
  'views/layout/inc/header',
  'views/layout/inc/footer',
  'hbs!tmpl/layout/layout'
], function(
  Backbone,
  Communicator,
  HeaderView,
  FooterView,
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
    regions: {
      'headerContainer': 'nav',
      'footerContainer' : '#footer'
    },

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
    events: {},

    /**
     * Show occurred
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    onRender: function()
    {
      this.headerContainer.show(new HeaderView());
      // this.footerContainer.show(new FooterView());

      return this;
    }
  });

});