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
  'models/post',
  'views/collection/tags/select',
  'hbs!tmpl/layout/posts/add'
], function(
  Backbone,
  Communicator,
  DAO,
  Post,
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
      tags: '.post-tags'
    },

    /**
     * UI events on this view
     *
     * @type {Object}
     */
    ui:{
      name          : '.post-name input',
      description   : '.post-description textarea',
      submit        : '.btn-primary',
      loader        : '.loader'
    },

    /**
     * DOM events on this view
     *
     * @type {Object}
     */
    events: {
      'click @ui.submit': 'submit',
      'keydown input'   : 'clear'
    },

    /**
     * Submit this post
     *
     * @param  {Event} event
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    submit: function (event)
    {
      event.preventDefault();

      var name        = $.trim(this.ui.name.val()),
          description = this.ui.description.code(),
          tags        = this.$el.find('.post-tags select').val();

      this.clear();

      if(!name){
        this.ui.name.parent().addClass('has-error');
        this.ui.name.focus();

        return this;
      }

      if(!description){
        this.ui.description.parent().addClass('has-error');
        this.ui.description.summernote({ focus: true });

        return this;
      }

      if(!tags || tags.length === 0){
        this.$el.find('.post-tags select').parent().addClass('has-error');

        return this;
      }

      this.ui.loader.removeClass('hidden');
      this.ui.submit.addClass('hidden');

      new Post({
        name        : name,
        description : description,
        tags        : tags,
        author      : DAO.get('user').getActivePerson()
      })
       .once('sync',  _.bind(this.sync, this))
       .once('error', _.bind(this.error, this))
       .save();

      return this;
    },

    /**
     * Clear all errors
     *
     * @param  {Event} event
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    clear: function (event)
    {
      this.$el.find('.has-error').removeClass('has-error');

      return this;
    },

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

      Communicator.mediator.trigger('ROUTER:navigate', 'posts/' + model.id, { trigger: true });

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
    },
    /**
     * When render occurred
     *
     * @return {Backbone.Marionette.LayoutView}
     */
    onShow: function ()
    {
      var self = this;
      this.$el.find('textarea').summernote({
        height: 150,
        toolbar: [
          ['style', ['italic', 'underline', 'clear']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
        ],
        onKeyup: function(e) {
          self.clear();
        }
      });

      this.tags.show(new TagsView({ collection: DAO.get('tags')}));

      Communicator.mediator.on('CHOSEN:CHANGE', this.clear, this);

      return this;
    }
  });

});