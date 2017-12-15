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
        vm.films = [{}, {}, {}];
        vm.filmsState = "unload";
        vm.config = {
            filters: [],
            arrgs:  [],
            page: 1,
        }
        vm.total = 0;
        vm.pages = 0;
        vm.page = 1;
        vm.modal = 'inactive';
        vm.currentFilm = {};
        vm.genres = [];
        vm.selected_genres = [];
        vm.title = "";
        vm.years = {};
        vm.timeoutID;
        vm.time = 100;
        vm.current_sort = "popularity.desc";

        //Functions
        vm.activateModal = activateModal;
        vm.getFilms = getFilms;
        vm.setFilms = setFilms;
        vm.newSearch = newSearch;
        vm.addSelectedGenres = addSelectedGenres;
        vm.handleDates = handleDates;
        vm.handleValoration = handleValoration;
        vm.setArrgs = setArrgs;
        vm.sortBy = sortBy;

        vm.yearSlider = {
            minValue: 2010,
            maxValue: 2017,
            options: {
                floor: 1979,
                ceil: 2017,
                step: 1,
                onEnd: vm.handleDates,
            }
        };
        vm.imbdSlider = {
            minValue: 5,
            maxValue: 10,
            options: {
                floor: 0,
                ceil: 10,
                step: 1,
                onEnd: vm.handleValoration,
            }
        };
        vm.config.filters = [
            {
                name: "sort_by",
                value: "popularity.desc"
            }
        ];
        vm.sorters = [
            {
                value: "popularity.asc",
                display: "Popularidad Ascendente"
            },
            {
                value: "popularity.desc",
                display: "Popularidad Descendente"
            },
            {
               value: "release_date.asc",
               display: "Lanzamiento Ascendente"
            },
            {
                value: "release_date.desc",
                display: "Lanzamiento Descendente"
             },
             {
                 value: "vote_average.asc",
                 display: "Valoración Ascendente"
             },
             {
                value: "vote_average.desc",
                display: "Valoración Descendente"
             },
             {
                 value: "vote_count.asc",
                 display: "Número de votos Ascendente"
             },
             {
                 value: "vote_count.desc",
                 display: "Número de votos Descendente"
             }
        ]

        vm.config.arrgs = ["discover", "movie"];

        activate();

        ////////////////

        function activate() {
            $window.addEventListener('scroll', lazyLoad);

            //getFilms("topRated", "");
            vm.config.page = vm.page;
            setFilms(movieDBProvider.getFilms(vm.config));
            movieDBProvider.getGenres().then(genres => {
                vm.genres = genres;
                vm.genres.forEach(gen => {
                    gen.state = "no-selected";
                })
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
                vm.config.page++;
                vm.timeoutID = window.setTimeout(getFilms, 1500);
            }
         }
         function changePreviewState() {
             let time = 20;
             let increment = 20;
             vm.films.forEach((film, index) => {
                if((index % 20) == 0 && index != 0) {
                    time = time - (increment*20);
                }
                //time = time + increment;
                $timeout(() => {film.state = "animated fadeIn"}, time);
             })
         }
         function setFilms(api_res) {
             vm.filmsState = 'unload';
             api_res.then(res => {
                (vm.config.page == 1) ? vm.films = [] : ""

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
         function newSearch() {
            vm.films = [];
            getFilms();
         }

         function handleDates() {
            vm.films = [];
             let min_year = vm.yearSlider.minValue + "-01-01";
             let max_year = vm.yearSlider.maxValue + "-12-31";
             let release_dateMIN = {
                 name: "release_date.gte",
                 value: min_year
             };
             let release_dateMAX = {
                 name: "release_date.lte",
                 value: max_year
             }
             let min = vm.config.filters.find(f => f.name == release_dateMIN.name);
             min ? min.value = release_dateMIN.value : vm.config.filters.push(release_dateMIN);

             let max = vm.config.filters.find(f => f.name == release_dateMAX.name);
             max ? max.value = release_dateMAX.value : vm.config.filters.push(release_dateMAX);

             getFilms();
         }
         function handleValoration() {
            vm.films = [];
            let min_val = {
                 name: "vote_average.gte",
                 value: vm.imbdSlider.minValue
            };
            let max_val = {
                name: "vote_average.lte",
                value: vm.imbdSlider.maxValue
            }

            let min = vm.config.filters.find(f => f.name == min_val.name);
            min ? min.value = min_val.value : vm.config.filters.push(min_val);

            let max = vm.config.filters.find(f => f.name == max_val.name);
            max ? max.value = max_val.value : vm.config.filters.push(max_val)

            getFilms();
         }

        function sortBy() {
            vm.films = [];
            let sortBy = {
                name: "sort_by",
                value: vm.current_sort
            };
            let sort = vm.config.filters.find(f => f.name == sortBy.name);
            console.log(sort);
            sort ? sort.value = sortBy.value : vm.config.filters.push(sortBy);

            getFilms();
        }
         function getFilms() {
             setFilms(movieDBProvider.getFilms(vm.config));
         }

         function setArrgs(arrgs) {
            vm.films = [];
            vm.config.arrgs = arrgs.split("-");
            getFilms();
         }

         function activateModal(film) {
             vm.modal = 'active';
             vm.currentFilm = film;
         }
         function addSelectedGenres(genre) {
             vm.films = [];
            (genre.state == "selected") ? genre.state = "no-selected" : genre.state = "selected";
            vm.selected_genres = [];
            vm.genres.forEach(g => {
                (g.state == "selected") ? vm.selected_genres.push(g.id) : "";
            })
            let with_genres = {
                name: "with_genres",
                value: vm.selected_genres
            };
            vm.config.filters.push(with_genres);
            getFilms();
         }
    }
})();