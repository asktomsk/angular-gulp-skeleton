(function () {
	'use strict';

    angular
        .module('app')
        .directive('loader', [ loader ]);

    function loader () {
    	return {
	        restrict:       'E',
	        templateUrl:    'tpl/loader.tpl'
	    };
    }

})();