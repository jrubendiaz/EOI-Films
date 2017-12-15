(function() {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('EOIFilms')
        .component('filmPreview', {
            templateUrl: 'js/components/filmPreview/filmPreview.html',
            controller: filmPreviewController,
            controllerAs: 'vm',
            bindings: {
                film: '=',
                activatemodal: "&",
                filmsState: '=',
            },
        });

    filmPreviewController.$inject = ['$timeout'];
    function filmPreviewController($timeout) {
        var vm = this;

        vm.activate = activate;

        ////////////////

        vm.$onInit = function() {
            console.log(vm.filmsState);
            $timeout(loaded, 1000);
         };
        vm.$onChanges = function(changesObj) { };
        vm.$onDestroy = function() { };

        function activate(){
            vm.activatemodal(vm.film);
        }
        function loaded() {
            vm.filmsState = "loaded";
            $timeout(showMe, 200);
        }
        function showMe(){
            vm.state = "on";
        }
    }
})();