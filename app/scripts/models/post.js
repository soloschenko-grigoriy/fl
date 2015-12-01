/**
 * @class     Post model
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define([
  'backbone',
  'dao',
  'collections/persons',
  'collections/comments',
  'collections/views',
  'collections/votes',
  'collections/photos',
  'collections/tags',
  'models/person',
  'models/comment',
  'models/view',
  'models/vote',
  'models/photo',
  'models/tag'
  ], function(
    Backbone,
    DAO,
    Persons,
    Comments,
    Views,
    Votes,
    Photos,
    Tags,
    Person,
    Comment,
    View,
    Vote,
    Photo,
    Tag
  ){

  'use strict';

  return Backbone.RelationalModel.extend({

    /**
    * Simply override costructor for best debuging
    *
    * @chainable
    *
    * @return {Backbone.RelationalModel}
    */
    constructor: function Post()
    {

      return Backbone.RelationalModel.prototype.constructor.apply(this, arguments);
    },

    /**
     * Url for sync with server
     *
     * @type {String}
     */
    urlRoot: '/api/posts',

    /**
     * Relations for the model
     *
     * @type {Array}
     */
    relations: [{
      type              : Backbone.HasOne,
      key               : 'author',
      relatedModel      : Person,
      collectionType    : Persons
    },{
      type              : Backbone.HasOne,
      key               : 'photo',
      relatedModel      : Photo,
      collectionType    : Photos
    },{
      type              : Backbone.HasMany,
      key               : 'views',
      relatedModel      : View,
      collectionType    : Views
    },{
      type              : Backbone.HasMany,
      key               : 'votes',
      relatedModel      : Vote,
      collectionType    : Votes
    },{
      type              : Backbone.HasMany,
      key               : 'comments',
      relatedModel      : Comment,
      collectionType    : Comments
    },{
      type              : Backbone.HasMany,
      key               : 'tags',
      relatedModel      : Tag,
      collectionType    : Tags
    }]
  });
});