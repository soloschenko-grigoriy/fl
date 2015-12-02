/**
 * @class Application Router
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 */
define([
  'backbone',
  'communicator',
  'dao',
  'auth',
  'views/layout/index',

  'views/layout/posts/list',
  'views/layout/posts/one',
  'views/layout/posts/add',

  'views/layout/messages/list',
  'views/layout/messages/chats',

  'views/layout/profile',

  'views/layout/community',

  'views/layout/login',
  'views/layout/logout',
  'views/layout/recover',
  'views/layout/layout',
  'views/layout/errors/e404',
  'views/layout/errors/e500'
], function(
    Backbone,
    Communicator,
    DAO,
    Auth,
    IndexLayout,

    PostsLayout,
    PostLayout,
    AddPostLayout,

    MessagesLayout,
    ChatsLayout,

    ProfileLayout,
    CommunityLayout,

    LoginLayout,
    LogoutLayout,
    RecoverLayout,
    Layout,
    E404Layout,
    E500Layout
){

  'use strict';

  var Router = Backbone.Router.extend({

    /**
     * @type {Object} Routes list
     */
    routes: {
      ''          : 'index',
      'posts'     : 'posts',
      'posts/add' : 'addPost',
      'posts/:id' : 'post',

      'profile/:id'          : 'profile',
      'profile/:id/:subpage' : 'profile',

      'messages'      : 'chats',
      'messages/:id'  : 'chat',

      'community': 'community',

      'login'     : 'login',
      'logout'    : 'logout',
      'recover'   : 'recover',

      'e500'      : 'e500',
      '*notFound' : 'e404'
    },

    /**
     * When app is ready - start the app!
     *
     * @return {Backbone.Router}
     */
    start: function()
    {
      Communicator.mediator.on('ROUTER:navigate', this.navigate, this);

      Backbone.history.start({pushState: true});

      return this;
    },

    /**
     * Before each route check auth
     *
     * @return {Backbone.Router}
     */
    breforeEach: function()
    {
      if(!this.layout){
        this.layout = new Layout();

        Communicator.reqres.request('RM:getRegion', 'body').show(this.layout);
      }

      return true;
    },

    /**
     * Index route
     *
     * @return {Backbone.Router}
     */
    index: function()
    {
      if(!this.breforeEach()){
        return this;
      }

      Communicator.reqres.request('RM:getRegion', 'container').show(new IndexLayout());
      Communicator.mediator.trigger('ROUTER:CHANGED', 'index');

      return this;
    },

    /**
     * Index route
     *
     * @return {Backbone.Router}
     */
    posts: function()
    {
      if(!this.breforeEach()){
        return this;
      }

      Communicator.reqres.request('RM:getRegion', 'container').show(new PostsLayout());
      Communicator.mediator.trigger('ROUTER:CHANGED', 'posts');

      return this;
    },

    /**
     * Index route
     *
     * @return {Backbone.Router}
     */
    post: function(slug)
    {
      if(!this.breforeEach()){
        return this;
      }

      Communicator.reqres.request('RM:getRegion', 'container').show(new PostLayout({ slug: slug }));
      Communicator.mediator.trigger('ROUTER:CHANGED', 'post');

      return this;
    },

    /**
     * Index route
     *
     * @return {Backbone.Router}
     */
    addPost: function()
    {
      if(!this.breforeEach()){
        return this;
      }

      Communicator.reqres.request('RM:getRegion', 'container').show(new AddPostLayout());
      Communicator.mediator.trigger('ROUTER:CHANGED', 'addPost');

      return this;
    },

    /**
     * Index route
     *
     * @return {Backbone.Router}
     */
    chats: function()
    {
      if(!this.breforeEach()){
        return this;
      }

      Communicator.reqres.request('RM:getRegion', 'container').show(new ChatsLayout());
      Communicator.mediator.trigger('ROUTER:CHANGED', 'chats');

      return this;
    },

    /**
     * Index route
     *
     * @return {Backbone.Router}
     */
    chat: function(id)
    {
      if(!this.breforeEach()){
        return this;
      }

      Communicator.reqres.request('RM:getRegion', 'container').show(new MessagesLayout({ chatId: id }));
      Communicator.mediator.trigger('ROUTER:CHANGED', 'messages');

      return this;
    },

    /**
     * Index route
     *
     * @return {Backbone.Router}
     */
    profile: function(id, subpage)
    {
      if(!this.breforeEach()){
        return this;
      }

      Communicator.reqres.request('RM:getRegion', 'container').show(new ProfileLayout({ userId: id, subpage: subpage }));
      Communicator.mediator.trigger('ROUTER:CHANGED', 'profile');

      return this;
    },

    /**
     * Index route
     *
     * @return {Backbone.Router}
     */
    community: function()
    {
      if(!this.breforeEach()){
        return this;
      }

      Communicator.reqres.request('RM:getRegion', 'container').show(new CommunityLayout());
      Communicator.mediator.trigger('ROUTER:CHANGED', 'community');

      return this;
    },

    /**
     * Index route
     *
     * @return {Backbone.Router}
     */
    login: function()
    {
      if(Auth.is() && DAO.get('user')){ // check if we realy need to login
        Communicator.mediator.trigger('ROUTER:navigate', '', {trigger: true});

        return this;
      }

      Communicator.reqres.request('RM:getRegion', 'body').show(new LoginLayout());
      Communicator.mediator.trigger('ROUTER:CHANGED', 'login');

      return this;
    },

    /**
     * Index route
     *
     * @return {Backbone.Router}
     */
    logout: function()
    {
      if(!this.breforeEach()){
        return this;
      }

      Communicator.reqres.request('RM:getRegion', 'body').show(new LogoutLayout());
      Communicator.mediator.trigger('ROUTER:CHANGED', 'logout');

      return this;
    },

    /**
     * Index route
     *
     * @return {Backbone.Router}
     */
    recover: function()
    {
      if(Auth.is() && DAO.get('user')){ // check if we realy need to login
        Communicator.mediator.trigger('ROUTER:navigate', '', {trigger: true});

        return this;
      }

      Communicator.reqres.request('RM:getRegion', 'body').show(new RecoverLayout());
      Communicator.mediator.trigger('ROUTER:CHANGED', 'recover');

      return this;
    },

    /**
     * 404 route
     *
     * @return {Backbone.Router}
     */
    e404: function()
    {
      Communicator.reqres.request('RM:getRegion', 'body').show(new E404Layout());
      Communicator.mediator.trigger('ROUTER:CHANGED', 'e404');

      return this;
    },

    /**
     * 404 route
     *
     * @return {Backbone.Router}
     */
    e500: function()
    {
      Communicator.reqres.request('RM:getRegion', 'body').show(new E500Layout());
      Communicator.mediator.trigger('ROUTER:CHANGED', 'e500');

      return this;
    }

  });

  return new Router();
});