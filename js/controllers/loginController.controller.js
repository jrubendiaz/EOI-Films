(function() {
    'use strict';

    angular
        .module('EOIFilms')
        .controller('loginController', loginController);

    loginController.$inject = ['firebaseProvider', '$location'];
    function loginController(firebaseProvider, $location) {
        var vm = this;

        //Variables
        vm.user = {
            email: "",
            password: ""
        };
        vm.errorMessage = "Introduce tu email y tu contraseña";

        //Functions
        vm.login = login;



        activate();

        ////////////////

        function activate() {
            let kk = firebaseProvider.getAll();
            console.log(kk);

            let login = firebaseProvider.login("jj.rubendiaz@gmail.com", "123456");
            login.then(res => {

            })
        }
        function login() {
            console.log("Llego");
            if(vm.user.email == "" || vm.user.password == "") {
                vm.errorMessage = "Introduce todos los datos";
            }
            let user_loged = firebaseProvider.login(vm.user.email, vm.user.password);
            user_loged
                .then(user_firebase => {
                    let user_database = firebaseProvider.getUser(user_firebase.uid);
                    console.log(user_database);
                    $location.path("/");
                })
                .catch(error => {
                    vm.errorMessage = error.message;
                })
        }
    }
})();