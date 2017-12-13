(function() {
    'use strict';

    angular
        .module('EOIFilms')
        .controller('homeController', homeController);

    homeController.$inject = ['movieDBProvider', '$window', '$document', '$timeout'];
    function homeController(movieDBProvider, $window, $document, $timeout) {
        var vm = this;
        //Variables
        vm.films_element = document.querySelector('body');
        vm.films = [];
        vm.total = 0;
        vm.pages = 0;
        vm.page = 1;
        vm.modal = 'inactive';
        vm.currentFilm = {};
        vm.genres = [];
        vm.title = "";
        vm.years = {};
        vm.timeoutID;
        vm.time = 100;
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
        vm.getFilms = getFilms;
        vm.setFilms = setFilms;

        activate();

        ////////////////

        function activate() {
            $window.addEventListener('scroll', lazyLoad);

            getFilms("topRated", "");
            movieDBProvider.getGenres().then(genres => {
                vm.genres = genres;
            })
            vm.years = {
                first: vm.yearSlider.minValue,
                last: vm.yearSlider.maxValue
            }
         }
         function lazyLoad(e) {
            let films_container_height = vm.films_element.clientHeight;
            let currentPosition = window.innerHeight + window.scrollY;
            let bottomPosition = document.body.offsetHeight;
            if (currentPosition >= bottomPosition) {
                window.clearTimeout(vm.timeoutID);
                vm.page++;
                vm.timeoutID = window.setTimeout(getFilms(vm.current_cat, vm.current_ref || ""), 1500);
            }
         }
         function changePreviewState() {
             let time = 100;
             let increment = 200;
             vm.films.forEach((film, index) => {
                if((index % 20) == 0 && index != 0) {
                    time = time - (increment*20);
                }
                time = time + increment;
                $timeout(() => {film.state = "in"}, time);
             })
         }
         function setFilms(api_res) {
             api_res.then(res => {
                (vm.page == 1) ? vm.films = [] : ""

                res.films.forEach(film => {
                    let aux_film = {
                        state: "",
                        ...film,
                    }
                    vm.films.push(aux_film);
                })
                vm.total = res.total;
                vm.pages = res.pages;
                changePreviewState();
             })
         }
         function getFilms(cat, ref) {
             vm.current_cat = cat;
             vm.current_ref = ref || "";
             switch (cat) {
                case "discover":
                    setFilms(movieDBProvider.discover(vm.page));
                    break;
                case "topRated":
                    setFilms(movieDBProvider.topRated(vm.page));
                    break;
                case "popular":
                    setFilms(movieDBProvider.popular(vm.page));
                    break;
                case "upcoming":
                    setFilms(movieDBProvider.upcoming(vm.page));
                    break;
                case "byGenre":
                    setFilms(movieDBProvider.getMovies_byGenre(ref, vm.page));
                    break;
                case "byTitle":
                    setFilms(movieDBProvider.getMovies_byTitle(ref, vm.page));
                    break;
                case "byFilters":
                    let filters = {
                        y_first: vm.yearSlider.minValue,
                        y_last: vm.yearSlider.maxValue,
                        i_first: vm.imbdSlider.minValue,
                        i_last: vm.imbdSlider.maxValue,
                    }
                    setFilms(movieDBProvider.getMovies_byFilters(filters, vm.page));
                    break;
                 default:
                     break;
             }
         }
         function activateModal(film) {
             vm.modal = 'active';
             vm.currentFilm = film;
         }
    }
})();