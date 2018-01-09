(function() {
    'use strict';

    angular.module('EOIFilms', ['ngRoute', 'firebase', 'rzModule', 'ngSanitize']).config(config)

    config.$inject = ['$routeProvider', '$locationProvider'];

    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                controller: 'homeController',
                templateUrl: 'js/views/home.html',
                controllerAs: 'homeCtrl'
            })
            .when("/login", {
                controller: 'loginController',
                templateUrl: 'js/views/login.html',
                controllerAs: 'loginCtrl'
            })
    }
})();