/**
 * @class Index page layout
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'dao',
  'hbs!tmpl/item/settings/general'
], function(
  Backbone,
  DAO,
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
    className: '',

    /**
     * List of avaible regions
     *
     * @type {Object}
     */
    regions: {},

    /**
     * UI elements on this view
     *
     * @type {Object}
     */
    ui: {
      job         : '.user-job input',
      name        : '.user-name input',
      moto        : '.user-moto input',
      about       : '.user-about textarea',
      gender      : '.user-gender select',
      birthDay    : '.user-birth-day select',
      birthYear   : '.user-birth-year select',
      birthMonth  : '.user-birth-month select',

      submit: '.btn-primary',
      loader: '.loader'
    },

    /**
     * DOM events on this view
     *
     * @type {Object}
     */
    events: {
      'click @ui.submit':'submit'
    },

    /**
     * Submit form
     *
     * @param  {Event} event
     *
     * @return {Backbone.Marionette.ItemView}
     */
    submit: function(event)
    {
      var job        = $.trim(this.ui.job.val()),
          name       = $.trim(this.ui.name.val()),
          moto       = $.trim(this.ui.moto.val()),
          about      = $.trim(this.ui.about.val()),
          gender     = $.trim(this.ui.gender.val()),
          birthDay   = $.trim(this.ui.birthDay.val()),
          birthYear  = $.trim(this.ui.birthYear.val()),
          birthMonth = $.trim(this.ui.birthMonth.val());

      var data = {
        job        : job,
        name       : name,
        moto       : moto,
        about      : about,
        gender     : gender,
        birthDay   : birthDay,
        birthYear  : birthYear,
        birthMonth : birthMonth
      };

      this.ui.loader.removeClass('hidden');
      this.ui.submit.addClass('hidden');

      this.model
        .set(data)
        .once('sync',  _.bind(this.sync,  this))
        .once('error', _.bind(this.error, this))
        .save(data, { patch: true });

      return this;
    },

    /**
     * When model been synced
     *
     * @param  {Bacbone.Model} model
     * @param  {Object}        response
     * @param  {Object}        options
     *
     * @return {Backbone.Marionette.ItemView}
     */
    sync: function (model, response, options)
    {
      model.off('error');

      this.ui.loader.addClass('hidden');
      this.ui.submit.removeClass('hidden');

      $.notify({
        title: 'Done!',
        message: 'All data successfully been saved'
      },{
        type: 'success',
        animate: {
          enter: 'animated fadeInDown',
          exit: 'animated fadeOutUp'
        }
      });

      return this;
    },

    /**
     * Error occurred while saving model
     *
     * @param  {Bacbone.Model} model
     * @param  {Object}        response
     * @param  {Object}        options
     *
     * @return {Backbone.Marionette.ItemView}
     */
    error: function (model, response, options)
    {
      model.off('sync');

      this.ui.loader.addClass('hidden');
      this.ui.submit.removeClass('hidden');

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
    }
  });

});