
var app = angular.module('admin');
var title = 'Permission Management';

app.controller('PermissionManager', function ($scope, $http, $route) {
    document.title = title;

    $http.get('/permissions').success(function (result){
        $scope.Permissions = result;
    });

    $scope.Permission = {
        permissionType: 'test',
        name: '',
        featureHash: 'test',
        description: 'test'
    };

    $scope.createPermission = function (permission) {

        $http.post('/permissions', permission).success(function (result) {
            if (!result.code) {
                $route.reload();
            }
        });
    };

    $scope.deletePermission = function(_id){
        $http.delete('/permissions/' + _id).success(function (result) {
            if (result.code == 0) {
                $route.reload();
            }
        });
    };
});