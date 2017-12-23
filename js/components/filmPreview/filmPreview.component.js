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
        vm.removeFromFavorite = removeFromFavorite;

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
        /* TODO --> IMPLEMENTAR */

        function removeFromFavorite(id) {
            console.log("Antes de borrar: " + vm.user)
            vm.user.favorites.find((fav, index) => {
                if(fav.id == id) {
                    delete vm.user.favorites[index];
                }
            })
            console.log("Después de borrar: " + vm.user);
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