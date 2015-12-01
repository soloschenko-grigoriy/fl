/**
 * @class
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define(['handlebars', 'dao'], function (Handlebars, DAO){

  'use strict';

  Handlebars.registerHelper('getMonthName', function(month){
    var months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return months[month];
  });

});
