(function() {
    'use strict';

    angular
        .module('EOIFilms')
        .controller('homeController', homeController);

    homeController.$inject = ['movieDBProvider', '$window', '$document', '$timeout', 'localStorageProvider', 'firebaseProvider', '$location'];
    function homeController(movieDBProvider, $window, $document, $timeout, localStorageProvider, firebaseProvider, $location) {
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
        vm.userProfile = false;
        vm.user = {
            email: "",
            favorites: "",
            watchLater: "",
        };
        vm.flag = false;


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
        vm.showUserProfile = showUserProfile;
        vm.loadUserMovies = loadUserMovies;
        vm.resetFilters = resetFilters;
        vm.logout = logout;
        vm.goLogin = goLogin;

        vm.yearSlider = {
            minValue: 1979,
            maxValue: 2017,
            options: {
                floor: 1979,
                ceil: 2017,
                step: 1,
                onEnd: vm.handleDates,
            }
        };
        vm.imbdSlider = {
            minValue: 0,
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

            loadUserInfo();

            //getFilms("topRated", "");
            vm.config.page = vm.page;
            setFilms(movieDBProvider.getFilms(vm.config));
            movieDBProvider.getGenres().then(genres => {
                vm.genres = genres;
                vm.genres.forEach(gen => {
                    gen.state = "no-selected";
                    gen.name = gen.name.split(" ")[0];
                })
            })

            vm.years = {
                first: vm.yearSlider.minValue,
                last: vm.yearSlider.maxValue
            }

            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                  console.log(user);
                  vm.user = firebaseProvider.getUser(user.uid);
                  console.log(vm.user);
                  vm.user.email = user.email;
                  //firebaseProvider.saveUser(vm.user);
                  console.log(vm.user);
                } else {
                  console.log("No hay usuario logueado");
                }
              });

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
            let time = 0;
            let increment = 0;
            let aux_index = "ini";


            vm.films.forEach((film, index) => {
                if((index % 20) == 0 && index != 0) {
                    vm.flag = true;
                    time = time - (increment*20);
                }
                    $timeout(() => {film.state = "animated fadeIn"}, time);
             })
         }
         function setFilms(api_res) {
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
            let query = {
                name: "query",
                value: vm.title
            };
            let search = vm.config.filters.find(f => f.name == query.name);
            search ? search.value = query.value : vm.config.filters.push(query);

            if(query.value.length > 2) {
                vm.films = [];
                vm.config.arrgs = ["search", "movie"];
                window.clearTimeout(vm.timeoutID);
                vm.timeoutID = window.setTimeout(getFilms, 1000);
            }
            if(query.value.length == 0) {
                vm.config.arrgs = ["discover", "movie"];
                getFilms();
            }
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

             vm.config.arrgs = ["discover", "movie"];
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

            vm.config.arrgs = ["discover", "movie"];
            getFilms();
         }

        function sortBy() {
            vm.films = [];
            let sortBy = {
                name: "sort_by",
                value: vm.current_sort
            };
            let sort = vm.config.filters.find(f => f.name == sortBy.name);
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
             if(genre == "") {
                 vm.genres.forEach(g => {
                     g.state = "no-selected";
                 })
                 return
             }
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
            vm.config.arrgs = ["discover", "movie"];
            getFilms();
         }

         /* TODO --> SEPARAR USERPROFILE COMPONENT */
         function loadUserMovies(ids) {
            vm.user.movies = [];
            ids.forEach(id => {
                movieDBProvider.getMovie(id).then(movie => {
                    vm.user.movies.push(movie);
                })
            })
         }

         function loadUserInfo() {
             /*
            vm.user.favorites = localStorageProvider.get('favorites');
            vm.user.watched = localStorageProvider.get('watched');
            vm.user.watchLater = localStorageProvider.get('watchLater');
            */
         }

         function showUserProfile(list) {
             vm.userProfile = !vm.userProfile;
             if(vm.userProfile) {
                 loadUserInfo();
                 loadUserMovies(vm.user.favorites);
             }
         }
         function resetFilters() {
             vm.config.filters = [
                {
                    name: "sort_by",
                    value: "popularity.desc"
                }
            ];
            vm.selected_genres = [];
            vm.addSelectedGenres("");
            vm.yearSlider = {
                minValue: 1979,
                maxValue: 2017,
                options: {
                    floor: 1979,
                    ceil: 2017,
                    step: 1,
                    onEnd: vm.handleDates,
                }
            };
            vm.imbdSlider = {
                minValue: 0,
                maxValue: 10,
                options: {
                    floor: 0,
                    ceil: 10,
                    step: 1,
                    onEnd: vm.handleValoration,
                }
            };
             getFilms();
         }
         function logout() {
             firebaseProvider.logout();
             vm.user = {};
         }

         function goLogin() {
             $location.path("/login");
         }
    }
})();