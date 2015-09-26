(function() {
    'use strict';

    angular
        .module('app.filter')
        .filter('DateFilter', DateFilter);

    function DateFilter() {
    	return function(date) {
    		var parsedDate = Date.parse(date);
    		var fromNow = moment(parsedDate).fromNow();
    		// get number of days, i.e. 6 days ago => 6 
    		var daysAgo = fromNow.split(' ')[0]; 
    		// if number of days is less than 7 days (a week), return relative time, otherwise return the full date
    		var finalDate = daysAgo < 7 ? fromNow : moment(parsedDate).format('YYYY-MM-DD HH:mm:ss'); 
    		return finalDate;
    	}
    }
})();