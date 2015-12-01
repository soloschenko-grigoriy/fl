/**
 * @class     Persons collection
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define(['backbone'], function (Backbone){

  'use strict';

  return Backbone.Collection.extend({

    /**
     * Simply override costructor for best debuging
     *
     * @chainable
     *
     * @return {Backbone.Model}
     */
    constructor: function Persons()
    {

      return Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    /**
     * Url for sync with server
     *
     * @returns {String}
     */
    url: '/api/users/persons'
  });
});