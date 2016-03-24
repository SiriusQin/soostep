/**
 * Created by Jesse Qin on 3/19/2016.
 */

var app = angular.module('admin');
var title = 'User Management';

app.controller('UserManager', function ($scope, $http, $route) {
    document.title = title;

    $http.get('/roles').success(function (result){
        $scope.Roles = result;
    });

    $scope.User = {
        userName: ''
    };

    $scope.createUser = function (User) {

        /*$http.post('/users', user).success(function (result) {
            if (!result.code) {
                $route.reload();
            }
        });*/
    };
});