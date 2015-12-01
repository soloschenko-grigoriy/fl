/**
 * @class Data Access Object
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define(['backbone', 'communicator'], function(Backbone, Communicator){

  'use strict';

  var DAO = Backbone.Marionette.Controller.extend({

    /**
     * @type {Object}
     */
    data: {},

    /**
     * General initialization
     *
     * @chainable
     *
     * @return {DAO}
     */
    initialize: function()
    {
      if(window.bootstrapped){
        _.each(bootstrapped, function(value, key){
          this.set(key, value);
        }, this);

        bootstrapped = {};

        $('#bootstrappedElm').remove();
      }

      return this;
    },

    /**
     * Getter
     *
     * @return {Mixed}
     */
    get: function(key)
    {
      return this.data[key];
    },

    /**
     * Setter
     *
     * @return {Mixed}
     */
    set: function(key, value)
    {
      this.data[key] = value;

      return this.data[key];
    },

    /**
     * Remove item forn DAO
     *
     * @chainable
     *
     * @return {DAO}
     */
    remove: function(key)
    {
      delete this.data[key];
      this.data[key] = null;

      return this;
    }
  });

  return new DAO();
});