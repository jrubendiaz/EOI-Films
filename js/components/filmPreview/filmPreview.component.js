(function() {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('EOIFilms')
        .component('filmPreview', {
            templateUrl: '/js/components/filmPreview/filmPreview.html',
            controller: filmPreviewController,
            controllerAs: 'vm',
            bindings: {
                film: '=',
            },
        });

    filmPreviewController.$inject = [];
    function filmPreviewController() {
        var vm = this;

        ////////////////

        vm.$onInit = function() { };
        vm.$onChanges = function(changesObj) { };
        vm.$onDestroy = function() { };
    }
})();