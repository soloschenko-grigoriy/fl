/**
 * @class     User model
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'dao',
  'collections/persons',
  'models/person'
], function(
  Backbone,
  DAO,
  Persons,
  Person
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
    constructor: function User()
    {

      return Backbone.RelationalModel.prototype.constructor.apply(this, arguments);
    },

    /**
     * Url for sync with server
     *
     * @type {String}
     */
    urlRoot: '/api/users',

    /**
     * Relations for the model
     *
     * @type {Array}
     */
    relations: [{
      type              : Backbone.HasMany,
      key               : 'persons',
      relatedModel      : Person,
      collectionType    : Persons
    }],

    getActivePerson: function()
    {
      var active = this.get('persons').find(function(one){
        return one.get('active') && !one.get('deleted');
      });

      if(!active){
        return this.get('persons').first();
      }

      return active;
    },

    getName: function()
    {

      return this.getActivePerson().get('name');
    },

    getPersons: function(one)
    {
      return this.get('persons').filter(function(one){
        return !one.get('deleted');
      });
    },

    hasPerson: function(model)
    {
      if(_.isObject(model)){
        model = model.id;
      }


      if(this.get('persons').get(model)){
        return true;
      }

      return false;

    },

    isSamePerson: function (user)
    {

      return this.getActivePerson().id === user.id;
    },

    isFollwing: function (user)
    {

      return this.getActivePerson().get('followings').get(user.id);
    }
  });
});