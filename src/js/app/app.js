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