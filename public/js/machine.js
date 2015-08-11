'use strict';
var app = angular.module("drinkMachine", ["drinks-directive"])
    .controller("MachineController", ['$scope', function($scope) {
    }]);

app.factory('socket', ['$rootScope', '$q', function ($rootScope, $q) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            var deferred = $q.defer();
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    deferred.resolve(args[0]);
                    callback.apply(socket, args);
                });
            });
            return deferred.promise;
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
}]);
