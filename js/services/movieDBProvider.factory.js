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
            getMovie: getMovie,
            getSimilar: getSimilar,
            getGenres: getGenres,
            getMovies_byGenre: getMovies_byGenre,
            getMovies_byTitle: getMovies_byTitle,
            getMovies_byFilters: getMovies_byFilters,
        };
        const api_key = "api_key=4d664496ab97da469473483e9aa045d6";
        var section = ""
        const base_url = "https://api.themoviedb.org/3/";
        var films = [];
        var aux_film = {};
        var aux_res = {};


        return service;

        ////////////////
        function getGenres() {
            let aux_url = base_url + "genre/movie/list?" + api_key + "&language=es";
            let genres = [];
            return $http.get(aux_url).then(res => {
                return res.data.genres;
            })
        }
        function getMovies_by(url_by) {
            films = [];
            return $http.get(url_by).then(res => {

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
        function getMovies_byFilters(y_first, y_last, i_first, i_last){
            let aux_url = base_url + "discover/movie?" + api_key + "&sort_by=popularity.desc&include_adult=false&page=1&primary_release_date.gte=" + y_first + "-01-01&primary_release_date.lte=" + y_last + "-12-30&vote_count.gte=500&vote_average.gte=" + i_first+"&vote_average.lte=" + i_last;
            return getMovies_by(aux_url);
        }
        function getMovies_byTitle(title) {
            let aux_url = base_url + "search/movie?" + api_key + "&query=" + title;
            return getMovies_by(aux_url);
        }
        function getMovies_byGenre(genre_id) {
            let aux_url = base_url + "genre/" + genre_id + "/movies?" + api_key;
            return getMovies_by(aux_url);
        }

        function getMovies(section) {
            let aux_url = base_url+"movie/"+section+"?page=1&"+api_key;
            films = [];
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
        function getMovie(id) {
            let aux_url = base_url+"movie/"+id+"?"+api_key;
            console.log(aux_url);
            return $http.get(aux_url).then(res => {
                return res.data;
            })
        }

        // ¡¡¡¡¡¡DRY!!!!!! -> TODO
        function getSimilar(id) {
            let aux_url = base_url + "movie/" + id + "/similar?" + api_key;
            films = [];
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

        // ¡¡¡¡¡DRY!!!!! -> TODO
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