/**
 * @class     Message model
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define(['backbone', 'dao', 'collections/persons', 'models/person'], function(Backbone, DAO, Persons, Person){

  'use strict';

  return Backbone.RelationalModel.extend({

    /**
    * Simply override costructor for best debuging
    *
    * @chainable
    *
    * @return {Backbone.RelationalModel}
    */
    constructor: function Message()
    {

      return Backbone.RelationalModel.prototype.constructor.apply(this, arguments);
    },

    /**
     * Url for sync with server
     *
     * @type {String}
     */
    urlRoot: '/api/messages',

    /**
     * Relations for the model
     *
     * @type {Array}
     */
    relations: [{
      type              : Backbone.HasOne,
      key               : 'author',
      relatedModel      : Person,
      collectionType    : Persons
    }]
  });
});