/**
 * @class Application
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 * @copyright FaceLess Inc (c) 2015 faceless.club
 *
 */
define([
  'backbone',
  'communicator',
  'regionManager',
  'auth',
  'router',
  'cookie',
  'socketio',
  'dao',
  'collections/tags',
  'collections/chats'
], function(
  Backbone,
  Communicator,
  RM,
  Auth,
  Router,
  Cookie,
  IO,
  DAO,
  Tags,
  Conversations
){
  'use strict';

  var App = new Backbone.Marionette.Application();

  /* Add initializers here */
  App.addInitializer(function(){

    $.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
      options.crossDomain = true;
      options.xhrFields = {
        withCredentials: true
      };
    });

    Communicator.reqres.request('RM:addRegion', 'body',       'body');
    Communicator.reqres.request('RM:addRegion', 'container',  '#main-container');

    try{
      if(DAO.get('tags')){
        DAO.set('tags', new Tags(JSON.parse(DAO.get('tags'))));
      }
    }catch(e){console.log(e);}

    try{
      if(DAO.get('conversations')){
        DAO.set('conversations', new Conversations(JSON.parse(DAO.get('conversations'))));
      }
    }catch(e){console.log(e);}

    // DAO.set('soket', IO.connect('http://localhost:4000'));

    Router.start();

    $('body').on('click', 'a:not([data-bypass])', function(e){
      var href = $(this).prop('href'),
          root = location.protocol+'//'+location.host+'/';

      if($(this).hasClass('fancybox-thumb') || $(this).hasClass('not-open-page')){
        e.preventDefault();
        return this;
      }
      if($(this).data('changelang')){
        DAO.set('locale', $(this).data('changeLang'));
      }

      if(root===href.slice(0,root.length)){
        e.preventDefault();

        Communicator.mediator.trigger('ROUTER:navigate', href.slice(root.length), {trigger: true });
      }
    });
  });

  return App;
});

