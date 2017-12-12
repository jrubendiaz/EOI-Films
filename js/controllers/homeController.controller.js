(function() {
    'use strict';

    angular
        .module('EOIFilms')
        .controller('homeController', homeController);

    homeController.$inject = ['movieDBProvider'];
    function homeController(movieDBProvider) {
        var vm = this;
        //Variables
        vm.films = [];
        vm.total = 0;
        vm.pages = 0;
        vm.modal = 'inactive';
        vm.currentFilm = {};

        //Functions
        vm.activateModal = activateModal;
        activate();

        ////////////////

        function activate() {
            filmsPopular();
            console.log(vm.modal);
         }
         function setFilms(api_res) {
             api_res.then(res => {
                vm.films = res.films;
                vm.total = res.total;
                vm.pages = res.pages;
             })
         }
         function filmsDiscover() {
            setFilms(movieDBProvider.discover());
         }
         function filmsTopRated() {
            setFilms(movieDBProvider.topRated());
         }
         function filmsPopular() {
            setFilms(movieDBProvider.popular());
         }
         function activateModal(film) {
             vm.modal = 'active';
             vm.currentFilm = film;
             console.log(vm.modal, vm.currentFilm);
         }
    }
})();