(function() {
    'use strict';

    angular
        .module('EOIFilms')
        .controller('homeController', homeController);

    homeController.$inject = ['movieDBProvider'];
    function homeController(movieDBProvider) {
        var vm = this;
        vm.films = [];
        vm.total = 0;
        vm.pages = 0;

        activate();

        ////////////////

        function activate() {
            movieDBProvider.discover().then(res => {
                vm.films = res.films;
                vm.total = res.total;
                vm.pages = res.pages;
            });

         }
    }
})();