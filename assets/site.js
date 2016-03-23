/**
 * Created by xz_liu on 2016/3/9.
 */
var app = angular.module('admin', ['ngRoute', 'ngFileUpload']);

app.config(["$routeProvider", function ($routeProvider) {
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
        name: '芒果',
        desc: '描述',
        category: 'Nut',
        pics: [],
        provenance: '上海',
        shelfLife: 1,
        storage: '阴凉',
        price: 10,
        sales: 0,
        balance: 120
    };

    $http.get('/goods').success(function (result) {
        $scope.goods = result;
    });

    $http.get('/goodCategories').success(function (result) {
        $scope.goodCategories = result;
    });

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
                    console.log();
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        });
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

app.controller('userIndex', ["$scope", "$http", "$route", function($scope, $http, $route){

    $http.get('/users').success(function (result) {
        $scope.users = result;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkbWluL2NsaWVudC9yb3V0ZXMuanMiLCJtb2JpbGUvY2xpZW50L3JvdXRlcy5qcyIsIm9yZGVycy9jbGllbnQvcm91dGVzLmpzIiwiYWRtaW4vY2xpZW50L2NvbnRyb2xsZXJzL2RpYy5qcyIsImFkbWluL2NsaWVudC9jb250cm9sbGVycy9nb29kLmpzIiwiYWRtaW4vY2xpZW50L2NvbnRyb2xsZXJzL3Blcm1pc3Npb24uanMiLCJhZG1pbi9jbGllbnQvY29udHJvbGxlcnMvdXNlcm1hbmFnZXIuanMiLCJtb2JpbGUvY2xpZW50L2NvbnRyb2xsZXJzL2hvbWUuanMiLCJvcmRlcnMvY2xpZW50L2NvbnRyb2xsZXJzL29yZGVyLmpzIiwic29ja2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUFHQSxJQUFJLE1BQU0sUUFBUSxPQUFPLFNBQVMsQ0FBQyxXQUFXOztBQUU5QyxJQUFJLDBCQUFPLFVBQVUsZ0JBQWdCO0lBQ2pDO1NBQ0ssS0FBSyxTQUFTO1lBQ1gsWUFBWTtZQUNaLGFBQWE7O1NBRWhCLEtBQUssUUFBUTtZQUNWLFlBQVk7WUFDWixhQUFhOztRQUVqQixLQUFLLFVBQVU7WUFDWCxZQUFZO1lBQ1osYUFBYTs7UUFFakIsS0FBSyxlQUFlO1lBQ2hCLFlBQVk7WUFDWixhQUFhOztRQUVqQixVQUFVO1lBQ04sWUFBWTs7SUFFckI7QUMxQkg7OztBQUdBLElBQUksTUFBTSxRQUFRLE9BQU8sVUFBVSxDQUFDOztBQUVwQyxJQUFJLDBCQUFPLFVBQVUsZ0JBQWdCO0lBQ2pDO1NBQ0ssS0FBSyxTQUFTO1lBQ1gsWUFBWTtZQUNaLGFBQWE7O1NBRWhCLFVBQVU7WUFDUCxZQUFZOztJQUVyQjtBQ2RIOzs7QUFHQSxJQUFJLE1BQU0sUUFBUSxPQUFPLE9BQU8sQ0FBQzs7QUFFakMsSUFBSSwwQkFBTyxVQUFVLGdCQUFnQjtJQUNqQztTQUNLLEtBQUssZ0JBQWdCO1lBQ2xCLFlBQVk7WUFDWixhQUFhOztTQUVoQixLQUFLLGlCQUFpQjtZ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QUFNLE9BQU8sS0FBSztvQkFDZCxZQUFZLE1BQU07b0JBQ2xCLGdCQUFnQixNQUFNOzs7OztRQUtsQyxNQUFNLEtBQUssV0FBVyxPQUFPLFFBQVEsVUFBVSxRQUFRO1lBQ25ELElBQUksQ0FBQyxPQUFPLE1BQU07Z0JBQ2QsVUFBVSxLQUFLLG1CQUFtQjs7Ozs7O0FBTWxELElBQUksV0FBVyxtREFBZSxVQUFVLFFBQVEsT0FBTyxjQUFjO0lBQ2pFLFNBQVMsUUFBUTs7SUFFakIsSUFBSSxNQUFNLGFBQWE7SUFDdkIsTUFBTSxJQUFJLGFBQWEsS0FBSyxRQUFRLFVBQVUsUUFBUTtRQUNsRCxJQUFJLENBQUMsT0FBTyxNQUFNO1lBQ2QsT0FBTyxRQUFROzs7SUFHeEI7QUNoR0g7Ozs7O0FBS0EsSUFBSSxTQUFTLEdBQUcsUUFBUTs7QUFFeEIsT0FBTyxHQUFHLFVBQVUsVUFBVSxNQUFNO0lBQ2hDLEVBQUU7U0FDRyxLQUFLLDBEQUEwRCxLQUFLLE1BQU0sVUFBVSxPQUFPLE1BQU0sWUFBWTtRQUM5RyxFQUFFLGVBQWUsUUFBUTs7R0FFOUIiLCJmaWxlIjoic2l0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHh6X2xpdSBvbiAyMDE2LzMvOS5cclxuICovXHJcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYWRtaW4nLCBbJ25nUm91dGUnLCAnbmdGaWxlVXBsb2FkJ10pO1xyXG5cclxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIpIHtcclxuICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgLndoZW4oJy9nb29kJywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnR29vZCcsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFnZXMvYWRtaW5fZ29vZC5odG1sJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9kaWMnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdEaWMnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhZ2VzL2FkbWluX2RpYy5odG1sJ1xyXG4gICAgICAgIH0pLlxyXG4gICAgICAgIHdoZW4oJy91c2VycycsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1VzZXJNYW5hZ2VyJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy91c2VyX21hbmFnZXIuaHRtbCdcclxuICAgICAgICB9KS5cclxuICAgICAgICB3aGVuKCcvcGVybWlzc2lvbicsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1Blcm1pc3Npb25NYW5hZ2VyJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9hZG1pbl9wZXJtaXNzaW9uLmh0bWwnXHJcbiAgICAgICAgfSkuXHJcbiAgICAgICAgb3RoZXJ3aXNlKHtcclxuICAgICAgICAgICAgcmVkaXJlY3RUbzogJy9nb29kJ1xyXG4gICAgICAgIH0pO1xyXG59KTsiLCIvKipcclxuICogQ3JlYXRlZCBieSB4el9saXUgb24gMjAxNi8zLzkuXHJcbiAqL1xyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ21vYmlsZScsIFsnbmdSb3V0ZSddKTtcclxuXHJcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgIC53aGVuKCcvaG9tZScsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWUnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhZ2VzL2hvbWUuaHRtbCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5vdGhlcndpc2Uoe1xyXG4gICAgICAgICAgICByZWRpcmVjdFRvOiAnL2hvbWUnXHJcbiAgICAgICAgfSk7XHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHh6X2xpdSBvbiAyMDE2LzMvOS5cclxuICovXHJcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJ10pO1xyXG5cclxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIpIHtcclxuICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgLndoZW4oJy9vcmRlci9pbmRleCcsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ09yZGVySW5kZXgnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhZ2VzL29yZGVyc19saXN0Lmh0bWwnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL29yZGVyL2NyZWF0ZScsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ09yZGVyQ3JlYXRlJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9vcmRlcnNfY3JlYXRlLmh0bWwnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAud2hlbignL29yZGVyL2RldGFpbC86X2lkJywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnT3JkZXJEZXRhaWwnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhZ2VzL29yZGVyc19kZXRhaWwuaHRtbCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5vdGhlcndpc2Uoe1xyXG4gICAgICAgICAgICByZWRpcmVjdFRvOiAnL29yZGVyL2luZGV4J1xyXG4gICAgICAgIH0pO1xyXG59KTsiLCIvKipcclxuICogQ3JlYXRlZCBieSB4el9saXUgb24gMjAxNi8zLzkuXHJcbiAqL1xyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FkbWluJyk7XHJcblxyXG5hcHAuY29udHJvbGxlcignRGljJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZSkge1xyXG4gICAgZG9jdW1lbnQudGl0bGUgPSAnRGljdGlvbmFyeSBNYW5hZ2VtZW50JztcclxuXHJcbiAgICAkaHR0cC5nZXQoJy9kaWNzJykuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgJHNjb3BlLmRpY3MgPSByZXN1bHQ7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkaHR0cC5nZXQoJy9kaWNUeXBlcycpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICRzY29wZS5kaWNUeXBlcyA9IHJlc3VsdDtcclxuICAgIH0pO1xyXG5cclxuICAgICRzY29wZS5nZXREaWMgPSBmdW5jdGlvbiAoX2lkKSB7XHJcbiAgICAgICAgJGh0dHAuZ2V0KCcvZGljcy8nICsgX2lkKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgaWYgKCFyZXN1bHQuY29kZSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmRpY0VkaXQgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNyZWF0ZURpYyA9IGZ1bmN0aW9uIChkaWMpIHtcclxuICAgICAgICAkaHR0cC5wb3N0KCcvZGljcycsIGRpYykuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICRyb3V0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZGVsZXRlRGljID0gZnVuY3Rpb24gKF9pZCkge1xyXG4gICAgICAgICRodHRwLmRlbGV0ZSgnL2RpY3MvJyArIF9pZCkuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuY29kZSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAkcm91dGUucmVsb2FkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHh6X2xpdSBvbiAyMDE2LzMvOS5cclxuICovXHJcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYWRtaW4nKTtcclxuXHJcbmFwcC5jb250cm9sbGVyKCdHb29kJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZSwgVXBsb2FkLCAkdGltZW91dCkge1xyXG4gICAgZG9jdW1lbnQudGl0bGUgPSAnR29vZHMgTWFuYWdlbWVudCc7XHJcbiAgICAkc2NvcGUuaXNVcGRhdGUgPSBmYWxzZTtcclxuICAgICRzY29wZS5idXR0b25OYW1lID0gJ+aWsOW7uuWVhuWTgSc7XHJcblxyXG4gICAgLy/mtYvor5XnlKjmlbDmja5cclxuICAgICRzY29wZS5nb29kID0ge1xyXG4gICAgICAgIG5hbWU6ICfoipLmnpwnLFxyXG4gICAgICAgIGRlc2M6ICfmj4/ov7AnLFxyXG4gICAgICAgIGNhdGVnb3J5OiAnTnV0JyxcclxuICAgICAgICBwaWNzOiBbXSxcclxuICAgICAgICBwcm92ZW5hbmNlOiAn5LiK5rW3JyxcclxuICAgICAgICBzaGVsZkxpZmU6IDEsXHJcbiAgICAgICAgc3RvcmFnZTogJ+mYtOWHiScsXHJcbiAgICAgICAgcHJpY2U6IDEwLFxyXG4gICAgICAgIHNhbGVzOiAwLFxyXG4gICAgICAgIGJhbGFuY2U6IDEyMFxyXG4gICAgfTtcclxuXHJcbiAgICAkaHR0cC5nZXQoJy9nb29kcycpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICRzY29wZS5nb29kcyA9IHJlc3VsdDtcclxuICAgIH0pO1xyXG5cclxuICAgICRodHRwLmdldCgnL2dvb2RDYXRlZ29yaWVzJykuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgJHNjb3BlLmdvb2RDYXRlZ29yaWVzID0gcmVzdWx0O1xyXG4gICAgfSk7XHJcblxyXG4gICAgJHNjb3BlLmVkaXRHb29kID0gZnVuY3Rpb24gKF9pZCkge1xyXG4gICAgICAgICRodHRwLmdldCgnL2dvb2RzLycgKyBfaWQpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdC5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZ29vZCA9IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgICRzY29wZS5pc1VwZGF0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYnV0dG9uTmFtZSA9ICfnvJbovpHllYblk4EnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5zYXZlR29vZCA9IGZ1bmN0aW9uIChnb29kKSB7XHJcbiAgICAgICAgaWYgKCEkc2NvcGUuaXNVcGRhdGUpIHtcclxuICAgICAgICAgICAgJGh0dHAucG9zdCgnL2dvb2RzJywgZ29vZCkuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdC5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHJvdXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICRodHRwLnB1dCgnL2dvb2RzLycgKyBnb29kLl9pZCwgZ29vZCkuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmNvZGUgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRyb3V0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZGVsZXRlR29vZCA9IGZ1bmN0aW9uIChfaWQpIHtcclxuICAgICAgICAkaHR0cC5kZWxldGUoJy9nb29kcy8nICsgX2lkKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5jb2RlID09IDApIHtcclxuICAgICAgICAgICAgICAgICRyb3V0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUudXBsb2FkRmlsZXMgPSBmdW5jdGlvbiAoZmlsZXMpIHtcclxuICAgICAgICAkc2NvcGUuZmlsZXMgPSBmaWxlcztcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2goZmlsZXMsIGZ1bmN0aW9uIChmaWxlKSB7XHJcbiAgICAgICAgICAgIGZpbGUudXBsb2FkID0gVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGljcycsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7ZmlsZTogZmlsZX1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBmaWxlLnVwbG9hZC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5nb29kLnBpY3MucHVzaChyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVycm9yTXNnID0gcmVzcG9uc2Uuc3RhdHVzICsgJzogJyArIHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgICAgICAgICAgIGZpbGUucHJvZ3Jlc3MgPSBNYXRoLm1pbigxMDAsIHBhcnNlSW50KDEwMC4wICpcclxuICAgICAgICAgICAgICAgICAgICBldnQubG9hZGVkIC8gZXZ0LnRvdGFsKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59KTsiLCJcclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhZG1pbicpO1xyXG52YXIgdGl0bGUgPSAnUGVybWlzc2lvbiBNYW5hZ2VtZW50JztcclxuXHJcbmFwcC5jb250cm9sbGVyKCdQZXJtaXNzaW9uTWFuYWdlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGUpIHtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcblxyXG4gICAgJGh0dHAuZ2V0KCcvcGVybWlzc2lvbnMnKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpe1xyXG4gICAgICAgICRzY29wZS5QZXJtaXNzaW9ucyA9IHJlc3VsdDtcclxuICAgIH0pO1xyXG5cclxuICAgICRzY29wZS5QZXJtaXNzaW9uID0ge1xyXG4gICAgICAgIHBlcm1pc3Npb25UeXBlOiAndGVzdCcsXHJcbiAgICAgICAgbmFtZTogJycsXHJcbiAgICAgICAgZmVhdHVyZUhhc2g6ICd0ZXN0JyxcclxuICAgICAgICBkZXNjcmlwdGlvbjogJ3Rlc3QnXHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jcmVhdGVQZXJtaXNzaW9uID0gZnVuY3Rpb24gKHBlcm1pc3Npb24pIHtcclxuXHJcbiAgICAgICAgJGh0dHAucG9zdCgnL3Blcm1pc3Npb25zJywgcGVybWlzc2lvbikuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICRyb3V0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZGVsZXRlUGVybWlzc2lvbiA9IGZ1bmN0aW9uKF9pZCl7XHJcbiAgICAgICAgJGh0dHAuZGVsZXRlKCcvcGVybWlzc2lvbnMvJyArIF9pZCkuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuY29kZSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAkcm91dGUucmVsb2FkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEplc3NlIFFpbiBvbiAzLzE5LzIwMTYuXHJcbiAqL1xyXG5cclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhZG1pbicpO1xyXG52YXIgdGl0bGUgPSAnVXNlciBNYW5hZ2VtZW50JztcclxuXHJcbmFwcC5jb250cm9sbGVyKCdVc2VyTWFuYWdlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGUpIHtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcblxyXG4gICAgJGh0dHAuZ2V0KCcvcm9sZXMnKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpe1xyXG4gICAgICAgICRzY29wZS5Sb2xlcyA9IHJlc3VsdDtcclxuICAgIH0pO1xyXG5cclxuICAgICRzY29wZS5Vc2VyID0ge1xyXG4gICAgICAgIHVzZXJOYW1lOiAnJ1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY3JlYXRlVXNlciA9IGZ1bmN0aW9uIChVc2VyKSB7XHJcblxyXG4gICAgICAgIC8qJGh0dHAucG9zdCgnL3VzZXJzJywgdXNlcikuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICRyb3V0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pOyovXHJcbiAgICB9O1xyXG59KTtcclxuXHJcbmFwcC5jb250cm9sbGVyKCd1c2VySW5kZXgnLCBmdW5jdGlvbigkc2NvcGUsICRodHRwLCAkcm91dGUpe1xyXG5cclxuICAgICRodHRwLmdldCgnL3VzZXJzJykuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgJHNjb3BlLnVzZXJzID0gcmVzdWx0O1xyXG4gICAgfSk7XHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHh6X2xpdSBvbiAyMDE2LzMvOS5cclxuICovXHJcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnbW9iaWxlJyk7XHJcblxyXG5hcHAuY29udHJvbGxlcignSG9tZScsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGUpIHtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gJ0hvbWUnO1xyXG59KTsiLCIvKipcclxuICogQ3JlYXRlZCBieSB4el9saXUgb24gMjAxNi8zLzkuXHJcbiAqL1xyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcpO1xyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ09yZGVySW5kZXgnLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlKSB7XHJcbiAgICBkb2N1bWVudC50aXRsZSA9ICdPcmRlciBMaXN0JztcclxuXHJcbiAgICAkaHR0cC5nZXQoJy9vcmRlcnMnKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAkc2NvcGUub3JkZXJzID0gcmVzdWx0O1xyXG4gICAgfSk7XHJcblxyXG4gICAgJHNjb3BlLmRlbGV0ZU9yZGVyID0gZnVuY3Rpb24gKF9pZCkge1xyXG4gICAgICAgICRodHRwLmRlbGV0ZSgnL29yZGVycy8nICsgX2lkKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgJHJvdXRlLnJlbG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufSk7XHJcblxyXG52YXIgZnJ1aXRzID0gW1xyXG4gICAge1xyXG4gICAgICAgIGZydWl0X25hbWU6ICdBcHBsZScsXHJcbiAgICAgICAgdW5pdF9wcmljZTogMS4yLFxyXG4gICAgICAgIGZydWl0X3F1YW50aXR5OiAwLFxyXG4gICAgICAgIHNlbGVjdGQ6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGZydWl0X25hbWU6ICdCYW5hbmEnLFxyXG4gICAgICAgIHVuaXRfcHJpY2U6IDIuMyxcclxuICAgICAgICBmcnVpdF9xdWFudGl0eTogMCxcclxuICAgICAgICBzZWxlY3RkOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBmcnVpdF9uYW1lOiAnUGl0YXlhJyxcclxuICAgICAgICB1bml0X3ByaWNlOiAzLjQsXHJcbiAgICAgICAgZnJ1aXRfcXVhbnRpdHk6IDAsXHJcbiAgICAgICAgc2VsZWN0ZDogZmFsc2VcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgZnJ1aXRfbmFtZTogJ01hbmdvJyxcclxuICAgICAgICB1bml0X3ByaWNlOiA0LjUsXHJcbiAgICAgICAgZnJ1aXRfcXVhbnRpdHk6IDAsXHJcbiAgICAgICAgc2VsZWN0ZDogZmFsc2VcclxuICAgIH1dO1xyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ09yZGVyQ3JlYXRlJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRsb2NhdGlvbikge1xyXG4gICAgZG9jdW1lbnQudGl0bGUgPSAnT3JkZXIgQ3JlYXRlJztcclxuXHJcbiAgICAkc2NvcGUuZnJ1aXRzID0gZnJ1aXRzO1xyXG5cclxuICAgICRzY29wZS5vcmRlciA9IHtcclxuICAgICAgICBjdXN0b21lcjogJ2xlbycsXHJcbiAgICAgICAgYW1vdW50OiAwLFxyXG4gICAgICAgIGRlbGl2ZXJ5X2RhdGU6IG5ldyBEYXRlKCksXHJcbiAgICAgICAgZnJ1aXRzOiBbXVxyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY2FsY1RvdGFsQW1vdW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB0b3RhbCA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSBpbiAkc2NvcGUuZnJ1aXRzKSB7XHJcbiAgICAgICAgICAgIHZhciBmcnVpdCA9ICRzY29wZS5mcnVpdHNbaV07XHJcbiAgICAgICAgICAgIGlmIChmcnVpdC5zZWxlY3RkKSB7XHJcbiAgICAgICAgICAgICAgICB0b3RhbCArPSBmcnVpdC51bml0X3ByaWNlICogZnJ1aXQuZnJ1aXRfcXVhbnRpdHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgJHNjb3BlLm9yZGVyLmFtb3VudCA9IHRvdGFsO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuY3JlYXRlT3JkZXIgPSBmdW5jdGlvbiAob3JkZXIpIHtcclxuICAgICAgICBmb3IgKHZhciBpIGluICRzY29wZS5mcnVpdHMpIHtcclxuICAgICAgICAgICAgdmFyIGZydWl0ID0gJHNjb3BlLmZydWl0c1tpXTtcclxuICAgICAgICAgICAgaWYgKGZydWl0LnNlbGVjdGQpIHtcclxuICAgICAgICAgICAgICAgIG9yZGVyLmZydWl0cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBmcnVpdF9uYW1lOiBmcnVpdC5mcnVpdF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGZydWl0X3F1YW50aXR5OiBmcnVpdC5mcnVpdF9xdWFudGl0eVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRodHRwLnBvc3QoJy9vcmRlcnMnLCBvcmRlcikuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvb3JkZXIvZGV0YWlsLycgKyByZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59KTtcclxuXHJcbmFwcC5jb250cm9sbGVyKCdPcmRlckRldGFpbCcsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGVQYXJhbXMpIHtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gJ09yZGVyIERldGFpbCc7XHJcblxyXG4gICAgdmFyIF9pZCA9ICRyb3V0ZVBhcmFtcy5faWQ7XHJcbiAgICAkaHR0cC5nZXQoJy9vcmRlcnMvJyArIF9pZCkuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgaWYgKCFyZXN1bHQuY29kZSkge1xyXG4gICAgICAgICAgICAkc2NvcGUub3JkZXIgPSByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHh6X2xpdSBvbiAyMDE2LzMvMTQuXHJcbiAqL1xyXG5cclxuLy8g6ZyA6KaB5pu/5o2i5Li65pyN5Yqh5Zmo5Zyw5Z2AXHJcbnZhciBzb2NrZXQgPSBpby5jb25uZWN0KCdodHRwOi8vbG9jYWxob3N0OjMwMDAvJyk7XHJcblxyXG5zb2NrZXQub24oJ25vdGlmeScsIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAkKFwiI3NvY2tldGluZm9cIilcclxuICAgICAgICAuaHRtbCgnPGRpdiBjbGFzcz1cImJ0biBidG4tc3VjY2Vzc1wiIHN0eWxlPVwicG9zaXRpb246Zml4ZWQ7XCI+JyArIGRhdGEubXNnICsgJzwvZGl2PicpLmZhZGVJbigzMDAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJChcIiNzb2NrZXRpbmZvXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICB9KTtcclxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
