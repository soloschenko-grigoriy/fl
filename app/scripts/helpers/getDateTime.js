/**
 * @class     Asset helper - used for include assets by path according to env
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define(['handlebars', 'moment'], function (Handlebars, moment){

  'use strict';

  Handlebars.registerHelper('getDateTime', function(timestamp, type){
    if(type === 'time'){
      return moment.unix(timestamp).format('h:mm a');
    }

    if(type === 'date'){
      return moment.unix(timestamp).format('M/D/YYYY');
    }

    return moment.unix(timestamp).fromNow();
  });

});