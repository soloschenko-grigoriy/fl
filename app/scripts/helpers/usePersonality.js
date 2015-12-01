/**
 * @class Asset helper - used for include assets by path according to env
 *
 * version 0.0.1
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 * @copyright Astrafit 2014 astrafit.com
 *
 */
define(['handlebars', 'dao'], function (Handlebars, DAO){

  'use strict';

  Handlebars.registerHelper('usePerson', function(id){
    if(DAO.get('user').getActivePerson().id !== id) {
      return '<a href="javascript:;" class="use">use</a><br/><a href="javascript:;" class="delete">delete</a>';
    }

    return '<br/>';
  });

});