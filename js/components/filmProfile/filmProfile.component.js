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

    filmProfileController.$inject = ['localStorageProvider', 'movieDBProvider', 'OMDBProvider', '$sce'];
    function filmProfileController(localStorageProvider, movieDBProvider, OMDBProvider ,$sce) {
        var vm = this;

        //Variables
        vm.similarFilms = [];
        //Functions
        vm.runtimeCalc = runtimeCalc;
        vm.trustInUrl = trustInUrl;
        vm.add_favorites = add_favorites;

        ////////////////

        vm.$onInit = function() {
            let aux_movie = vm.film;
            if(vm.film.id) {
                //Load details of the current movie
                movieDBProvider.getMovie(vm.film.id).then(movie => {
                    vm.film = {
                        year: movie.release_date.split("-")[0],
                        ...aux_movie,
                        ...movie,
                    };
                    addRatings();
                })

                //Load similar films fo the current movie
                movieDBProvider.getSimilar(vm.film.id).then(movies => {
                    vm.similarFilms = movies.films.slice(0, 4);
                })
            }
        };
        vm.$onChanges = function(changesObj) { };
        vm.$onDestroy = function() { };

        //Calc duration of the film
        function runtimeCalc(runtime) {
            let h = Math.floor(runtime/60);
            let m = runtime % 60;
            return h + 'h' + m + ' m';
        }
        //Adding ratings and trailers to the movies
        function addRatings() {
            OMDBProvider.getMovie(vm.film.imdb_id).then(movie => {
                vm.film.ratings = movie.Ratings;
                getTrailers();
            })
        }
        function trustInUrl(url) {
            return $sce.trustAsResourceUrl(url);
        }

        function getTrailers() {
            movieDBProvider.getTrailers(vm.film.id).then(res => {
                if(res[0].key) {
                    let trailer = "https://www.youtube.com/embed/" + res[0].key;
                    vm.film.trailer = trailer;
                }
            })
        }

        function get_favorites() {
            return localStorageProvider.get('fav');
        }

        function add_favorites(fav) {
            let favorites = get_favorites();
            favorites.push(fav);
            localStorageProvider.set('fav', fav);
        }
    }
})();