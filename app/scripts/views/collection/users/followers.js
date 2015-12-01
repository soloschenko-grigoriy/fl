/**
 * @class     Persons collection view
*
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'dao',
  'models/person',
  'views/item/users/follower'
  ], function(
    Backbone,
    DAO,
    Person,
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
    className: ''
  });

});