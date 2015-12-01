/**
 * @class     Persons collection view
*
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'dao',
  'communicator',
  'views/item/tags/item'
  ], function(
    Backbone,
    DAO,
    Communicator,
    ChildView
  ){

'use strict';

  return Backbone.Marionette.CollectionView.extend({

    /**
     * Ref to midel, represented in this composite
     *
     * @type {Backbone.Model}
     */
    childView: ChildView,

    /**
    * Class name of view container
    *
    * @type {String}
    */
    className: '',
    tagName: 'span'
  });

});