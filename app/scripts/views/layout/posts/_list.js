/**
 * @class     Posts page layout
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'communicator',
  'moment',
  'collections/posts',
  'hbs!tmpl/layout/posts/_list'
], function(
  Backbone,
  Communicator,
  moment,
  Posts,
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
    className: 'row mn',

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
      new Posts()
        .once('sync',  _.bind(this.sync, this))
        .once('error', _.bind(this.error, this))
        .fetch({
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
    //   collection.each(function(one){
    //     var timeline = moment.unix(one.get('created')).calendar(null, {
    //       sameDay: '[Today]',
    //       nextDay: '[Tomorrow]',
    //       nextWeek: 'dddd',
    //       lastDay: '[Yesterday]',
    //       lastWeek: '[Last] dddd'
    //     });

    //     one.set({ timeline: timeline });
    //   });

    //   var group = collection.groupBy(function(one){
    //     return one.get('timeline');
    //   });

    //   _.each(group, function(one, key){
    //     var view = new TimelineView({ collection: new Groups(one), header: key });
    //     this.$el.find('.timeline').append(view.render().el);
    //   }, this);

    //   if(collection.length === this.limit){
    //     this.listenScroll();
    //   }else{
    //     this.$el.find('.loader').addClass('hidden');
    //   }

    //   if(collection.length === 0){
    //     this.ui.empty.removeClass('hidden');
    //   }

    //   return this;
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