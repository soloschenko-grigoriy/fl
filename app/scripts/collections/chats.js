/**
 * @class     Chats collection
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define(['backbone', 'models/chat'], function (Backbone, Model){

  'use strict';

  return Backbone.Collection.extend({

    /**
     * Simply override costructor for best debuging
     *
     * @chainable
     *
     * @return {Backbone.Model}
     */
    constructor: function Chats()
    {

      return Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    /**
     * Model object type
     *
     * @type {Backbone.Model}
     */
    model: Model,

    /**
     * Url for sync with server
     *
     * @returns {String}
     */
    url: '/api/chats',

    findOrCreateBy2Users: function(params)
    {
      this
        .once('sync', function(collection, responce, options){
          collection.off('error');

          if(collection.length > 0){
            params.success(collection.first());

            return this;
          }

          new Model()
            .set({ user1: params.user1, user2: params.user2 })
            .once('sync', function(model, responce, options){
              collection.off('error');
              params.success(model);
            })
            .once('error', params.error)
            .save();

        })
        .once('error', params.error)
        .fetch({
          data:{
            or: [{
              user1: params.user1.id,
              user2: params.user2.id
            },{
              user2: params.user1.id,
              user1: params.user2.id
            }]
          }
        });

      return this;
    },

    findBy2User: function(params)
    {
      this
        .once('sync',  params.success)
        .once('error', params.error)
        .fetch({
          data: {
            populate: ['user1', 'user2', 'message'],
            or: [{
              user1: params.user.id
            },{
              user2: params.user.id
            }]
          }
        });

      return this;
    }
  });
});