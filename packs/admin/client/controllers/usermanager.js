/**
 * Created by Jesse Qin on 3/19/2016.
 */

var app = angular.module('admin');
var title = 'User Management';

app.controller('userManager', function ($scope, $http, $route) {
    document.title = title;

    $http.get('/roles').success(function (result){
        $scope.roles = result;
    });

    $scope.userName = '';
    $scope.selectedRoleName = '';

    $scope.createUser = function () {

        console.log('Create User');
        console.log($scope.userName);
        console.log($scope.selectedRoleName);

        var name = $scope.userName;
        var roleName = $scope.selectedRoleName;

        /*$http.post('/users', user).success(function (result) {
            if (!result.code) {
                $route.reload();
            }
        });*/
    };
});

app.controller('userIndex', function($scope, $http, $route){

    $http.get('/users').success(function (result) {
        $scope.users = result;
    });
});