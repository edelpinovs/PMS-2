var app = angular.module('PeopleManagerApp', ['ngRoute', 'PeopleManagerModule']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/index' , { templateUrl: 'assets/_templateView/list.html', controller: 'IndexController'}).
        when('/new', { templateUrl: 'assets/_templateView/new.html', controller: 'NewPersonController'})
        .otherwise({ redirectTo: '/index'});
}]);

app.controller('MainController', ['$scope', '$location', 'PersonService', function($scope, $location, PersonService) {
    $scope.init = function() {
        PersonService.loadPersonsAsync(function(data) {

        }, function(error) {
            $scope.error = { show: true, message: error };
        }, function () {
            $scope.loadingPersons = false;
        });
    };
}]);

app.controller('IndexController', ['$scope', '$location', 'PersonService', function($scope, $location, PersonService) {
    $scope.persons = [];

    $scope.$on('setPersonList', function() {
        $scope.persons = PersonService.list;
        console.log('setListListener');
    });

    $scope.$on('addPerson', function() {
        $scope.persons = PersonService.list;
        console.log('addListerner');
    });

    $scope.$on('deletePerson', function() {
        $scope.persons = PersonService.list;
        console.log('deleteListerner');
    });

    $scope.$on('updatePerson', function() {
        $scope.persons = PersonService.list;
        console.log('updateListerner');
    });

    $scope.init = function() {
        $scope.error = null;
        $scope.persons = PersonService.list;
        console.log(PersonService.list);
    };

    $scope.newPerson = function() {
        $location.path('/new');
    };

    $scope.editPerson = function(person) {
        $scope.personEditing = angular.copy(person);
        person.editing = true;
    };

    $scope.deletePerson = function(person) {
        $scope.error = null;
        $scope.success = null;
        if (person.editing) {
            person.editing = false;
            $scope.personEditing = null;
        }
        else {
            if (confirm('Are you sure to remove this person, all data will be erased?')) {
                $scope.updating = true;
                PersonService.deletePersonAsync(person, function() {
                    $scope.success = { show: true, message: 'Person deleted successfully.' };
                }, function(error) {
                    $scope.error = { show: true, message: error };
                }, function() {
                    $scope.updating = false;
                });
            }
        }
    };

    $scope.savePerson = function(person) {
        $scope.error = null;
        $scope.success = null;
        if ($scope.personEditInline.$valid) {
            $scope.updating = true;
            PersonService.updatePersonAsync($scope.personEditing, function() {
                $scope.success = { show: true, message: 'Update successfully.' };
            }, function(error) {
                $scope.error = { show: true, message: error };
            }, function() {
                $scope.updating = false;
            });
        }
        else {
            $scope.error = { show: true, message: 'Invalid fields, please check all fields an try again' };
        }
    };
}]);

app.controller('NewPersonController', ['$scope', '$location', 'PersonService', function($scope, $location, PersonService) {

    $scope.init = function() {

    };

    $scope.cancel = function() {
        $location.path('/index');
    };

    $scope.save = function() {
        if ($scope.personForm.$valid) {
            $scope.saving = true;
            PersonService.addPersonAsync($scope.person, function(data) {
                $location.path('/index');
            }, function(error) {
                $scope.error = { show: true, message: error };
            }, function() {
                $scope.saving = false;
            });
        }
        else {
            $scope.error = { show: true, message: 'Invalid fields, please check all fields an try again' };
        }
    };
}]);