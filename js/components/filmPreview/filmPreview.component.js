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
                user: '=',
            },
        });

    filmPreviewController.$inject = ['$timeout', 'localStorageProvider', 'movieDBProvider', 'firebaseProvider'];
    function filmPreviewController($timeout, localStorageProvider, movieDBProvider, firebaseProvider) {
        var vm = this;

        //Variables
        vm.menuState = false;

        //Functions
        vm.activate = activate;
        vm.toogleMenuState = toogleMenuState;
        vm.addTo = addTo;
        vm.addToFavorite = addToFavorite;
        vm.addToWatchLater = addToWatchLater;

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
            //localStorageProvider.set(cat, vm.film.id);
            console.log(vm.user);
            firebaseProvider.saveUser(vm.user, vm.film.id);
        }
        function addToFavorite() {
            if(!vm.user.favorites) {
                vm.user.favorites = [];
            }
            vm.user.favorites.push(vm.film.id);
            console.log(vm.user);
            firebaseProvider.saveUser(vm.user);
        }
        function addToWatchLater() {
            if(!vm.user.watchLater) {
                vm.user.watchLater = [];
            }
            vm.user.watchLater.push(vm.film.id);
            console.log(vm.user);
            firebaseProvider.saveUser(vm.user);
        }
    }
})();