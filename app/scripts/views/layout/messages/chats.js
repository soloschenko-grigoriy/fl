/**
 * @class Index page layout
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'dao',
  'communicator',
  'collections/chats',
  'views/composite/messages/chats',
  'hbs!tmpl/layout/messages/chats'
], function(
  Backbone,
  DAO,
  Communicator,
  Chats,
  ChatsView,
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
      chats: '.chats-container'
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
      var model = collection.first();
      if(model){
        return Communicator.mediator.trigger('ROUTER:navigate', 'messages/'+model.id, { trigger: true });
      }

      this.chats.show(new ChatsView({ collection: collection }));

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