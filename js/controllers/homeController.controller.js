(function() {
    'use strict';

    angular
        .module('EOIFilms')
        .controller('homeController', homeController);

    homeController.$inject = [];
    function homeController() {
        var vm = this;
        vm.films = [];
        var fakeFilm = {
            Poster: "https://images-na.ssl-images-amazon.com/images/M/MV5BMTg2MzI1MTg3OF5BMl5BanBnXkFtZTgwNTU3NDA2MTI@._V1_SX300.jpg",
            Title: "Guardians of the Galaxy Vol. 2",
            RottenTomatoes: "83%",
            InternetMovieDB: "7.8/10",
            MetaCritic: "67/100"
        }


        activate();

        ////////////////

        function activate() {
            vm.films.push(fakeFilm);
         }
    }
})();