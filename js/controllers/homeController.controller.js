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
        vm.genres = [];
        vm.title = "";
        vm.years = {};
        vm.yearSlider = {
            minValue: 2010,
            maxValue: 2017,
            options: {
                floor: 1979,
                ceil: 2017,
                step: 1,
            }
        };
        vm.imbdSlider = {
            minValue: 5,
            maxValue: 10,
            options: {
                floor: 0,
                ceil: 10,
                step: 1,
            }
        };
        vm.rottenSlider = {
            minValue: 0,
            maxValue: 100,
            options: {
                floor: 0,
                ceil: 100,
                step: 1,
            }
        };

        //Functions
        vm.activateModal = activateModal;
        vm.filmsTopRated = filmsTopRated;
        vm.filmsPopular = filmsPopular;
        vm.filmsDiscover = filmsDiscover;
        vm.setFilms = setFilms;
        vm.getMovies_byGenre = getMovies_byGenre;
        vm.getMovies_byTitle = getMovies_byTitle;
        vm.getMovies_byFilters = getMovies_byFilters;

        activate();

        ////////////////

        function activate() {
            filmsPopular();
            movieDBProvider.getGenres().then(genres => {
                vm.genres = genres;
            })
            vm.years = {
                first: vm.yearSlider.minValue,
                last: vm.yearSlider.maxValue
            }
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
         function getMovies_byGenre(genre_id) {
             setFilms(movieDBProvider.getMovies_byGenre(genre_id));
         }
         function getMovies_byTitle(title) {
             setFilms(movieDBProvider.getMovies_byTitle(title));
         }
         function getMovies_byFilters() {
            setFilms(movieDBProvider.getMovies_byFilters(vm.yearSlider.minValue, vm.yearSlider.maxValue, vm.imbdSlider.minValue, vm.imbdSlider.maxValue));
         }
         function activateModal(film) {
             vm.modal = 'active';
             vm.currentFilm = film;
             console.log(vm.modal, vm.currentFilm);
         }
    }
})();