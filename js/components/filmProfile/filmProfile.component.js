(function() {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('EOIFilms')
        .component('filmProfile', {
            templateUrl: '/js/components/filmProfile/filmProfile.html',
            controller: filmProfileController,
            controllerAs: 'vm',
            bindings: {
                film: '=',
            },
        });

    filmProfileController.$inject = [];
    function filmProfileController() {
        var vm = this;


        ////////////////

        vm.$onInit = function() {
            console.log(vm.film);
        };
        vm.$onChanges = function(changesObj) { };
        vm.$onDestroy = function() { };
    }
})();