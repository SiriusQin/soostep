/**
 * Created by Jesse Qin on 3/19/2016.
 */

var app = angular.module('admin');
var title = 'User Management';

app.controller('userManager', function ($scope, $http, $route) {
    document.title = title;

    $scope.createUser = function (user) {
        $http.post('/users', user).success(function (result) {
            if (!result.code) {
                $route.reload();
            }
        });
    };
});