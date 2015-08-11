'use strict';
angular.module('drinks-directive', [])
    .controller("DrinkController", ['$scope', 'socket', function($scope, socket) {
        $scope.drinks = [];
        socket.on('update', function (data) {
            console.log('update: ' + data)
        }).then(function(data) {
            console.log("promise: " + data);
            $scope.drinks = JSON.parse(data);
        });

        this.buttonClick = function() {
            socket.emit('testdata');
        };
    }])
    .directive("drinkItem", function () {
        return {
            template: "Name: {{drink.name}} || Number: {{drink.num}}"
        };
    });
