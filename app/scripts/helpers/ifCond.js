/**
 * @class     Asset helper - used for include assets by path according to env
 *
 * @author    Soloschenko G. soloschenko@gmail.com
 *
 */
define(['handlebars', 'dao'], function (Handlebars, DAO){

  'use strict';

  Handlebars.registerHelper('ifCond', function(v1, v2, options){
		if(v1 === v2) {
			return options.fn(this);
		}

		return options.inverse(this);
  });

});