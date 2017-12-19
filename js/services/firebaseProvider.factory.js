(function() {
    'use strict';

    angular
        .module('EOIFilms')
        .factory('firebaseProvider', firebaseProvider);

    firebaseProvider.$inject = ['$firebaseArray','$firebaseObject', '$firebaseAuth'];
    function firebaseProvider($firebaseArray, $firebaseObject, $firebaseAuth) {
        var service = {
            getAll: getAll,
            newUser: newUser,
            getUser: getUser,
            logout: logout,
            login: login,
            newUserToDatabase: newUserToDatabase,
            saveUser: saveUser,
        };

        return service;

        ////////////////
        function getAll() {
            var ref = firebase.database().ref().child('users');
            // download the data into a local object
            return $firebaseArray(ref);
        }
        function getUser(uid) {
            var ref = firebase.database().ref().child('users/'+uid);
            return $firebaseObject(ref);
        }
        function newUser(email, password) {
            return firebase.auth().createUserWithEmailAndPassword(email, password).then(res => {
                return res;
            }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                return (errorCode, errorMessage);
                // ...
              });
        }
        function newUserToDatabase(user) {
            let ref = firebase.database().ref().child('users/' + user.uid);
            let current_user = $firebaseObject(ref);

            current_user.email = user.email;
            current_user.uid = user.uid;
            current_user.$save().then(function(ref) {
              ref.key === current_user.$id; // true
            }, function(error) {
              console.log("Error:", error);
            });
        }
        function saveUser(user) {

            let current_user = user;

            current_user.$save().then(ref => {
                ref.key === current_user.$id;
            }, (error) => {
                console.log("Error en añadir:" + error);
            })
        }

        function login(email, password) {
            return firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                return errorMessage;
                // ...
              });
        }

        function logout() {
            return firebase.auth().signOut().then(function() {
                return true;
              }).catch(function(error) {
                return false;
              });
        }
    }
})();