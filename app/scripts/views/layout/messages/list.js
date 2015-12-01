/**
 * @class Index page layout
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'dao',
  'collections/chats',
  'collections/messages',
  'views/composite/messages/chats',
  'views/composite/messages/messages',
  'hbs!tmpl/layout/messages/list'
], function(
  Backbone,
  DAO,
  Chats,
  Messages,
  ChatsView,
  MessagesView,
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
      chats : '.chats-container',
      messages      : '.messages'
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

    initialize: function ()
    {
      new Chats().findBy2User({
        user: DAO.get('user').getActivePerson(),
        success: _.bind(this.loaded, this),
        error:   _.bind(this.error, this)
      });

      return this;
    },

    loaded: function(collection, response, options)
    {
      collection.off('error');

      this.chats.show(new ChatsView({ collection: collection, active: this.options.chatId }));

      if(!this.options.chatId){
        return this;
      }

      new Messages()
        .once('sync',  _.bind(this.mLoaded, this))
        .once('error', _.bind(this.error,   this))
        .fetch({
          data:{
            populate     : ['author'],
            chat : this.options.chatId,
            limit        : 10,
            sort         : '-created'
          }
        });

      return this;
    },

    mLoaded: function(collection, response, options)
    {
      collection.off('error');

      this.messages.show(new MessagesView({ collection: collection, chatId: this.options.chatId }));

      return this;
    },

    error: function(collection, response, options)
    {
      collection.off('sync');

      $.notify({
        title: 'Oops!',
        message: 'Something went wrong... Please, try again later'
      },{
        type: 'danger',
        animate: {
          enter: 'animated fadeInDown',
          exit: 'animated fadeOutUp'
        }
      });


      return this;
    }
  });

});