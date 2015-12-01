/**
 * @class     Persons collection view
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'dao',
  'communicator',
  'collections/posts',
  'views/item/posts/preview'
], function(
    Backbone,
    DAO,
    Communicator,
    Posts,
    ChildView
){

  'use strict';

  return Backbone.Marionette.CollectionView.extend({

    /**
     * Ref to midel, represented in this composite
     *
     * @type {Backbone.Model}
     */
    childView: ChildView,

    /**
     * Class name of view container
     *
     * @type {String}
     */
    className: '',

    /**
     * UI events on this view
     *
     * @type {Object}
     */
    ui:{
      empty: '.empty'
    },

    /**
     * DOM events on this view
     *
     * @type {Object}
     */
    events: {},

    /**
     * How many to load?
     *
     * @type {Number}
     */
    limit: 15,

    /**
     * Current page
     *
     * @type {Number}
     */
    page: 0,

    /**
     * Filter by author
     *
     * @type {Number}
     */
    author: null,

    collection: new Posts(),

    initialize: function ()
    {
      if(this.options.author){
        this.author = this.options.author.id;
      }

      return this;
    },

    /**
     * Load posts
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    load: function()
    {
      this.collection
        .once('sync',  _.bind(this.sync, this))
        .once('error', _.bind(this.error, this))
        .fetch({
          remove:false,
          data: {
            limit: this.limit,
            sort: '-created',
            populate: ['photo', 'author'],
            page: this.page,
            author: this.author ? this.author : undefined
          }
        });

      return this;
    },

    /**
     * When collection been synced
     *
     * @param  {Backbone.Collection}  collection
     * @param  {Object}               response
     * @param  {Object}               options
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    sync: function (collection, response, options)
    {
      if(collection.length === this.limit){
        this.listenScroll();
      }else{
        this.$el.find('.loader').addClass('hidden');
      }

      if(collection.length === 0){
        this.ui.empty.removeClass('hidden');
      }

      return this;
    },

    /**
     * Error occurred whil sync collection
     *
     * @param  {Backbone.Collection}  collection
     * @param  {Object}               response
     * @param  {Object}               options
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    error: function (collection, response, options)
    {
      collection.off('sync');

      Communicator.mediator.trigger('ROUTER:navigate', 'e500', { trigger: true });

      return this;
    },

    /**
     * Start listen scroll
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    listenScroll: function ()
    {
      $(window).on('scroll', _.bind(this.onScroll, this));

      return this;
    },

    /**
     * Stop listen scroll
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    stopListenScroll: function ()
    {
      $(window).off('scroll');

      return this;
    },

    /**
     * When scroll occurred
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    onScroll: function ()
    {
      if($(window).scrollTop() + 50 > $(document).height() - $(window).height()) {
        this.stopListenScroll();
        this.page++;
        this.load();
      }

      return this;
    },

    /**
     * Before destroy this layout
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    onBeforeDestroy: function ()
    {
      this.stopListenScroll();

      return this;
    },

    /**
     * When render occurred
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    onRender: function ()
    {
      this.load();

      return this;
    }

  });

});