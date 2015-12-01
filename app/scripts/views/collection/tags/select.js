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
  'views/item/tags/option'
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

    /**
     * Tag name of view container
     *
     * @type {String}
     */
    tagName: 'select',

    /**
     * General preparations
     *
     * @return {Backbone.Marionette.CollectionView}
     */
    initialize: function ()
    {
      this.$el.prop('multiple', true);

      return this;
    },

    /**
     * When show occurred
     *
     * @return {Backbone.Marionette.CollectionView}
     */
    onShow: function ()
    {
      this.$el.chosen({ placeholder_text_multiple: 'Tags of your post', width: '100%' }).change(function(value){
        Communicator.mediator.trigger('CHOSEN:CHANGE', value);
      });

      return this;
    }
  });

});