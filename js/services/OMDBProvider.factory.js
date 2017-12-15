(function() {
    'use strict';

    angular
        .module('EOIFilms')
        .factory('OMDBProvider', OMDBProvider);

    OMDBProvider.$inject = ['$http'];
    function OMDBProvider($http) {
        var service = {
            getMovie:getMovie
        };

        //variables
        const api_key = "apikey=3370463f";
        const omdb_url = "http://www.omdbapi.com/?";

        return service;

        ////////////////

        function getMovie(id) {
            let aux_url = omdb_url + "i=" + id + "&" + api_key;
            return $http.get(aux_url).then(res => {
                return res.data;
            })
         }
    }
})();