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