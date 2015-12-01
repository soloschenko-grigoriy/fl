require.config({
    baseUrl: '../app/scripts',
    urlArgs: 'cb=' + Math.random(),

    deps: ['backbone.marionette'],

    paths: {
        spec: '../../test/spec', // lives in the test directory

        jquery: './vendor/jquery/dist/jquery.min',
        backbone: './vendor/backbone/backbone-min',
        underscore: './vendor/underscore/underscore-min',

        /* backbone plugins */
        'backbone.syphon': './vendor/backbone.syphon/lib/amd/backbone.syphon',
        'backbone.iobind': './vendor/backbone.iobind/dist/backbone.iobind',

        /* alias all marionette libs */
        'backbone.marionette': './vendor/backbone.marionette/lib/core/backbone.marionette',
        'backbone.wreqr': './vendor/backbone.wreqr/lib/backbone.wreqr.min',
        'backbone.babysitter': './vendor/backbone.babysitter/lib/backbone.babysitter',

        /* alias the bootstrap js lib */
        bootstrap: './vendor/bootstrap/dist/js/bootstrap.min',

        /* Alias text.js for template loading and shortcut the templates dir to tmpl */
        text: './vendor/requirejs-text/text',
        tmpl: "../templates",

        /* handlebars from the require handlerbars plugin below */
        handlebars: './vendor/require-handlebars-plugin/Handlebars',

        /* require handlebars plugin - Alex Sexton */
        i18nprecompile: './vendor/require-handlebars-plugin/hbs/i18nprecompile',
        json2: './vendor/require-handlebars-plugin/hbs/json2',
        hbs: './vendor/require-handlebars-plugin/hbs'
    },

    hbs: {
        disableI18n: true
    }
});

/* require test suite */
require([
    'jquery',
    'spec/testSuite'
],
function( $, testSuite ) {

    'use strict';

    /* on dom ready require all specs and run */
    $( function() {
        require(testSuite.specs, function() {

            if (window.mochaPhantomJS) {
                mochaPhantomJS.run();
            }
            else {
                mocha.run();
            }

        });
    });
});
