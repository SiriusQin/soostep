/**
 * Created by xz_liu on 2016/3/14.
 */

// 需要替换为服务器地址
var socket = io.connect('http://localhost:3000/');

socket.on('notify', function (data) {
    $("#socketinfo")
        .html('<div class="btn btn-success" style="position:fixed;">' + data.msg + '</div>').fadeIn(3000, function () {
        $("#socketinfo").fadeOut(1000);
    });
});
/**
 * Created by xz_liu on 2016/3/9.
 */
var app = angular.module('admin', ['ngRoute', 'ngFileUpload']);

app.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when('/fruit', {
            controller: 'Good',
            templateUrl: 'pages/admin_good.html'
        }).
        when('/dic', {
            controller: 'Dic',
            templateUrl: 'pages/admin_dic.html'
        }).
        when('/users', {
            controller: 'UserManager',
            templateUrl: 'pages/admin_user_manager.html'
         }).
        when('/permission', {
            controller: 'PermissionManager',
            templateUrl: 'pages/admin_permission.html'
        }).
        otherwise({
            redirectTo: '/users'
        });
}]);
/**
 * Created by xz_liu on 2016/3/9.
 */
var app = angular.module('mobile', ['ngRoute']);

app.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when('/home', {
            controller: 'Home',
            templateUrl: 'pages/home.html'
        })
        .when('/category', {
            controller: 'Category',
            templateUrl: 'pages/category.html'
        })
        .when('/goods/:category', {
            controller: 'Goods',
            templateUrl: 'pages/goods.html'
        })
        .otherwise({
            redirectTo: '/home'
        });
}]);
/**
 * Created by xz_liu on 2016/3/9.
 */
var app = angular.module('app', ['ngRoute']);

app.config(["$routeProvider", function ($routeProvider) {
    $routeProvider
        .when('/order/index', {
            controller: 'OrderIndex',
            templateUrl: 'pages/orders_list.html'
        })
        .when('/order/create', {
            controller: 'OrderCreate',
            templateUrl: 'pages/orders_create.html'
        })
        .when('/order/detail/:_id', {
            controller: 'OrderDetail',
            templateUrl: 'pages/orders_detail.html'
        })
        .otherwise({
            redirectTo: '/order/index'
        });
}]);
/**
 * Created by xz_liu on 2016/3/9.
 */
var app = angular.module('admin');

app.controller('Dic', ["$scope", "$http", "$route", function ($scope, $http, $route) {
    document.title = 'Dictionary Management';

    $http.get('/dics').success(function (result) {
        $scope.dics = result;
    });

    $http.get('/dicTypes').success(function (result) {
        $scope.dicTypes = result;
    });

    $scope.getDic = function (_id) {
        $http.get('/dics/' + _id).success(function (result) {
            if (!result.code) {
                $scope.dicEdit = result;
            }
        });
    };

    $scope.createDic = function (dic) {
        $http.post('/dics', dic).success(function (result) {
            if (!result.code) {
                $route.reload();
            }
        });
    };

    $scope.deleteDic = function (_id) {
        $http.delete('/dics/' + _id).success(function (result) {
            if (result.code == 0) {
                $route.reload();
            }
        });
    };
}]);
/**
 * Created by xz_liu on 2016/3/9.
 */
var app = angular.module('admin');

app.controller('Good', ["$scope", "$http", "$route", "Upload", "$timeout", function ($scope, $http, $route, Upload, $timeout) {
    document.title = 'Goods Management';
    $scope.isUpdate = false;
    $scope.buttonName = '新建商品';

    //测试用数据
    $scope.good = {
        name: '草莓',
        desc: '描述',
        category: 'Berry',
        pics: [],
        spec: '1kg',
        provenance: '上海',
        shelfLife: 1,
        storage: '阴凉',
        price: 10,
        sales: 0,
        balance: 120
    };

    $http.get('/goodCategories').success(function (result) {
        commonGetPagedGoods(1);
        $scope.goodCategories = result;
    });

    $scope.getPagedGoods = function (page) {
        commonGetPagedGoods(page);
    };

    $scope.editGood = function (_id) {
        $http.get('/goods/' + _id).success(function (result) {
            if (!result.code) {
                $scope.good = result;
                $scope.isUpdate = true;
                $scope.buttonName = '编辑商品';
            }
        });
    };

    $scope.saveGood = function (good) {
        if (!$scope.isUpdate) {
            $http.post('/goods', good).success(function (result) {
                if (!result.code) {
                    $route.reload();
                }
            });
        }
        else {
            $http.put('/goods/' + good._id, good).success(function (result) {
                if (result.code == 0) {
                    $route.reload();
                }
            });
        }
    };

    $scope.deleteGood = function (_id) {
        $http.delete('/goods/' + _id).success(function (result) {
            if (result.code == 0) {
                $route.reload();
            }
        });
    };

    $scope.uploadFiles = function (files) {
        $scope.files = files;
        angular.forEach(files, function (file) {
            file.upload = Upload.upload({
                url: '/pics',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    $scope.good.pics.push(response.data);
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        });
    };

    var commonGetPagedGoods = function (page) {
        $http.get('/goodsPaged?page=' + page).success(function (result) {
            $scope.goods = [];
            $scope.goods.push.apply($scope.goods, result.data);
            $scope.pages = result.pages;
            $scope.pageArray = getPageArray(result.pages.current, result.pages.total);
        });
    };

    var getPageArray = function (current, total) {
        var start = current > 5 ? current - 4 : 1;
        var end = total - current > 3 ? current + 4 : total;
        return _.range(start, end + 1);
    }
}]);

var app = angular.module('admin');
var title = 'Permission Management';

app.controller('PermissionManager', ["$scope", "$http", "$route", function ($scope, $http, $route) {
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
}]);
/**
 * Created by Jesse Qin on 3/19/2016.
 */

var app = angular.module('admin');
var title = 'User Management';

app.controller('UserManager', ["$scope", "$http", "$route", function ($scope, $http, $route) {
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
}]);
/**
 * Created by xz_liu on 2016/3/9.
 */
var app = angular.module('mobile');

app.controller('Category', ["$scope", "$http", function ($scope, $http) {
    document.title = 'Category';

    $http.get('/goodCategories').success(function (result) {
        $scope.goodCategories = result;
    });
}]);
/**
 * Created by xz_liu on 2016/3/9.
 */
var app = angular.module('mobile');

app.controller('Goods', ["$scope", "$http", "$routeParams", function ($scope, $http, $routeParams) {
    document.title = 'Goods List';
    $scope.category = $routeParams.category;

    $http.get('/goods?category=' + $scope.category).success(function (result) {
        if (!result.code) {
            $scope.goods = result;
        }
    });
}]);
/**
 * Created by xz_liu on 2016/3/9.
 */
var app = angular.module('mobile');

app.controller('Home', ["$scope", "$http", "$route", function ($scope, $http, $route) {
    document.title = 'Home';
}]);
/**
 * Created by xz_liu on 2016/3/9.
 */
var app = angular.module('app');

app.controller('OrderIndex', ["$scope", "$http", "$route", function ($scope, $http, $route) {
    document.title = 'Order List';

    $http.get('/orders').success(function (result) {
        $scope.orders = result;
    });

    $scope.deleteOrder = function (_id) {
        $http.delete('/orders/' + _id).success(function (result) {
            $route.reload();
        });
    };
}]);

var fruits = [
    {
        fruit_name: 'Apple',
        unit_price: 1.2,
        fruit_quantity: 0,
        selectd: false
    },
    {
        fruit_name: 'Banana',
        unit_price: 2.3,
        fruit_quantity: 0,
        selectd: false
    },
    {
        fruit_name: 'Pitaya',
        unit_price: 3.4,
        fruit_quantity: 0,
        selectd: false
    },
    {
        fruit_name: 'Mango',
        unit_price: 4.5,
        fruit_quantity: 0,
        selectd: false
    }];

app.controller('OrderCreate', ["$scope", "$http", "$location", function ($scope, $http, $location) {
    document.title = 'Order Create';

    $scope.fruits = fruits;

    $scope.order = {
        customer: 'leo',
        amount: 0,
        delivery_date: new Date(),
        fruits: []
    };

    $scope.calcTotalAmount = function () {
        var total = 0;
        for (var i in $scope.fruits) {
            var fruit = $scope.fruits[i];
            if (fruit.selectd) {
                total += fruit.unit_price * fruit.fruit_quantity;
            }
        }
        $scope.order.amount = total;
    };

    $scope.createOrder = function (order) {
        for (var i in $scope.fruits) {
            var fruit = $scope.fruits[i];
            if (fruit.selectd) {
                order.fruits.push({
                    fruit_name: fruit.fruit_name,
                    fruit_quantity: fruit.fruit_quantity
                });
            }
        }

        $http.post('/orders', order).success(function (result) {
            if (!result.code) {
                $location.path('/order/detail/' + result);
            }
        });
    };
}]);

app.controller('OrderDetail', ["$scope", "$http", "$routeParams", function ($scope, $http, $routeParams) {
    document.title = 'Order Detail';

    var _id = $routeParams._id;
    $http.get('/orders/' + _id).success(function (result) {
        if (!result.code) {
            $scope.order = result;
        }
    });
}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldC5qcyIsImFkbWluL2NsaWVudC9yb3V0ZXMuanMiLCJtb2JpbGUvY2xpZW50L3JvdXRlcy5qcyIsIm9yZGVycy9jbGllbnQvcm91dGVzLmpzIiwiYWRtaW4vY2xpZW50L2NvbnRyb2xsZXJzL2RpYy5qcyIsImFkbWluL2NsaWVudC9jb250cm9sbGVycy9nb29kLmpzIiwiYWRtaW4vY2xpZW50L2NvbnRyb2xsZXJzL3Blcm1pc3Npb24uanMiLCJhZG1pbi9jbGllbnQvY29udHJvbGxlcnMvdXNlcm1hbmFnZXIuanMiLCJtb2JpbGUvY2xpZW50L2NvbnRyb2xsZXJzL2NhdGVnb3J5LmpzIiwibW9iaWxlL2NsaWVudC9jb250cm9sbGVycy9nb29kcy5qcyIsIm1vYmlsZS9jbGllbnQvY29udHJvbGxlcnMvaG9tZS5qcyIsIm9yZGVycy9jbGllbnQvY29udHJvbGxlcnMvb3JkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FBS0EsSUFBSSxTQUFTLEdBQUcsUUFBUTs7QUFFeEIsT0FBTyxHQUFHLFVBQVUsVUFBVSxNQUFNO0lBQ2hDLEVBQUU7U0FDRyxLQUFLLDBEQUEwRCxLQUFLLE1BQU0sVUFBVSxPQUFPLE1BQU0sWUFBWTtRQUM5RyxFQUFFLGVBQWUsUUFBUTs7R0FFOUI7QUNaSDs7O0FBR0EsSUFBSSxNQUFNLFFBQVEsT0FBTyxTQUFTLENBQUMsV0FBVzs7QUFFOUMsSUFBSSwwQkFBTyxVQUFVLGdCQUFnQjtJQUNqQztTQUNLLEtBQUssVUFBVTtZQUNaLFlBQVk7WUFDWixhQUFhOztRQUVqQixLQUFLLFFBQVE7WUFDVCxZQUFZO1lBQ1osYUFBYTs7UUFFakIsS0FBSyxVQUFVO1lBQ1gsWUFBWTtZQUNaLGFBQWE7O1FBRWpCLEtBQUssZUFBZTtZQUNoQixZQUFZO1lBQ1osYUFBYTs7UUFFakIsVUFBVTtZQUNOLFlBQVk7O0lBRXJCO0FDMUJIOzs7QUFHQSxJQUFJLE1BQU0sUUFBUSxPQUFPLFVBQVUsQ0FBQzs7QUFFcEMs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O2dCQUNmLE1BQU0sT0FBTyxLQUFLO29CQUNkLFlBQVksTUFBTTtvQkFDbEIsZ0JBQWdCLE1BQU07Ozs7O1FBS2xDLE1BQU0sS0FBSyxXQUFXLE9BQU8sUUFBUSxVQUFVLFFBQVE7WUFDbkQsSUFBSSxDQUFDLE9BQU8sTUFBTTtnQkFDZCxVQUFVLEtBQUssbUJBQW1COzs7Ozs7QUFNbEQsSUFBSSxXQUFXLG1EQUFlLFVBQVUsUUFBUSxPQUFPLGNBQWM7SUFDakUsU0FBUyxRQUFROztJQUVqQixJQUFJLE1BQU0sYUFBYTtJQUN2QixNQUFNLElBQUksYUFBYSxLQUFLLFFBQVEsVUFBVSxRQUFRO1FBQ2xELElBQUksQ0FBQyxPQUFPLE1BQU07WUFDZCxPQUFPLFFBQVE7OztJQUd4QiIsImZpbGUiOiJzaXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENyZWF0ZWQgYnkgeHpfbGl1IG9uIDIwMTYvMy8xNC5cclxuICovXHJcblxyXG4vLyDpnIDopoHmm7/mjaLkuLrmnI3liqHlmajlnLDlnYBcclxudmFyIHNvY2tldCA9IGlvLmNvbm5lY3QoJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC8nKTtcclxuXHJcbnNvY2tldC5vbignbm90aWZ5JywgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICQoXCIjc29ja2V0aW5mb1wiKVxyXG4gICAgICAgIC5odG1sKCc8ZGl2IGNsYXNzPVwiYnRuIGJ0bi1zdWNjZXNzXCIgc3R5bGU9XCJwb3NpdGlvbjpmaXhlZDtcIj4nICsgZGF0YS5tc2cgKyAnPC9kaXY+JykuZmFkZUluKDMwMDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKFwiI3NvY2tldGluZm9cIikuZmFkZU91dCgxMDAwKTtcclxuICAgIH0pO1xyXG59KTsiLCIvKipcclxuICogQ3JlYXRlZCBieSB4el9saXUgb24gMjAxNi8zLzkuXHJcbiAqL1xyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FkbWluJywgWyduZ1JvdXRlJywgJ25nRmlsZVVwbG9hZCddKTtcclxuXHJcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgIC53aGVuKCcvZnJ1aXQnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdHb29kJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9hZG1pbl9nb29kLmh0bWwnXHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgd2hlbignL2RpYycsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0RpYycsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFnZXMvYWRtaW5fZGljLmh0bWwnXHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgd2hlbignL3VzZXJzJywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnVXNlck1hbmFnZXInLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhZ2VzL2FkbWluX3VzZXJfbWFuYWdlci5odG1sJ1xyXG4gICAgICAgICB9KS5cclxuICAgICAgICB3aGVuKCcvcGVybWlzc2lvbicsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1Blcm1pc3Npb25NYW5hZ2VyJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9hZG1pbl9wZXJtaXNzaW9uLmh0bWwnXHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgb3RoZXJ3aXNlKHtcclxuICAgICAgICAgICAgcmVkaXJlY3RUbzogJy91c2VycydcclxuICAgICAgICB9KTtcclxufSk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgeHpfbGl1IG9uIDIwMTYvMy85LlxyXG4gKi9cclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdtb2JpbGUnLCBbJ25nUm91dGUnXSk7XHJcblxyXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkcm91dGVQcm92aWRlcikge1xyXG4gICAgJHJvdXRlUHJvdmlkZXJcclxuICAgICAgICAud2hlbignL2hvbWUnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9ob21lLmh0bWwnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2NhdGVnb3J5Jywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQ2F0ZWdvcnknLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhZ2VzL2NhdGVnb3J5Lmh0bWwnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL2dvb2RzLzpjYXRlZ29yeScsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0dvb2RzJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9nb29kcy5odG1sJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm90aGVyd2lzZSh7XHJcbiAgICAgICAgICAgIHJlZGlyZWN0VG86ICcvaG9tZSdcclxuICAgICAgICB9KTtcclxufSk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgeHpfbGl1IG9uIDIwMTYvMy85LlxyXG4gKi9cclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ25nUm91dGUnXSk7XHJcblxyXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkcm91dGVQcm92aWRlcikge1xyXG4gICAgJHJvdXRlUHJvdmlkZXJcclxuICAgICAgICAud2hlbignL29yZGVyL2luZGV4Jywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnT3JkZXJJbmRleCcsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFnZXMvb3JkZXJzX2xpc3QuaHRtbCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvb3JkZXIvY3JlYXRlJywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnT3JkZXJDcmVhdGUnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhZ2VzL29yZGVyc19jcmVhdGUuaHRtbCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvb3JkZXIvZGV0YWlsLzpfaWQnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdPcmRlckRldGFpbCcsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFnZXMvb3JkZXJzX2RldGFpbC5odG1sJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLm90aGVyd2lzZSh7XHJcbiAgICAgICAgICAgIHJlZGlyZWN0VG86ICcvb3JkZXIvaW5kZXgnXHJcbiAgICAgICAgfSk7XHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHh6X2xpdSBvbiAyMDE2LzMvOS5cclxuICovXHJcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYWRtaW4nKTtcclxuXHJcbmFwcC5jb250cm9sbGVyKCdEaWMnLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlKSB7XHJcbiAgICBkb2N1bWVudC50aXRsZSA9ICdEaWN0aW9uYXJ5IE1hbmFnZW1lbnQnO1xyXG5cclxuICAgICRodHRwLmdldCgnL2RpY3MnKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAkc2NvcGUuZGljcyA9IHJlc3VsdDtcclxuICAgIH0pO1xyXG5cclxuICAgICRodHRwLmdldCgnL2RpY1R5cGVzJykuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgJHNjb3BlLmRpY1R5cGVzID0gcmVzdWx0O1xyXG4gICAgfSk7XHJcblxyXG4gICAgJHNjb3BlLmdldERpYyA9IGZ1bmN0aW9uIChfaWQpIHtcclxuICAgICAgICAkaHR0cC5nZXQoJy9kaWNzLycgKyBfaWQpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdC5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZGljRWRpdCA9IHJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY3JlYXRlRGljID0gZnVuY3Rpb24gKGRpYykge1xyXG4gICAgICAgICRodHRwLnBvc3QoJy9kaWNzJywgZGljKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgaWYgKCFyZXN1bHQuY29kZSkge1xyXG4gICAgICAgICAgICAgICAgJHJvdXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5kZWxldGVEaWMgPSBmdW5jdGlvbiAoX2lkKSB7XHJcbiAgICAgICAgJGh0dHAuZGVsZXRlKCcvZGljcy8nICsgX2lkKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5jb2RlID09IDApIHtcclxuICAgICAgICAgICAgICAgICRyb3V0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufSk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgeHpfbGl1IG9uIDIwMTYvMy85LlxyXG4gKi9cclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhZG1pbicpO1xyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ0dvb2QnLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlLCBVcGxvYWQsICR0aW1lb3V0KSB7XHJcbiAgICBkb2N1bWVudC50aXRsZSA9ICdHb29kcyBNYW5hZ2VtZW50JztcclxuICAgICRzY29wZS5pc1VwZGF0ZSA9IGZhbHNlO1xyXG4gICAgJHNjb3BlLmJ1dHRvbk5hbWUgPSAn5paw5bu65ZWG5ZOBJztcclxuXHJcbiAgICAvL+a1i+ivleeUqOaVsOaNrlxyXG4gICAgJHNjb3BlLmdvb2QgPSB7XHJcbiAgICAgICAgbmFtZTogJ+iNieiOkycsXHJcbiAgICAgICAgZGVzYzogJ+aPj+i/sCcsXHJcbiAgICAgICAgY2F0ZWdvcnk6ICdCZXJyeScsXHJcbiAgICAgICAgcGljczogW10sXHJcbiAgICAgICAgc3BlYzogJzFrZycsXHJcbiAgICAgICAgcHJvdmVuYW5jZTogJ+S4iua1tycsXHJcbiAgICAgICAgc2hlbGZMaWZlOiAxLFxyXG4gICAgICAgIHN0b3JhZ2U6ICfpmLTlh4knLFxyXG4gICAgICAgIHByaWNlOiAxMCxcclxuICAgICAgICBzYWxlczogMCxcclxuICAgICAgICBiYWxhbmNlOiAxMjBcclxuICAgIH07XHJcblxyXG4gICAgJGh0dHAuZ2V0KCcvZ29vZENhdGVnb3JpZXMnKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICBjb21tb25HZXRQYWdlZEdvb2RzKDEpO1xyXG4gICAgICAgICRzY29wZS5nb29kQ2F0ZWdvcmllcyA9IHJlc3VsdDtcclxuICAgIH0pO1xyXG5cclxuICAgICRzY29wZS5nZXRQYWdlZEdvb2RzID0gZnVuY3Rpb24gKHBhZ2UpIHtcclxuICAgICAgICBjb21tb25HZXRQYWdlZEdvb2RzKHBhZ2UpO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZWRpdEdvb2QgPSBmdW5jdGlvbiAoX2lkKSB7XHJcbiAgICAgICAgJGh0dHAuZ2V0KCcvZ29vZHMvJyArIF9pZCkuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5nb29kID0gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmlzVXBkYXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5idXR0b25OYW1lID0gJ+e8lui+keWVhuWTgSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnNhdmVHb29kID0gZnVuY3Rpb24gKGdvb2QpIHtcclxuICAgICAgICBpZiAoISRzY29wZS5pc1VwZGF0ZSkge1xyXG4gICAgICAgICAgICAkaHR0cC5wb3N0KCcvZ29vZHMnLCBnb29kKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkcm91dGUucmVsb2FkKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgJGh0dHAucHV0KCcvZ29vZHMvJyArIGdvb2QuX2lkLCBnb29kKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuY29kZSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHJvdXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5kZWxldGVHb29kID0gZnVuY3Rpb24gKF9pZCkge1xyXG4gICAgICAgICRodHRwLmRlbGV0ZSgnL2dvb2RzLycgKyBfaWQpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LmNvZGUgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgJHJvdXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS51cGxvYWRGaWxlcyA9IGZ1bmN0aW9uIChmaWxlcykge1xyXG4gICAgICAgICRzY29wZS5maWxlcyA9IGZpbGVzO1xyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChmaWxlcywgZnVuY3Rpb24gKGZpbGUpIHtcclxuICAgICAgICAgICAgZmlsZS51cGxvYWQgPSBVcGxvYWQudXBsb2FkKHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9waWNzJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtmaWxlOiBmaWxlfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGZpbGUudXBsb2FkLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmdvb2QucGljcy5wdXNoKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVycm9yTXNnID0gcmVzcG9uc2Uuc3RhdHVzICsgJzogJyArIHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgICAgICAgICAgIGZpbGUucHJvZ3Jlc3MgPSBNYXRoLm1pbigxMDAsIHBhcnNlSW50KDEwMC4wICpcclxuICAgICAgICAgICAgICAgICAgICBldnQubG9hZGVkIC8gZXZ0LnRvdGFsKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgY29tbW9uR2V0UGFnZWRHb29kcyA9IGZ1bmN0aW9uIChwYWdlKSB7XHJcbiAgICAgICAgJGh0dHAuZ2V0KCcvZ29vZHNQYWdlZD9wYWdlPScgKyBwYWdlKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgJHNjb3BlLmdvb2RzID0gW107XHJcbiAgICAgICAgICAgICRzY29wZS5nb29kcy5wdXNoLmFwcGx5KCRzY29wZS5nb29kcywgcmVzdWx0LmRhdGEpO1xyXG4gICAgICAgICAgICAkc2NvcGUucGFnZXMgPSByZXN1bHQucGFnZXM7XHJcbiAgICAgICAgICAgICRzY29wZS5wYWdlQXJyYXkgPSBnZXRQYWdlQXJyYXkocmVzdWx0LnBhZ2VzLmN1cnJlbnQsIHJlc3VsdC5wYWdlcy50b3RhbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBnZXRQYWdlQXJyYXkgPSBmdW5jdGlvbiAoY3VycmVudCwgdG90YWwpIHtcclxuICAgICAgICB2YXIgc3RhcnQgPSBjdXJyZW50ID4gNSA/IGN1cnJlbnQgLSA0IDogMTtcclxuICAgICAgICB2YXIgZW5kID0gdG90YWwgLSBjdXJyZW50ID4gMyA/IGN1cnJlbnQgKyA0IDogdG90YWw7XHJcbiAgICAgICAgcmV0dXJuIF8ucmFuZ2Uoc3RhcnQsIGVuZCArIDEpO1xyXG4gICAgfVxyXG59KTsiLCJcclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhZG1pbicpO1xyXG52YXIgdGl0bGUgPSAnUGVybWlzc2lvbiBNYW5hZ2VtZW50JztcclxuXHJcbmFwcC5jb250cm9sbGVyKCdQZXJtaXNzaW9uTWFuYWdlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGUpIHtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcblxyXG4gICAgJGh0dHAuZ2V0KCcvcGVybWlzc2lvbnMnKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpe1xyXG4gICAgICAgICRzY29wZS5QZXJtaXNzaW9ucyA9IHJlc3VsdDtcclxuICAgIH0pO1xyXG5cclxuICAgICRzY29wZS5QZXJtaXNzaW9uID0ge1xyXG4gICAgICAgIHBlcm1pc3Npb25UeXBlOiAndGVzdCcsXHJcbiAgICAgICAgbmFtZTogJycsXHJcbiAgICAgICAgZmVhdHVyZUhhc2g6ICd0ZXN0JyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogJ3Rlc3QnXHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jcmVhdGVQZXJtaXNzaW9uID0gZnVuY3Rpb24gKHBlcm1pc3Npb24pIHtcclxuXHJcbiAgICAgICAgJGh0dHAucG9zdCgnL3Blcm1pc3Npb25zJywgcGVybWlzc2lvbikuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICRyb3V0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZGVsZXRlUGVybWlzc2lvbiA9IGZ1bmN0aW9uKF9pZCl7XHJcbiAgICAgICAgJGh0dHAuZGVsZXRlKCcvcGVybWlzc2lvbnMvJyArIF9pZCkuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuY29kZSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAkcm91dGUucmVsb2FkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEplc3NlIFFpbiBvbiAzLzE5LzIwMTYuXHJcbiAqL1xyXG5cclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhZG1pbicpO1xyXG52YXIgdGl0bGUgPSAnVXNlciBNYW5hZ2VtZW50JztcclxuXHJcbmFwcC5jb250cm9sbGVyKCdVc2VyTWFuYWdlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGUpIHtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcblxyXG4gICAgJGh0dHAuZ2V0KCcvcm9sZXMnKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpe1xyXG4gICAgICAgICRzY29wZS5Sb2xlcyA9IHJlc3VsdDtcclxuICAgIH0pO1xyXG5cclxuICAgICRzY29wZS5Vc2VyID0ge1xyXG4gICAgICAgIHVzZXJOYW1lOiAnJ1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY3JlYXRlVXNlciA9IGZ1bmN0aW9uIChVc2VyKSB7XHJcblxyXG4gICAgICAgIC8qJGh0dHAucG9zdCgnL3VzZXJzJywgdXNlcikuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICRyb3V0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pOyovXHJcbiAgICB9O1xyXG59KTsiLCIvKipcclxuICogQ3JlYXRlZCBieSB4el9saXUgb24gMjAxNi8zLzkuXHJcbiAqL1xyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ21vYmlsZScpO1xyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ0NhdGVnb3J5JywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHApIHtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gJ0NhdGVnb3J5JztcclxuXHJcbiAgICAkaHR0cC5nZXQoJy9nb29kQ2F0ZWdvcmllcycpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICRzY29wZS5nb29kQ2F0ZWdvcmllcyA9IHJlc3VsdDtcclxuICAgIH0pO1xyXG59KTsiLCIvKipcclxuICogQ3JlYXRlZCBieSB4el9saXUgb24gMjAxNi8zLzkuXHJcbiAqL1xyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ21vYmlsZScpO1xyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ0dvb2RzJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcykge1xyXG4gICAgZG9jdW1lbnQudGl0bGUgPSAnR29vZHMgTGlzdCc7XHJcbiAgICAkc2NvcGUuY2F0ZWdvcnkgPSAkcm91dGVQYXJhbXMuY2F0ZWdvcnk7XHJcblxyXG4gICAgJGh0dHAuZ2V0KCcvZ29vZHM/Y2F0ZWdvcnk9JyArICRzY29wZS5jYXRlZ29yeSkuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgaWYgKCFyZXN1bHQuY29kZSkge1xyXG4gICAgICAgICAgICAkc2NvcGUuZ29vZHMgPSByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHh6X2xpdSBvbiAyMDE2LzMvOS5cclxuICovXHJcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnbW9iaWxlJyk7XHJcblxyXG5hcHAuY29udHJvbGxlcignSG9tZScsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGUpIHtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gJ0hvbWUnO1xyXG59KTsiLCIvKipcclxuICogQ3JlYXRlZCBieSB4el9saXUgb24gMjAxNi8zLzkuXHJcbiAqL1xyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcpO1xyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ09yZGVySW5kZXgnLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlKSB7XHJcbiAgICBkb2N1bWVudC50aXRsZSA9ICdPcmRlciBMaXN0JztcclxuXHJcbiAgICAkaHR0cC5nZXQoJy9vcmRlcnMnKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAkc2NvcGUub3JkZXJzID0gcmVzdWx0O1xyXG4gICAgfSk7XHJcblxyXG4gICAgJHNjb3BlLmRlbGV0ZU9yZGVyID0gZnVuY3Rpb24gKF9pZCkge1xyXG4gICAgICAgICRodHRwLmRlbGV0ZSgnL29yZGVycy8nICsgX2lkKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgJHJvdXRlLnJlbG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufSk7XHJcblxyXG52YXIgZnJ1aXRzID0gW1xyXG4gICAge1xyXG4gICAgICAgIGZydWl0X25hbWU6ICdBcHBsZScsXHJcbiAgICAgICAgdW5pdF9wcmljZTogMS4yLFxyXG4gICAgICAgIGZydWl0X3F1YW50aXR5OiAwLFxyXG4gICAgICAgIHNlbGVjdGQ6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGZydWl0X25hbWU6ICdCYW5hbmEnLFxyXG4gICAgICAgIHVuaXRfcHJpY2U6IDIuMyxcclxuICAgICAgICBmcnVpdF9xdWFudGl0eTogMCxcclxuICAgICAgICBzZWxlY3RkOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBmcnVpdF9uYW1lOiAnUGl0YXlhJyxcclxuICAgICAgICB1bml0X3ByaWNlOiAzLjQsXHJcbiAgICAgICAgZnJ1aXRfcXVhbnRpdHk6IDAsXHJcbiAgICAgICAgc2VsZWN0ZDogZmFsc2VcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgZnJ1aXRfbmFtZTogJ01hbmdvJyxcclxuICAgICAgICB1bml0X3ByaWNlOiA0LjUsXHJcbiAgICAgICAgZnJ1aXRfcXVhbnRpdHk6IDAsXHJcbiAgICAgICAgc2VsZWN0ZDogZmFsc2VcclxuICAgIH1dO1xyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ09yZGVyQ3JlYXRlJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRsb2NhdGlvbikge1xyXG4gICAgZG9jdW1lbnQudGl0bGUgPSAnT3JkZXIgQ3JlYXRlJztcclxuXHJcbiAgICAkc2NvcGUuZnJ1aXRzID0gZnJ1aXRzO1xyXG5cclxuICAgICRzY29wZS5vcmRlciA9IHtcclxuICAgICAgICBjdXN0b21lcjogJ2xlbycsXHJcbiAgICAgICAgYW1vdW50OiAwLFxyXG4gICAgICAgIGRlbGl2ZXJ5X2RhdGU6IG5ldyBEYXRlKCksXHJcbiAgICAgICAgZnJ1aXRzOiBbXVxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY2FsY1RvdGFsQW1vdW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB0b3RhbCA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSBpbiAkc2NvcGUuZnJ1aXRzKSB7XHJcbiAgICAgICAgICAgIHZhciBmcnVpdCA9ICRzY29wZS5mcnVpdHNbaV07XHJcbiAgICAgICAgICAgIGlmIChmcnVpdC5zZWxlY3RkKSB7XHJcbiAgICAgICAgICAgICAgICB0b3RhbCArPSBmcnVpdC51bml0X3ByaWNlICogZnJ1aXQuZnJ1aXRfcXVhbnRpdHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgJHNjb3BlLm9yZGVyLmFtb3VudCA9IHRvdGFsO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY3JlYXRlT3JkZXIgPSBmdW5jdGlvbiAob3JkZXIpIHtcclxuICAgICAgICBmb3IgKHZhciBpIGluICRzY29wZS5mcnVpdHMpIHtcclxuICAgICAgICAgICAgdmFyIGZydWl0ID0gJHNjb3BlLmZydWl0c1tpXTtcclxuICAgICAgICAgICAgaWYgKGZydWl0LnNlbGVjdGQpIHtcclxuICAgICAgICAgICAgICAgIG9yZGVyLmZydWl0cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBmcnVpdF9uYW1lOiBmcnVpdC5mcnVpdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGZydWl0X3F1YW50aXR5OiBmcnVpdC5mcnVpdF9xdWFudGl0eVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRodHRwLnBvc3QoJy9vcmRlcnMnLCBvcmRlcikuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvb3JkZXIvZGV0YWlsLycgKyByZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59KTtcclxuXHJcbmFwcC5jb250cm9sbGVyKCdPcmRlckRldGFpbCcsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMpIHtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gJ09yZGVyIERldGFpbCc7XHJcblxyXG4gICAgdmFyIF9pZCA9ICRyb3V0ZVBhcmFtcy5faWQ7XHJcbiAgICAkaHR0cC5nZXQoJy9vcmRlcnMvJyArIF9pZCkuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgaWYgKCFyZXN1bHQuY29kZSkge1xyXG4gICAgICAgICAgICAkc2NvcGUub3JkZXIgPSByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
