/**
 * @class     Post page layout
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'communicator',
  'models/post',
  'views/item/posts/full',
  'views/item/users/left',
  'views/composite/comments/list',
  'views/collection/tags/list',
  'hbs!tmpl/layout/posts/one'
], function(
  Backbone,
  Communicator,
  Post,
  PostView,
  UserView,
  CommentsView,
  TagsView,
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
      post     : '.post',
      user     : '.user',
      comments : '.comments',
      tags     : '.tags'
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
     * When collection been synced
     *
     * @param  {Backbone.Model}  model
     * @param  {Object}          response
     * @param  {Object}          options
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    sync: function (model, response, options)
    {
      model.off('error');

      if(!model || !model.id){
        Communicator.mediator.trigger('ROUTER:navigate', 'e404', { trigger: true });

        return this;
      }

      this.post.show(new PostView({ model: model }));
      this.user.show(new UserView({ model: model.get('author') }));
      this.comments.show(new CommentsView({ collection: model.get('comments') }));
      this.tags.show(new TagsView({ collection: model.get('tags') }));

      return this;
    },

    /**
     * Error occurred whil sync collection
     *
     * @param  {Backbone.Model}  model
     * @param  {Object}          response
     * @param  {Object}          options
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    error: function (model, response, options)
    {
      model.off('sync');

      Communicator.mediator.trigger('ROUTER:navigate', 'e500', { trigger: true });

      return this;
    },

    /**
     * When render occurred
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    onRender: function ()
    {
      Post.findOrCreate({ id: this.options.slug })
       .once('sync',  _.bind(this.sync,  this))
       .once('error', _.bind(this.error, this))
       .fetch({
          data:{
            populate: ['author', 'comments', 'photo', 'comments.author', 'tags']
          }
       });

      return this;
    }
  });

});