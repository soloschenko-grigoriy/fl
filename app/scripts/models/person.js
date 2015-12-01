/**
 * @class     Person model
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'dao',
  'collections/persons'
], function(
  Backbone,
  DAO,
  Persons
){

  'use strict';

  return Backbone.RelationalModel.extend({

    /**
    * Simply override costructor for best debuging
    *
    * @chainable
    *
    * @return {Backbone.RelationalModel}
    */
    constructor: function Person()
    {

      return Backbone.RelationalModel.prototype.constructor.apply(this, arguments);
    },

    /**
     * Url for sync with server
     *
     * @type {String}
     */
    urlRoot: '/api/users/persons',

    /**
     * Relations for the model
     *
     * @type {Array}
     */
    relations: [{
      type              : Backbone.HasMany,
      key               : 'followers',
      collectionType    : Persons
    },{
      type              : Backbone.HasMany,
      key               : 'followings',
      collectionType    : Persons
    }],

    /**
     * Follow provided user
     *
     * @param  {Object} params
     *
     * @return {Backbone.RelationalModel}
     */
    follow: function (params)
    {
      if(!params.user){
        console.error('user is not provided');
        return this;
      }

      this.get('followings').add(params.user);
      this
        .once('sync',  function(model, response, options){
          if(params.success){
            params.user.once('sync',  params.success);
          }

          if(params.error){
            params.user.once('error', params.error);
          }

          params.user.get('followers').add(this);
          params.user.save({ followers: params.user.get('followers')}, { patch: true });
        }, this)
        .once('error', params.error)
        .save({ followings: this.get('followings')}, { patch: true });

        return this;
    },

    /**
     * Follow provided user
     *
     * @param  {Object} params
     *
     * @return {Backbone.RelationalModel}
     */
    unfollow: function (params)
    {
      if(!params.user){
        console.error('user is not provided');
        return this;
      }

      this.get('followings').remove(params.user);

      this
        .once('sync',  function(model, response, options){
          if(params.success){
            params.user.once('sync', params.success);
          }

          if(params.error){
            params.user.once('error', params.error);
          }

          params.user.get('followers').remove(this);
          params.user.save({ followers: params.user.get('followers')}, { patch: true });
        }, this)
        .once('error', params.error)
        .save({ followings: this.get('followings')}, { patch: true });

        return this;
    }
  });
});