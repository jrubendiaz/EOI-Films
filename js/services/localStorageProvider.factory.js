(function() {
    'use strict';

    angular
        .module('EOIFilms')
        .factory('localStorageProvider', localStorageProvider);

    localStorageProvider.$inject = [];
    function localStorageProvider() {
        var service = {
            get:get,
            set: set
        };

        return service;

        ////////////////
        function get(list) {
            if(localStorage.getItem(list)) {
                return JSON.parse(localStorage.getItem(list));
            }
            return [];
        }
        function set(list, arrgs) {
            let pre = get(list);

            pre.push(arrgs);
            pre = JSON.stringify(pre);

            localStorage.setItem(list, pre);
        }
    }
})();