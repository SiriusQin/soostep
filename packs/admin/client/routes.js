/**
 * Created by xz_liu on 2016/3/9.
 */
var app = angular.module('admin', ['ngRoute', 'ngFileUpload']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/good', {
            controller: 'Good',
            templateUrl: 'pages/admin_good.html'
        })
        .when('/dic', {
            controller: 'Dic',
            templateUrl: 'pages/admin_dic.html'
        }).
        when('/users', {
            controller: 'UserManager',
            templateUrl: 'pages/user_manager.html'
        }).
        when('/permission', {
            controller: 'PermissionManager',
            templateUrl: 'pages/admin_permission.html'
        }).
        otherwise({
            redirectTo: '/good'
        });
});