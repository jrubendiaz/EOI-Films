(function() {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('EOIFilms')
        .component('filmProfile', {
            templateUrl: 'js/components/filmProfile/filmProfile.html',
            controller: filmProfileController,
            controllerAs: 'vm',
            bindings: {
                film: '=',
            },
        });

    filmProfileController.$inject = ['movieDBProvider', '$sce'];
    function filmProfileController(movieDBProvider ,$sce) {
        var vm = this;
        //Variables
        vm.similarFilms = [];
        //Functions
        vm.runtimeCalc = runtimeCalc;
        vm.trustInUrl = trustInUrl;



        ////////////////

        vm.$onInit = function() {
            let aux_movie = vm.film;
            if(vm.film.id) {

                //Load details of the current movie
                movieDBProvider.getMovie(vm.film.id).then(movie => {
                    vm.film = {
                        ...aux_movie,
                        ...movie,
                    };
                    addRatings();
                })

                //Load similar films fo the current movie
                movieDBProvider.getSimilar(vm.film.id).then(movies => {
                    vm.similarFilms = movies.films.slice(0, 6);
                })
            }
        };
        vm.$onChanges = function(changesObj) { };
        vm.$onDestroy = function() { };

        function runtimeCalc(runtime) {
            let h = Math.floor(runtime/60);
            let m = runtime % 60;
            return h + ' horas y ' + m + ' minutos';
        }
        function addRatings() {
            movieDBProvider.getMovie_OMDB(vm.film.imdb_id).then(movie => {
                vm.film = {
                    ...vm.film,
                    ratings: movie.Ratings,
                }
                getTrailers();
            })
        }
        function trustInUrl(url) {
            return $sce.trustAsResourceUrl(url);
        }
        function getTrailers() {
            movieDBProvider.getTrailers(vm.film.id).then(res => {
                let trailer = "https://www.youtube.com/embed/" + res[0].key;
                vm.film = {
                    ...vm.film,
                    trailer: trailer,
                }
            })
        }
    }
})();