(function() {
    'use strict';

    angular
        .module('EOIFilms')
        .factory('movieDBProvider', movieDBProvider);

    movieDBProvider.$inject = ['$http'];
    function movieDBProvider($http) {
        var service = {
            getSimilar: getSimilar,
            getGenres: getGenres,
            getTrailers: getTrailers,
            getFilms: getFilms,
            getMovie: getMovie
        };
        const api_key = "api_key=4d664496ab97da469473483e9aa045d6";
        var section = ""
        const v = "3";
        const base_url = "https://api.themoviedb.org/" + v;

        var films = [];
        var aux_film = {};
        var aux_res = {};

        var default_arrgs = ['discover', 'movie'];
        var default_filters = [
            {
                name: "vote_average.gte",
                value: 0
            },
            {
                name: "vote_average.lte",
                value: 10
            },
            {
                name: "release_date.gte",
                value: "1800-01-01"
            },
            {
                name: "release_date.lte",
                value: "2030-01-01"
            },
            {
                name: "sort-by",
                value: "popularity.desc"
            },
            {
                name: "with_genres",
                value: ""
            }
        ];


        return service;

        ////////////////
        function buildURL(arrgs, filters, page) {
            let aux_url = base_url;
            let aux_arrgs = "";
            let filters_string = "";
            let aux_filters = filters || default_filters;
            let aux_page = "&page=" + page;

            arrgs.forEach(arr => {
                aux_arrgs += "/" + arr;
            })

            aux_filters.forEach((fil, index) => {
                let op = "";
                (index == 0) ? op = "?" : op = "&"
                filters_string += op + fil.name + "=" + fil.value;
            })

            aux_url += aux_arrgs + filters_string + "&" + api_key + aux_page;
            return aux_url;
        }

        function getFilms(config) {
            let arrgs = config.arrgs || default_arrgs;
            let filters = config.filters || default_filters;
            let page = config.page || 1;
            let films = [];
            let final_url = buildURL(arrgs, filters, page);

            return $http.get(final_url).then(res => {
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
        function getGenres() {
            let aux_url = base_url + "/genre/movie/list?" + api_key + "&language=es";
            let genres = [];
            return $http.get(aux_url).then(res => {
                return res.data.genres;
            })
        }
        function getTrailers(id) {
            let aux_url = base_url + "/movie/" + id + "/videos?" + api_key;
            return $http.get(aux_url).then(res => {
                return res.data.results;
            })
        }
        function getMovie(id) {
            let aux_url = base_url + "/movie/" + id + "?" + api_key;
            return $http.get(aux_url).then(res => {
                return res.data;
            })
        }
        function getSimilar(id) {
            let aux = {};
            aux.arrgs = ['movie', id, 'similar'];
            return getFilms(aux);
        }
    }
})();