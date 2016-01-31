(function () {
    'use strict';

    // TODO: change ngRoute to ui-router
    angular.module('app', [
        'ngRoute', 
        'ngResource', 
        'templates'])
    .config([
        '$routeProvider',
        '$locationProvider',
        '$resourceProvider',
        'urls',
        function ($routeProvider, $locationProvider, $resourceProvider, urls) {
            $routeProvider
                .when(urls.main, {
                    templateUrl:    'tpl/main.tpl',
                    controller:     'mainCtrl',
                    controllerAs:   'main'
                })
                .otherwise(urls.main);

            // use the HTML5 History API
            $locationProvider.html5Mode(true);

            $resourceProvider.defaults.stripTrailingSlashes = false;
        }
    ]);

})();
(function () {

    'use strict';

    angular
    .module('app')
    .constant('urls', {
        // route URLs
        main:             '/main/',
    });

})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('mainCtrl', [
            '$scope', 
            mainCtrl]);

    function mainCtrl ($scope) {
    }
})();

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
(function () {

    'use strict';

    angular
        .module('app')
        .factory('dataService', ['$resource', '$q', 'urls', dataService]);

    function dataService($resource, $q, urls) {
        var self = this;

        // data layer, resource inits and calls

        return self;
    }
})();