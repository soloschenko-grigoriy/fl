/**
 * @class     Asset helper - used for include assets by path according to env
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define(['handlebars', 'dao'], function (Handlebars, DAO){

  'use strict';

  Handlebars.registerHelper('getChatUser', function(model, param){
    var user = model.user1;
    if(DAO.get('user').isSamePerson(model.user1)){
      user = model.user2;
    }

    return user[param];
  });

});