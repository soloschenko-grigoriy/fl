/**
 * @class     Chats composite view
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'dao',
  'socketio',
  'models/message',
  'views/item/messages/message',
  'hbs!tmpl/composite/messages/messages'
], function(
  Backbone,
  DAO,
  IO,
  Model,
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
    className: '',

    /**
     * Child view container in this view
     *
     * @type {Object}
     */
    childViewContainer: 'ul.media-block',

    /**
     * UI elements of this view
     *
     * @type {Object}
     */
    ui: {
      msg: 'input[type=text]'
    },

    /**
     * DOM events in this view
     *
     * @type {Object}
     */
    events:{
      'click .btn-primary' : 'send',
      'keydown @ui.msg'    : 'check'
    },

    loading: false,

    page: 0,

    initialize: function ()
    {
      DAO.get('soket').emit('subscribe', this.options.chatId);

      DAO.get('soket').on('message', _.bind(this.created, this));

      return this;
    },

    check: function (event)
    {
      if(event.keyCode !== 13){
        return this;
      }

      return this.send();
    },

    send: function ()
    {
      var input   = this.$el.find('input'),
          message = {
            description : $.trim(input.val()),
            created     : Math.floor(new Date().getTime() / 1000),
            author      : DAO.get('user').getActivePerson().id
          };

      DAO.get('soket').emit('message', {
        room    : this.options.chatId,
        message : message
      });

      input.val('');

      return this.created(message);
    },

    created: function(message)
    {
      this.collection.add(Model.findOrCreate(message));

      this.$el.find('.nano').nanoScroller();
      this.$el.find('.nano').nanoScroller({ scroll: 'bottom' });


      return this;
    },

    changeHeight: function()
    {
      var height = $(document).height() - 52;
      this.$el.css({ height: height });
      this.$el.find('.nano').css({ height: height - 55 });

      this.$el.find('.nano').nanoScroller();

      return this;
    },

    onScrollTop: function()
    {
      this.$el.find('.nano').off('scrolltop');

      this.page++;

      this.lastLoaded = this.collection.first().id;

      this.collection
        .once('sync', _.bind(this.loaded, this))
        .fetch({
          remove: false,
          data: {
            page           : this.page,
            populate       : ['author'],
            chat   : this.options.chatId,
            sort           : '-created',
            limit          : 10,
          }
        });
    },

    loaded: function(collection, response, options)
    {
      if(response.length === 0){
        return this;
      }

      this.$el.find('.nano').nanoScroller();

      var self = this;
      this.$el.find('.message').each(function(){
        if($(this).data('id') === self.lastLoaded){
          self.$el.find('.nano').nanoScroller({ scrollTo: $(this) });
        }
      });

      this.$el.find('.nano').on('scrolltop', _.bind(this.onScrollTop, this));

      return this;
    },

    onBeforeDestroy: function()
    {
      $(window).off('resize', this.resizeHandler);

      this.$el.find('.nano').off('scrolltop');

      return this;
    },

    onShow: function()
    {
      this.resizeHandler = _.bind(this.changeHeight, this);

      $(window).on('resize', this.resizeHandler);

      this.resizeHandler();

      this.$el.find('.nano').nanoScroller({ scroll: 'bottom' });

      this.$el.find('.nano').on('scrolltop', _.bind(this.onScrollTop, this));
    }

  });
});