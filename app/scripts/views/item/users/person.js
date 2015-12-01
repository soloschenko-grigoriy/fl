/**
 * @class Index page layout
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'dao',
  'models/person',
  'hbs!tmpl/item/users/person'
], function(
  Backbone,
  DAO,
  Person,
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
    className: 'col-md-4 mt person-small',

    /**
     * UI elements on this view
     *
     * @type {Object}
     */
    ui: {
      addNew : '.add-new a',
      save   : '.btn-primary',
      name   : '.user-name input',
      loader : '.loader',
      delete : '.delete',
      restore : '.restore',
      use : '.use'
    },

    /**
     * DOM events on this view
     *
     * @type {Object}
     */
    events: {
      'click @ui.addNew': 'addNew',
      'click @ui.save'  : 'save',
      'click @ui.delete'  : 'delete',
      'click @ui.restore'  : 'restore',
      'click @ui.use'  : 'use'
    },

    use: function(event)
    {
      DAO.get('user').getActivePerson()
        .set({ active: false })
        .once('sync',  _.bind(this.proceedUse, this))
        .once('error', _.bind(this.error,    this))
        .save({ active: false }, { patch: true });

      return this;
    },

    proceedUse: function(model, response, options)
    {
      this.model
        .set({ active: true })
        .once('sync',  _.bind(this.sync, this))
        .once('error', _.bind(this.error, this))
        .save({ active: true }, { patch: true});

      return this;
    },

    restore: function(event)
    {
      this.model
        .set({ deleted: false })
        .once('error', _.bind(this.error, this))
        .save({ deleted: false }, { patch: true});

      return this;
    },

    delete: function(event)
    {
      this.model
        .set({ deleted: true })
        .once('error', _.bind(this.error, this))
        .save({ deleted: true }, { patch: true});

      return this;
    },

    addNew: function(event)
    {
      this.$el.find('.form-group').removeClass('hidden');
      this.ui.save.removeClass('hidden');
      this.$el.find('.add-new').addClass('hidden');

      return this;
    },

    save: function(event)
    {
      var name  = $.trim(this.ui.name.val());

      this.$el.find('.has-error').removeClass('has-error');
      this.$el.find('.error').addClass('hidden');

      if(!name){
        this.ui.name.parent().addClass('has-error');
        this.ui.name.focus();

        return this;
      }

      this.ui.loader.removeClass('hidden');
      this.ui.save.addClass('hidden');

      this.model.set({ name: name, active: true, deleted : false});

      DAO.get('user').getActivePerson()
        .set({ active: false })
        .once('sync', _.bind(this.resetActiveSaved, this))
        .once('error', _.bind(this.error,    this))
        .save({ active: false }, { patch: true });


      return this;
    },

    resetActiveSaved: function(model, response, options)
    {
      this.model
        .once('sync',  _.bind(this.newSaved, this))
        .once('error', _.bind(this.error,    this))
        .save();
    },

    newSaved: function(model, response, options)
    {
      model.off('error');

      DAO.get('user').get('persons').add(model);

      DAO.get('user')
        .once('sync',  _.bind(this.sync,  this))
        .once('error', _.bind(this.error, this))
        .save({ persons: DAO.get('user').get('persons') }, { patch: true });

      return this;
    },

    sync: function(model, response, options)
    {
      model.off('error');

      this.ui.loader.addClass('hidden');

      window.location.href = '/profile/settings';

      return this;
    },

    error: function(model, response, options)
    {
      this.ui.loader.addClass('hidden');
      this.ui.save.removeClass('hidden');

      model.off('sync');

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

    deleted: function(model, value)
    {
      if(value){
        this.$el.addClass('deleted');
      }else{
        this.$el.removeClass('deleted');
      }

      return this;
    },

    onRender: function()
    {
      this.listenTo(this.model, 'change:deleted', this.deleted);

      return this;
    }


  });

});