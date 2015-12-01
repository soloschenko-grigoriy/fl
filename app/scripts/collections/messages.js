/**
 * @class     Messages collection
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define(['backbone', 'models/message'], function (Backbone, Model){

  'use strict';

  return Backbone.Collection.extend({

    /**
     * Simply override costructor for best debuging
     *
     * @chainable
     *
     * @return {Backbone.Model}
     */
    constructor: function Messages()
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
    url: '/api/messages',

    comparator: function(model)
    {
      return model.get('created');
    }
  });
});