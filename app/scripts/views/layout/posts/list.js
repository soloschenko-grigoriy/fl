/**
 * @class     Posts page layout
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'views/collection/posts/preview',
  'hbs!tmpl/layout/posts/list'
], function(
  Backbone,
  PostsView,
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
    className: 'content',

    /**
     * List of avaible regions
     *
     * @type {Object}
     */
    regions: {
      posts:'.col-md-8'
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

    onRender: function()
    {
      this.posts.show(new PostsView());

      return this;
    }
  });

});