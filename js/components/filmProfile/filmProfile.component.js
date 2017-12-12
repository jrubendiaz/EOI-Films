(function() {
    'use strict';

    // Usage:
    //
    // Creates:
    //

    angular
        .module('EOIFilms')
        .component('filmProfile', {
            templateUrl: '/js/components/filmProfile/filmProfile.html',
            controller: filmProfileController,
            controllerAs: 'vm',
            bindings: {
                film: '=',
            },
        });

    filmProfileController.$inject = ['movieDBProvider'];
    function filmProfileController(movieDBProvider) {
        var vm = this;
        //Variables
        vm.similarFilms = [];
        //Functions
        vm.runtimeCalc = runtimeCalc;



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
                    console.log(vm.film);
                })

                //Load similar films fo the current movie
                movieDBProvider.getSimilar(vm.film.id).then(movies => {
                    console.log(movies);
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
    }
})();