/**
 * Created by Jesse Qin on 3/19/2016.
 */

var app = angular.module('admin');
var title = 'Role List';

app.controller('roles', function ($scope) {
    document.title = title;

    $scope.roleCollection = [
        {Name: 'Role1', Permissions: ['Role1-Permission1', 'Role1-Permission2']},
        {Name: 'Role2', Permissions: ['Role2-Permission1', 'Role2-Permission2']}
    ]
});