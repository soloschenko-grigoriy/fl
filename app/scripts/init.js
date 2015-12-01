/**
 * @class   Init
 *
 * @author  Soloschenko G. soloschenko@gmail.com
 *
 */
require.config({
  urlArgs: 'v=0.0.1',
  shim: {
    jquery: {
      exports: '$'
    },
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    },
    bootstrap: {
      deps: [
        'jquery'
      ]
    },
    generatePassword:{
      deps: ['jquery'],
      exports: 'generatePassword'
    },
    selectpicker:{
      deps: ['jquery', 'bootstrap']
    },
     summernote                : {
      deps: ['jquery', 'bootstrap']
    },
     chosen                : {
      deps: ['jquery', 'bootstrap']
    },
    nanoscroller:{
      deps:['jquery','bootstrap']
    }
  },
  paths: {
    socketio         : 'vendor/socket.io-client/socket.io',
    jquery           : 'vendor/jquery/dist/jquery.min',
    backbone         : 'vendor/backbone/backbone-min',
    bootstrap        : 'vendor/bootstrap/dist/js/bootstrap.min',
    underscore       : 'vendor/underscore/underscore-min',

    'backbone.marionette'   : 'vendor/backbone.marionette/lib/core/backbone.marionette.min',
    'backbone.wreqr'        : 'vendor/backbone.wreqr/lib/backbone.wreqr.min',
    'backbone.babysitter'   : 'vendor/backbone.babysitter/lib/backbone.babysitter.min',
    'backbone.relational'   : 'vendor/backbone-relational/backbone-relational',

    text              : 'vendor/requirejs-text/text',
    tmpl              : '../templates',
    hbs               : 'vendor/require-handlebars-plugin/hbs',
    handlebars        : 'vendor/require-handlebars-plugin/hbs/handlebars.runtime',

    communicator : 'controllers/communicator',
    dao          : 'controllers/dao',
    regionManager: 'controllers/regionManager',
    router       : 'controllers/router',
    cookie       : 'controllers/cookie',
    auth         : 'controllers/auth',

    generatePassword  : 'plugins/password-generator/password-generator.min',
    selectpicker      : 'vendor/bootstrap-select/dist/js/bootstrap-select.min',
    notify            : 'vendor/remarkable-bootstrap-notify/dist/bootstrap-notify.min',
    nanoscroller      : 'vendor/nanoscroller/bin/javascripts/jquery.nanoscroller.min',

    moment     : 'vendor/moment/moment',
    summernote : 'vendor/summernote/dist/summernote.min',
    chosen     : 'vendor/chosen/chosen.jquery.min'
  },

  hbs: { // optional
    helpers: true,            // default: true
    templateExtension: 'html', // default: 'hbs'
    partialsUrl: '',           // default: ''
    helperDirectory: 'helpers/'
  }
});
require(['infrastructure'], function(){
  'use strict';

  require(['app'], function(App){
      App.start();
  });
});