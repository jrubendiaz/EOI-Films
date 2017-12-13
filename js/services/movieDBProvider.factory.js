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
            upcoming: upcoming,
            getMovie: getMovie,
            getSimilar: getSimilar,
            getGenres: getGenres,
            getMovies_byGenre: getMovies_byGenre,
            getMovies_byTitle: getMovies_byTitle,
            getMovies_byFilters: getMovies_byFilters,
            getMovie_OMDB: getMovie_OMDB,
            getTrailers: getTrailers,
        };
        const api_key = "api_key=4d664496ab97da469473483e9aa045d6";
        var section = ""
        const base_url = "https://api.themoviedb.org/3/";
        const omdb_key = "apikey=3370463f";
        const omdb_url = "http://www.omdbapi.com/?";
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
        function getMovies_byFilters(filters, page){
            let aux_url = base_url + "discover/movie?" + api_key + "&sort_by=popularity.desc&include_adult=false&page=" + page + "&primary_release_date.gte=" + filters.y_first + "-01-01&primary_release_date.lte=" + filters.y_last + "-12-30&vote_count.gte=500&vote_average.gte=" + filters.i_first+"&vote_average.lte=" + filters.i_last;
            return getMovies_by(aux_url);
        }
        function getMovies_byTitle(title, page) {
            let aux_url = base_url + "search/movie?" + api_key + "&query=" + title + "&page=" + page;
            return getMovies_by(aux_url);
        }
        function getMovies_byGenre(genre_id, page) {
            let aux_url = base_url + "genre/" + genre_id + "/movies?" + api_key + "&page=" + page;
            return getMovies_by(aux_url);
        }
        function getMovies(section, page) {
            let aux_url = base_url+"movie/"+section+"?page=" + page + "&"+api_key;
            return getMovies_by(aux_url);
        }
        function topRated(page) {
            return getMovies("top_rated", page);
        }
        function popular(page) {
            return getMovies("popular", page);
        }
        function upcoming(page) {
            return getMovies("upcoming", page);
        }
        function getMovie_OMDB(id) {
            let aux_url = omdb_url + "i=" + id + "&" + omdb_key;
            return $http.get(aux_url).then(res => {
                return res.data;
            })
        }
        function getTrailers(id) {
            let aux_url = base_url + "movie/" + id + "/videos?" + api_key;
            return $http.get(aux_url).then(res => {
                console.log(res.data.results);
                return res.data.results;
            })
        }
        function getMovie(id) {
            let aux_url = base_url+"movie/"+id+"?"+api_key;
            return $http.get(aux_url).then(res => {
                return res.data;
            })
        }

        // ¡¡¡¡¡¡DRY!!!!!! -> TODO
        function getSimilar(id) {
            let aux_url = base_url + "movie/" + id + "/similar?" + api_key;
            return getMovies_by(aux_url);
        }

        // ¡¡¡¡¡DRY!!!!! -> TODO
        function discover() {
            section = "discover";
            let discover_url = base_url+section+"/movie?page=1&"+api_key;
            return getMovies_by(discover_url);
        }
    }
})();