/**
 * @class     Index page layout
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'dao',
  'communicator',
  'collections/chats',
  'hbs!tmpl/item/users/left'
], function(
  Backbone,
  DAO,
  Communicator,
  Chats,
  Tmpl
){

  'use strict';

  return Backbone.Marionette.ItemView.extend({

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
    className: 'widget',

    /**
     * UI elements on this view
     *
     * @type {Object}
     */
    ui: {
      follow    : '.follow',
      unfollow  : '.unfollow',
      message   : '.new-message',
      loader    : '.loader',
      followers : '.folowers-count',
      posts     : '.posts-count'
    },

    /**
     * DOM events on this view
     *
     * @type {Object}
     */
    events: {
      'click .follow': 'follow',
      'click .unfollow': 'unfollow',
      'click @ui.message': 'message'
    },

    /**
     * Follow this user
     *
     * @param  {Event} event
     *
     * @return {Backbone.Marionette.ItemView}
     */
    follow: function (event)
    {
      this.showLoader();

      DAO.get('user').getActivePerson().follow({
        user    : this.model,
        success : _.bind(function(model, responce, options){
          this.hideLoader('showUnFollowButton');
        }, this),
        error   : _.bind(function(model, responce, options){
          this.hideLoader('showFollowButton');
          this.showError();
        }, this)
      });

      return this;
    },

    /**
     * Unfollow this user
     *
     * @param  {Event} event
     *
     * @return {Backbone.Marionette.ItemView}
     */
    unfollow: function (event)
    {
      this.showLoader();

      DAO.get('user').getActivePerson().unfollow({
        user    : this.model,
        success : _.bind(function(model, responce, options){
          this.hideLoader('showFollowButton');
        }, this),
        error   : _.bind(function(model, responce, options){
          this.hideLoader('showUnFollowButton');
          this.showError();
        }, this)
      });

      return this;
    },

    /**
     * Write a new message
     *
     * @param  {Event} event
     *
     * @return {Backbone.Marionette.ItemView}
     */
    message: function (event)
    {
      this.showLoader();

      new Chats().findOrCreateBy2Users({
        user1: DAO.get('user').getActivePerson(),
        user2:this.model,
        success: function(model){
          Communicator.mediator.trigger('ROUTER:navigate', 'messages/'+model.id, { trigger: true });
        },
        error: _.bind(this.showError, this)
      });

      return this;
    },

    /**
     * Show loader
     *
     * @return {Backbone.Marionette.ItemView}
     */
    showLoader: function ()
    {
      this.ui.loader.removeClass('hidden');

      this.ui.follow.addClass('hidden');
      this.ui.unfollow.addClass('hidden');
      this.ui.message.addClass('hidden');

      return this;
    },

    /**
     * Hide loader
     *
     * @return {Backbone.Marionette.ItemView}
     */
    hideLoader: function (type)
    {
      this.ui.loader.addClass('hidden');

      this.ui.message.removeClass('hidden');

      if(type === 'showFollowButton'){
        this.ui.follow.removeClass('hidden');
      }else if(type === 'showUnFollowButton'){
        this.ui.unfollow.removeClass('hidden');
      }

      return this;
    },

    /**
     * Show error
     *
     * @return {Backbone.Marionette.ItemView}
     */
    showError: function ()
    {
      $.notify({
        title: 'Oops!',
        message: 'Something went wrong... Please, try again later'
      },{
        type: 'danger',
        animate: {
          enter: 'animated fadeInDown',
          exit: 'animated fadeOutUp'
        }
      });

      return this;
    },

    /**
     * When render occurred
     *
     * @return {Backbone.Marionette.ItemView}
     */
    onRender: function ()
    {
      if(DAO.get('user').isSamePerson(this.model)){
        this.ui.follow.addClass('hidden');
        this.ui.message.addClass('hidden');
      }

      if(DAO.get('user').isFollwing(this.model)){
        this.ui.follow.addClass('hidden');
        this.ui.unfollow.removeClass('hidden');
      }

      this.ui.followers.text(this.model.get('followers').length);

      return this;
    }
  });

});