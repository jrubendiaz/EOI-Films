(function() {
    'use strict';

    angular
        .module('EOIFilms')
        .factory('movieDBProvider', movieDBProvider);

    movieDBProvider.$inject = ['$http'];
    function movieDBProvider($http) {
        var service = {
            discover:discover,
            topRated: topRated,
            popular: popular,
        };
        const api_key = "api_key=4d664496ab97da469473483e9aa045d6";
        var section = ""
        const base_url = "https://api.themoviedb.org/3/";
        var films = [];
        var aux_film = {};
        var aux_res = {};


        return service;

        ////////////////
        function getMovies(section) {
            let aux_url = base_url+"movie/"+section+"?page=1&"+api_key;
            console.log(aux_url);
            return $http.get(aux_url).then(res => {

                res.data.results.forEach(film => {
                    aux_film = {
                        id: film.id,
                        title: film.title,
                        poster: "https://image.tmdb.org/t/p/w640/"+film.poster_path,
                        ratings: [],
                        ...film
                    }
                    films.push(aux_film);
                })

                aux_res.total = res.data.total_results;
                aux_res.pages = res.data.total_pages;
                aux_res.films = films;
                return aux_res;
            })
        }
        function topRated() {
            return getMovies("top_rated");
        }
        function popular() {
            return getMovies("popular");
        }
        function discover() {
            section = "discover";
            let discover_url = base_url+section+"/movie?page=1&"+api_key;

            return $http.get(discover_url).then(res => {
                res.data.results.forEach(film => {
                    aux_film = {
                        id: film.id,
                        title: film.title,
                        poster: "https://image.tmdb.org/t/p/w640/"+film.poster_path,
                        ratings: [],
                    }
                    films.push(aux_film);
                })
                aux_res.total = res.data.total_results;
                aux_res.pages = res.data.total_pages;
                aux_res.films = films;
                return aux_res;
            })
        }
    }
})();