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
  'views/item/users/person'
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
    className: '',

    onBeforeDestroy: function()
    {
      this.collection.remove(this.collection.filter(function(model){
        return model.isNew();
      }));

      return this;
    },

    /**
     * When render occurred
     *
     * @param  {Event} event
     *
     * @return {Backbone.Marionette.CollectionView}
     */
    onRender: function(event)
    {
      this.collection.add(new Person());

      return this;
    }
  });

});