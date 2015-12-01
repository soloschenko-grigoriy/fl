/**
 * @class Index page layout
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'communicator',
  'dao',
  'views/item/users/left',
  'hbs!tmpl/layout/index'
], function(
  Backbone,
  Communicator,
  DAO,
  UserView,
  Tmpl
){

  'use strict';

  return Backbone.Marionette.LayoutView.extend({

    /**
     * Wrapper template
     *
     * @type {String}
     */
    template: Tmpl,

    /**
     * Class name of view container
     *
     * @type {String}
     */
    className: 'content',

    /**
     * List of avaible regions
     *
     * @type {Object}
     */
    regions: {
      user: '.user'
    },

    /**
     * UI events on this view
     *
     * @type {Object}
     */
    ui:{},

    /**
     * DOM events on this view
     *
     * @type {Object}
     */
    events: {},

    /**
     * When render occurred
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    onRender: function ()
    {
      console.log(111);
      // this.user.show(new UserView({ model: DAO.get('user').getActivePerson() }));

      return this;
    }
  });

});