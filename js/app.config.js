(function() {
    'use strict';

    angular.module('EOIFilms', ['ngRoute', 'firebase']).config(config)

    config.$inject = ['$routeProvider', '$locationProvider'];

    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                controller: 'homeController',
                templateUrl: 'js/views/home.html',
                controllerAs: 'homeCtrl'
            })
    }
})();