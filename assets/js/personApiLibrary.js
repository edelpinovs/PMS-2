var personModule = angular.module('PeopleManagerModule', []);

personModule.factory('PersonApiService', ['$rootScope', '$http', function($rootScope, $http) {

    var PersonApiService = {};
    var Private = {
        //url: 'http://localhost/personApi/data.json',
        url: 'http://interview.businessfacilitation.org/api/people'
    };
    Private.convertFromObjectToParams = function (json) {
        var p = [];
        for (var key in json) {
            if (json[key] !== undefined) {
                p.push(key + '=' + encodeURIComponent(json[key]));
            }
        }
        return p.join('&');
    };

    Private.encodeJsonToStringForPost = function (json) {
        if (json) {
            var query = JSON.stringify(json);
            return query;
        }
        else
            return '';
    };

    Private.sendRequest = function(url, method, contentType, data, successCall, errorCall, alwaysCall) {
        $http({
            method: method,
            url: url,
            data: data,
            headers: { 'Content-Type': contentType }
        }).then(function(data) {
            if (typeof data === "object") {
                if (data && data.status === 200) {
                    var dataContent = data.data;
                    if (successCall)
                        successCall(dataContent);
                }
                else if (errorCall)
                    errorCall(data.statusText);
            } else if (errorCall)
                errorCall(data);
        }).catch(function(errorMessage) {
            if (errorCall)
                errorCall(errorMessage);

        }).finally(function(){
            if (alwaysCall)
                alwaysCall();
        })
    };

    Private.mockCreateUniqueId = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };


    PersonApiService.getPersons = function(successCall, errorCall, alwaysCall) {
        //var url = APP_API_PATH + '/api/people';
        var url = Private.url;
        var post = Private.encodeJsonToStringForPost({});
        Private.sendRequest(url, 'GET', 'application/json', post, successCall, errorCall, alwaysCall);
    };

    PersonApiService.deletePerson = function(person, successCall, errorCall, alwaysCall) {
        var url = Private.url;
        var post = Private.encodeJsonToStringForPost(person);
        /**
         * Dont call api since doesn't support add
         */
        //Private.sendRequest(url, 'DELETE', 'application/json', post, successCall, errorCall, alwaysCall);
        successCall(person);
    };

    PersonApiService.addPerson = function(person, successCall, errorCall, alwaysCall) {
        var url = Private.url;
        var post = Private.encodeJsonToStringForPost(person);
        /**
         * Dont call api since doesn't support add
         */
        //Private.sendRequest(url, 'POST', 'application/json', post, successCall, errorCall, alwaysCall);
        person.id = Private.mockCreateUniqueId();
        successCall(person);
    };

    PersonApiService.updatePerson = function(person, successCall, errorCall, alwaysCall) {
        var url = Private.url;
        var post = Private.encodeJsonToStringForPost(person);
        /**
         * Dont call api since doesn't support update
         */
        //Private.sendRequest(url, 'PUT', 'application/json', post, successCall, errorCall, alwaysCall);
        successCall(person);
    };

    return PersonApiService;
}]);

personModule.factory('PersonService', ['$rootScope', 'PersonApiService', function($rootScope, PersonApiService) {
    var PersonService = {};

    PersonService.list = [];

    var findElementPositionById = function(id) {
        console.log(PersonService.list);
        const index = PersonService.list.findIndex(function(element) {
            return element.id === id;
        });
        console.log('index found ' + index);
        return index;
    };

    PersonService.loadPersonsAsync = function(successCall, errorCall, alwaysCall) {
        PersonApiService.getPersons(function(data) {
            PersonService.setList(data);
            successCall(data);
        }, errorCall, alwaysCall);
    };

    PersonService.addPersonAsync = function(person, successCall, errorCall, alwaysCall) {
        PersonApiService.addPerson(person, function(data) {
            PersonService.list.push(person);
            $rootScope.$broadcast('addPerson');
            successCall(data);
            alwaysCall();
        }, errorCall, alwaysCall);
    };

    PersonService.deletePersonAsync = function(person, successCall, errorCall, alwaysCall) {
        PersonApiService.deletePerson(person, function(data) {
            const position = findElementPositionById(person.id);
            if (position >= 0) {
                PersonService.list.splice(position, 1);
                $rootScope.$broadcast('deletePerson');
                successCall(data);
            }
            else
                errorCall('person id + ' + person.id + ' not found');
            alwaysCall();
        }, errorCall, alwaysCall);
    };

    PersonService.updatePersonAsync = function(person, successCall, errorCall, alwaysCall) {
        PersonApiService.updatePerson(person, function(data) {
            const position = findElementPositionById(person.id);
            if (position >= 0) {
                PersonService.list[position] = person;
                $rootScope.$broadcast('updatePerson');
                successCall(data);
            }
            else
                errorCall('person id + ' + person.id + ' not found');
            alwaysCall();
        }, errorCall, alwaysCall);
    };

    PersonService.setList = function(list) {
        PersonService.list = list;
        $rootScope.$broadcast('setPersonList');
    };

    return PersonService;
}]);