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

    filmPreviewController.$inject = ['$timeout', 'localStorageProvider', 'movieDBProvider'];
    function filmPreviewController($timeout, localStorageProvider, movieDBProvider) {
        var vm = this;

        //Variables
        vm.menuState = false;

        //Functions
        vm.activate = activate;
        vm.toogleMenuState = toogleMenuState;
        vm.addTo = addTo;

        ////////////////

        vm.$onInit = function() {
            $timeout(loaded, 1000);
         };
        vm.$onChanges = function(changesObj) { };
        vm.$onDestroy = function() { };

        function toogleMenuState() {
            vm.menuState = !vm.menuState;
        }
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
        function addTo(cat) {
            localStorageProvider.set(cat, vm.film.id);
        }
    }
})();