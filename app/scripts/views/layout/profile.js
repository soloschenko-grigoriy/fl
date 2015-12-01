/**
 * @class     Post page layout
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'communicator',
  'dao',
  'collections/users',
  'models/person',
  'collections/persons',

  'views/item/settings/general',
  'views/item/settings/security',
  'views/item/users/horizontal',
  'views/item/users/overview',
  'views/item/users/tabs',

  'views/collection/users/persons',
  'views/collection/users/followers',
  'views/collection/users/followings',

  'views/layout/posts/_list',

  'hbs!tmpl/layout/profile'
], function(
  Backbone,
  Communicator,
  DAO,
  Users,
  Person,
  Persons,
  GeneralSettingsView,
  SecuritySettingsView,
  UserHorizontalView,
  UserOverviewView,
  UserTabsView,

  PersonsView,
  FollowersView,
  FollowingsView,

  PostsView,

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
      generalSettings  : '.general-settings',
      securitySettings : '.security-settings',
      persons    : '.persons .row',
      userHorizontal   : '.user-horizontal',
      userOverview     : '.overview-container',
      tabs             : '.tabs',
      followers        : '.followers-container .row',
      following        : '.following-container .row',
      posts            : '.posts-container'
    },

    /**
     * UI events on this view
     *
     * @type {Object}
     */
    ui:{
      addPersonBtn: '.add-person'
    },

    /**
     * DOM events on this view
     *
     * @type {Object}
     */
    events: {
      'click @ui.addPersonBtn':'addPerson'
    },

    initialize: function()
    {
      Person.findOrCreate({ id: this.options.userId })
        .once('sync',  _.bind(this.loaded, this))
        .once('error', _.bind(this.error, this))
        .fetch({
          data: {
            populate: ['followers', 'followings']
          }
        });

      return this;
    },

    error: function(model, response, options)
    {
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

    loaded: function(model, response, options)
    {
      this.userHorizontal.show(new UserHorizontalView({ model: model }));
      this.userOverview.show(new UserOverviewView({ model: model }));
      this.tabs.show(new UserTabsView({ model: model }));

      if(DAO.get('user').hasPerson(model)){
        this.$el.find('.persons').removeClass('hidden');
        this.$el.find('.settings').removeClass('hidden');
        this.generalSettings.show(new GeneralSettingsView({ model: model }));
        this.securitySettings.show(new SecuritySettingsView({ model: DAO.get('user') }));
        this.persons.show(new PersonsView({ collection: new Persons(DAO.get('user').getPersons()) }));
      }

      this.$el.find('select').selectpicker({ width: '100%'});

      if(this.options.subpage && this.$el.find('.'+this.options.subpage).length > 0){
        this.$el.find('.'+this.options.subpage).addClass('active');
      }else{
        this.$el.find('.nav-tabs li').first().addClass('active');
        this.$el.find('.tab-pane').first().addClass('active');
      }

      if(model.get('followers').length > 0){
        this.followers.show(new FollowersView({ collection: model.get('followers')}));
      }

      if(model.get('followings').length > 0){
        this.following.show(new FollowingsView({ collection: model.get('followings')}));
      }

      this.posts.show(new PostsView({ author: model }));

      return this;
    }
  });

});