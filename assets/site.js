var showDialog = function (info) {
    $('#dialogInfo .modal-body p').text(info);
    $('#dialogInfo').modal('show');
};
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
    $scope.good = {pics: []};

    // //测试用数据
    // $scope.good = {
    //     name: '草莓',
    //     desc: '描述',
    //     category: 'Berry',
    //     pics: [],
    //     spec: '1kg',
    //     provenance: '上海',
    //     shelfLife: 1,
    //     storage: '阴凉',
    //     price: 10,
    //     sales: 0,
    //     balance: 120
    // };

    $http.get('/goodCategories').success(function (result) {
        commonGetPagedGoods(1);
        toggleCreateUpdate(false);
        $scope.goodCategories = result;
    });

    $scope.getPagedGoods = function (page) {
        commonGetPagedGoods(page);
    };

    $scope.editGood = function (_id) {
        $http.get('/goods/' + _id).success(function (result) {
            if (!result.code) {
                $scope.good = result;
                toggleCreateUpdate(true);
                $('#editForm').addClass('animated bounceInUp').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $('#editForm').removeClass('animated bounceInUp')
                });
            }
        });
    };

    $scope.saveGood = function (good) {
        if (!$scope.isUpdate) {
            $http.post('/goods', good).success(function (result) {
                if (!result.code) {
                    //新建成功跳到新商品所在页
                    $scope.pages.current = Math.ceil(($scope.goodsTotal + 1) / $scope.pages.limit);
                    commonGetPagedGoods($scope.pages.current);
                    $scope.good = {pics: []};

                    showDialog('商品创建成功');
                }
            });
        }
        else {
            $http.put('/goods/' + good._id, good).success(function (result) {
                if (result.code == 0) {
                    commonGetPagedGoods($scope.pages.current);
                    toggleCreateUpdate(false);
                    $scope.good = {pics: []};

                    showDialog('商品更新成功');
                }
            });
        }
    };

    $scope.deleteGood = function (_id) {
        $scope.goodToDelete = _id;
        $('#dialogDelete').modal('show');
    };

    $scope.confirmDelete = function (_id) {
        $http.delete('/goods/' + _id).success(function (result) {
            if (result.code == 0) {
                //删除当页最后一条后跳到前一页
                if ((($scope.goodsTotal - 1) % 10 == 0) && !$scope.pages.hasNext) {
                    $scope.pages.current -= 1;
                }
                commonGetPagedGoods($scope.pages.current);
            }
        });
    };

    $scope.uploadFiles = function (files) {
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
            if (!result.code) {
                $scope.goods = [];
                $scope.goods.push.apply($scope.goods, result.data);
                $scope.pages = result.pages;
                $scope.pageArray = getPageArray(result.pages.current, result.pages.total);
                $scope.goodsTotal = result.items.total;
            }
        });
    };

    var getPageArray = function (current, total) {
        var start = current > 5 ? current - 4 : 1;
        var end = total - current > 3 ? current + 4 : total;
        return _.range(start, end + 1);
    };

    var toggleCreateUpdate = function (isUpdate) {
        $scope.isUpdate = isUpdate;
        $scope.buttonName = isUpdate ? '编辑商品' : '新建商品';
    };
}]);

var app = angular.module('admin');
var title = 'Permission Management';

app.controller('PermissionManager', ["$scope", "$http", "$route", function ($scope, $http, $route) {
    document.title = title;

    $http.get('/permissions').success(function (result){
        $scope.Permissions = result;
    });

    $http.get('/roleCategories').success(function (result){
        $scope.RoleCategories = result;
    });

    $scope.Permission = {
        permissionType: '',
        name: '',
        featureHash: '',
        description: ''
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

    $http.get('/users').success(function (result){
        $scope.Users = result;
    });

    $http.get('/roleCategories').success(function (result){
        $scope.RoleCategories = result;
    });

    $scope.User = {
        name: '',
        weChatId: '',
        mobile: '',
        email: '',
        description: '',
        role: ''
    };

    $scope.createUser = function (user) {

        $http.post('/users', user).success(function (result) {
            if (!result.code) {
                $route.reload();
            }
        });
    };

    $scope.deleteUser = function(_id){
        $http.delete('/users/' + _id).success(function (result) {
            if (result.code == 0) {
                $route.reload();
            }
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkbWluLmpzIiwic29ja2V0LmpzIiwiYWRtaW4vY2xpZW50L3JvdXRlcy5qcyIsIm1vYmlsZS9jbGllbnQvcm91dGVzLmpzIiwib3JkZXJzL2NsaWVudC9yb3V0ZXMuanMiLCJhZG1pbi9jbGllbnQvY29udHJvbGxlcnMvZGljLmpzIiwiYWRtaW4vY2xpZW50L2NvbnRyb2xsZXJzL2dvb2QuanMiLCJhZG1pbi9jbGllbnQvY29udHJvbGxlcnMvcGVybWlzc2lvbi5qcyIsImFkbWluL2NsaWVudC9jb250cm9sbGVycy91c2VybWFuYWdlci5qcyIsIm1vYmlsZS9jbGllbnQvY29udHJvbGxlcnMvY2F0ZWdvcnkuanMiLCJtb2JpbGUvY2xpZW50L2NvbnRyb2xsZXJzL2dvb2RzLmpzIiwibW9iaWxlL2NsaWVudC9jb250cm9sbGVycy9ob21lLmpzIiwib3JkZXJzL2NsaWVudC9jb250cm9sbGVycy9vcmRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLGFBQWEsVUFBVSxNQUFNO0lBQzdCLEVBQUUsNkJBQTZCLEtBQUs7SUFDcEMsRUFBRSxlQUFlLE1BQU07RUFDekI7QUNIRjs7Ozs7QUFLQSxJQUFJLFNBQVMsR0FBRyxRQUFROztBQUV4QixPQUFPLEdBQUcsVUFBVSxVQUFVLE1BQU07SUFDaEMsRUFBRTtTQUNHLEtBQUssMERBQTBELEtBQUssTUFBTSxVQUFVLE9BQU8sTUFBTSxZQUFZO1FBQzlHLEVBQUUsZUFBZSxRQUFROztHQUU5QjtBQ1pIOzs7QUFHQSxJQUFJLE1BQU0sUUFBUSxPQUFPLFNBQVMsQ0FBQyxXQUFXOztBQUU5QyxJQUFJLDBCQUFPLFVBQVUsZ0JBQWdCO0lBQ2pDO1NBQ0ssS0FBSyxVQUFVO1lBQ1osWUFBWTtZQUNaLGFBQWE7O1FBRWpCLEtBQUssUUFBUTtZQUNULFlBQVk7WUFDWixhQUFhOztRQUVqQixLQUFLLFVBQVU7WUFDWCxZQUFZO1lBQ1osYUFBYTs7UUFFakIsS0FBSyxlQUFlO1lBQ2hCLFlBQVk7WUFD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TUFBTTs7Ozs7UUFLbEMsTUFBTSxLQUFLLFdBQVcsT0FBTyxRQUFRLFVBQVUsUUFBUTtZQUNuRCxJQUFJLENBQUMsT0FBTyxNQUFNO2dCQUNkLFVBQVUsS0FBSyxtQkFBbUI7Ozs7OztBQU1sRCxJQUFJLFdBQVcsbURBQWUsVUFBVSxRQUFRLE9BQU8sY0FBYztJQUNqRSxTQUFTLFFBQVE7O0lBRWpCLElBQUksTUFBTSxhQUFhO0lBQ3ZCLE1BQU0sSUFBSSxhQUFhLEtBQUssUUFBUSxVQUFVLFFBQVE7UUFDbEQsSUFBSSxDQUFDLE9BQU8sTUFBTTtZQUNkLE9BQU8sUUFBUTs7O0lBR3hCIiwiZmlsZSI6InNpdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgc2hvd0RpYWxvZyA9IGZ1bmN0aW9uIChpbmZvKSB7XHJcbiAgICAkKCcjZGlhbG9nSW5mbyAubW9kYWwtYm9keSBwJykudGV4dChpbmZvKTtcclxuICAgICQoJyNkaWFsb2dJbmZvJykubW9kYWwoJ3Nob3cnKTtcclxufTsiLCIvKipcclxuICogQ3JlYXRlZCBieSB4el9saXUgb24gMjAxNi8zLzE0LlxyXG4gKi9cclxuXHJcbi8vIOmcgOimgeabv+aNouS4uuacjeWKoeWZqOWcsOWdgFxyXG52YXIgc29ja2V0ID0gaW8uY29ubmVjdCgnaHR0cDovL2xvY2FsaG9zdDozMDAwLycpO1xyXG5cclxuc29ja2V0Lm9uKCdub3RpZnknLCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgJChcIiNzb2NrZXRpbmZvXCIpXHJcbiAgICAgICAgLmh0bWwoJzxkaXYgY2xhc3M9XCJidG4gYnRuLXN1Y2Nlc3NcIiBzdHlsZT1cInBvc2l0aW9uOmZpeGVkO1wiPicgKyBkYXRhLm1zZyArICc8L2Rpdj4nKS5mYWRlSW4oMzAwMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoXCIjc29ja2V0aW5mb1wiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgfSk7XHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHh6X2xpdSBvbiAyMDE2LzMvOS5cclxuICovXHJcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYWRtaW4nLCBbJ25nUm91dGUnLCAnbmdGaWxlVXBsb2FkJ10pO1xyXG5cclxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIpIHtcclxuICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgLndoZW4oJy9mcnVpdCcsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0dvb2QnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhZ2VzL2FkbWluX2dvb2QuaHRtbCdcclxuICAgICAgICB9KS5cclxuICAgICAgICB3aGVuKCcvZGljJywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnRGljJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9hZG1pbl9kaWMuaHRtbCdcclxuICAgICAgICB9KS5cclxuICAgICAgICB3aGVuKCcvdXNlcnMnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdVc2VyTWFuYWdlcicsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFnZXMvYWRtaW5fdXNlcl9tYW5hZ2VyLmh0bWwnXHJcbiAgICAgICAgIH0pLlxyXG4gICAgICAgIHdoZW4oJy9wZXJtaXNzaW9uJywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnUGVybWlzc2lvbk1hbmFnZXInLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhZ2VzL2FkbWluX3Blcm1pc3Npb24uaHRtbCdcclxuICAgICAgICB9KS5cclxuICAgICAgICBvdGhlcndpc2Uoe1xyXG4gICAgICAgICAgICByZWRpcmVjdFRvOiAnL3VzZXJzJ1xyXG4gICAgICAgIH0pO1xyXG59KTsiLCIvKipcclxuICogQ3JlYXRlZCBieSB4el9saXUgb24gMjAxNi8zLzkuXHJcbiAqL1xyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ21vYmlsZScsIFsnbmdSb3V0ZSddKTtcclxuXHJcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgIC53aGVuKCcvaG9tZScsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWUnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhZ2VzL2hvbWUuaHRtbCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvY2F0ZWdvcnknLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDYXRlZ29yeScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFnZXMvY2F0ZWdvcnkuaHRtbCdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC53aGVuKCcvZ29vZHMvOmNhdGVnb3J5Jywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnR29vZHMnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhZ2VzL2dvb2RzLmh0bWwnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAub3RoZXJ3aXNlKHtcclxuICAgICAgICAgICAgcmVkaXJlY3RUbzogJy9ob21lJ1xyXG4gICAgICAgIH0pO1xyXG59KTsiLCIvKipcclxuICogQ3JlYXRlZCBieSB4el9saXUgb24gMjAxNi8zLzkuXHJcbiAqL1xyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsnbmdSb3V0ZSddKTtcclxuXHJcbmFwcC5jb25maWcoZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgIC53aGVuKCcvb3JkZXIvaW5kZXgnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdPcmRlckluZGV4JyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9vcmRlcnNfbGlzdC5odG1sJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9vcmRlci9jcmVhdGUnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdPcmRlckNyZWF0ZScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFnZXMvb3JkZXJzX2NyZWF0ZS5odG1sJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLndoZW4oJy9vcmRlci9kZXRhaWwvOl9pZCcsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ09yZGVyRGV0YWlsJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYWdlcy9vcmRlcnNfZGV0YWlsLmh0bWwnXHJcbiAgICAgICAgfSlcclxuICAgICAgICAub3RoZXJ3aXNlKHtcclxuICAgICAgICAgICAgcmVkaXJlY3RUbzogJy9vcmRlci9pbmRleCdcclxuICAgICAgICB9KTtcclxufSk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgeHpfbGl1IG9uIDIwMTYvMy85LlxyXG4gKi9cclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhZG1pbicpO1xyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ0RpYycsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGUpIHtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gJ0RpY3Rpb25hcnkgTWFuYWdlbWVudCc7XHJcblxyXG4gICAgJGh0dHAuZ2V0KCcvZGljcycpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICRzY29wZS5kaWNzID0gcmVzdWx0O1xyXG4gICAgfSk7XHJcblxyXG4gICAgJGh0dHAuZ2V0KCcvZGljVHlwZXMnKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAkc2NvcGUuZGljVHlwZXMgPSByZXN1bHQ7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkc2NvcGUuZ2V0RGljID0gZnVuY3Rpb24gKF9pZCkge1xyXG4gICAgICAgICRodHRwLmdldCgnL2RpY3MvJyArIF9pZCkuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5kaWNFZGl0ID0gcmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jcmVhdGVEaWMgPSBmdW5jdGlvbiAoZGljKSB7XHJcbiAgICAgICAgJGh0dHAucG9zdCgnL2RpY3MnLCBkaWMpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdC5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAkcm91dGUucmVsb2FkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmRlbGV0ZURpYyA9IGZ1bmN0aW9uIChfaWQpIHtcclxuICAgICAgICAkaHR0cC5kZWxldGUoJy9kaWNzLycgKyBfaWQpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LmNvZGUgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgJHJvdXRlLnJlbG9hZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59KTsiLCIvKipcclxuICogQ3JlYXRlZCBieSB4el9saXUgb24gMjAxNi8zLzkuXHJcbiAqL1xyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FkbWluJyk7XHJcblxyXG5hcHAuY29udHJvbGxlcignR29vZCcsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGUsIFVwbG9hZCwgJHRpbWVvdXQpIHtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gJ0dvb2RzIE1hbmFnZW1lbnQnO1xyXG4gICAgJHNjb3BlLmdvb2QgPSB7cGljczogW119O1xyXG5cclxuICAgIC8vIC8v5rWL6K+V55So5pWw5o2uXHJcbiAgICAvLyAkc2NvcGUuZ29vZCA9IHtcclxuICAgIC8vICAgICBuYW1lOiAn6I2J6I6TJyxcclxuICAgIC8vICAgICBkZXNjOiAn5o+P6L+wJyxcclxuICAgIC8vICAgICBjYXRlZ29yeTogJ0JlcnJ5JyxcclxuICAgIC8vICAgICBwaWNzOiBbXSxcclxuICAgIC8vICAgICBzcGVjOiAnMWtnJyxcclxuICAgIC8vICAgICBwcm92ZW5hbmNlOiAn5LiK5rW3JyxcclxuICAgIC8vICAgICBzaGVsZkxpZmU6IDEsXHJcbiAgICAvLyAgICAgc3RvcmFnZTogJ+mYtOWHiScsXHJcbiAgICAvLyAgICAgcHJpY2U6IDEwLFxyXG4gICAgLy8gICAgIHNhbGVzOiAwLFxyXG4gICAgLy8gICAgIGJhbGFuY2U6IDEyMFxyXG4gICAgLy8gfTtcclxuXHJcbiAgICAkaHR0cC5nZXQoJy9nb29kQ2F0ZWdvcmllcycpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgIGNvbW1vbkdldFBhZ2VkR29vZHMoMSk7XHJcbiAgICAgICAgdG9nZ2xlQ3JlYXRlVXBkYXRlKGZhbHNlKTtcclxuICAgICAgICAkc2NvcGUuZ29vZENhdGVnb3JpZXMgPSByZXN1bHQ7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkc2NvcGUuZ2V0UGFnZWRHb29kcyA9IGZ1bmN0aW9uIChwYWdlKSB7XHJcbiAgICAgICAgY29tbW9uR2V0UGFnZWRHb29kcyhwYWdlKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmVkaXRHb29kID0gZnVuY3Rpb24gKF9pZCkge1xyXG4gICAgICAgICRodHRwLmdldCgnL2dvb2RzLycgKyBfaWQpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAoIXJlc3VsdC5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZ29vZCA9IHJlc3VsdDtcclxuICAgICAgICAgICAgICAgIHRvZ2dsZUNyZWF0ZVVwZGF0ZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgICQoJyNlZGl0Rm9ybScpLmFkZENsYXNzKCdhbmltYXRlZCBib3VuY2VJblVwJykub25lKCd3ZWJraXRBbmltYXRpb25FbmQgbW96QW5pbWF0aW9uRW5kIE1TQW5pbWF0aW9uRW5kIG9hbmltYXRpb25lbmQgYW5pbWF0aW9uZW5kJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyNlZGl0Rm9ybScpLnJlbW92ZUNsYXNzKCdhbmltYXRlZCBib3VuY2VJblVwJylcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5zYXZlR29vZCA9IGZ1bmN0aW9uIChnb29kKSB7XHJcbiAgICAgICAgaWYgKCEkc2NvcGUuaXNVcGRhdGUpIHtcclxuICAgICAgICAgICAgJGh0dHAucG9zdCgnL2dvb2RzJywgZ29vZCkuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdC5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/mlrDlu7rmiJDlip/ot7PliLDmlrDllYblk4HmiYDlnKjpobVcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucGFnZXMuY3VycmVudCA9IE1hdGguY2VpbCgoJHNjb3BlLmdvb2RzVG90YWwgKyAxKSAvICRzY29wZS5wYWdlcy5saW1pdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbW9uR2V0UGFnZWRHb29kcygkc2NvcGUucGFnZXMuY3VycmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmdvb2QgPSB7cGljczogW119O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzaG93RGlhbG9nKCfllYblk4HliJvlu7rmiJDlip8nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAkaHR0cC5wdXQoJy9nb29kcy8nICsgZ29vZC5faWQsIGdvb2QpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5jb2RlID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tb25HZXRQYWdlZEdvb2RzKCRzY29wZS5wYWdlcy5jdXJyZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB0b2dnbGVDcmVhdGVVcGRhdGUoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5nb29kID0ge3BpY3M6IFtdfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0RpYWxvZygn5ZWG5ZOB5pu05paw5oiQ5YqfJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmRlbGV0ZUdvb2QgPSBmdW5jdGlvbiAoX2lkKSB7XHJcbiAgICAgICAgJHNjb3BlLmdvb2RUb0RlbGV0ZSA9IF9pZDtcclxuICAgICAgICAkKCcjZGlhbG9nRGVsZXRlJykubW9kYWwoJ3Nob3cnKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLmNvbmZpcm1EZWxldGUgPSBmdW5jdGlvbiAoX2lkKSB7XHJcbiAgICAgICAgJGh0dHAuZGVsZXRlKCcvZ29vZHMvJyArIF9pZCkuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuY29kZSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAvL+WIoOmZpOW9k+mhteacgOWQjuS4gOadoeWQjui3s+WIsOWJjeS4gOmhtVxyXG4gICAgICAgICAgICAgICAgaWYgKCgoJHNjb3BlLmdvb2RzVG90YWwgLSAxKSAlIDEwID09IDApICYmICEkc2NvcGUucGFnZXMuaGFzTmV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wYWdlcy5jdXJyZW50IC09IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb21tb25HZXRQYWdlZEdvb2RzKCRzY29wZS5wYWdlcy5jdXJyZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUudXBsb2FkRmlsZXMgPSBmdW5jdGlvbiAoZmlsZXMpIHtcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2goZmlsZXMsIGZ1bmN0aW9uIChmaWxlKSB7XHJcbiAgICAgICAgICAgIGZpbGUudXBsb2FkID0gVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvcGljcycsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7ZmlsZTogZmlsZX1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBmaWxlLnVwbG9hZC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5nb29kLnBpY3MucHVzaChyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvck1zZyA9IHJlc3BvbnNlLnN0YXR1cyArICc6ICcgKyByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgICAgICBmaWxlLnByb2dyZXNzID0gTWF0aC5taW4oMTAwLCBwYXJzZUludCgxMDAuMCAqXHJcbiAgICAgICAgICAgICAgICAgICAgZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGNvbW1vbkdldFBhZ2VkR29vZHMgPSBmdW5jdGlvbiAocGFnZSkge1xyXG4gICAgICAgICRodHRwLmdldCgnL2dvb2RzUGFnZWQ/cGFnZT0nICsgcGFnZSkuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5nb29kcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmdvb2RzLnB1c2guYXBwbHkoJHNjb3BlLmdvb2RzLCByZXN1bHQuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUucGFnZXMgPSByZXN1bHQucGFnZXM7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUucGFnZUFycmF5ID0gZ2V0UGFnZUFycmF5KHJlc3VsdC5wYWdlcy5jdXJyZW50LCByZXN1bHQucGFnZXMudG90YWwpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmdvb2RzVG90YWwgPSByZXN1bHQuaXRlbXMudG90YWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGdldFBhZ2VBcnJheSA9IGZ1bmN0aW9uIChjdXJyZW50LCB0b3RhbCkge1xyXG4gICAgICAgIHZhciBzdGFydCA9IGN1cnJlbnQgPiA1ID8gY3VycmVudCAtIDQgOiAxO1xyXG4gICAgICAgIHZhciBlbmQgPSB0b3RhbCAtIGN1cnJlbnQgPiAzID8gY3VycmVudCArIDQgOiB0b3RhbDtcclxuICAgICAgICByZXR1cm4gXy5yYW5nZShzdGFydCwgZW5kICsgMSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciB0b2dnbGVDcmVhdGVVcGRhdGUgPSBmdW5jdGlvbiAoaXNVcGRhdGUpIHtcclxuICAgICAgICAkc2NvcGUuaXNVcGRhdGUgPSBpc1VwZGF0ZTtcclxuICAgICAgICAkc2NvcGUuYnV0dG9uTmFtZSA9IGlzVXBkYXRlID8gJ+e8lui+keWVhuWTgScgOiAn5paw5bu65ZWG5ZOBJztcclxuICAgIH07XHJcbn0pOyIsIlxyXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FkbWluJyk7XHJcbnZhciB0aXRsZSA9ICdQZXJtaXNzaW9uIE1hbmFnZW1lbnQnO1xyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ1Blcm1pc3Npb25NYW5hZ2VyJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZSkge1xyXG4gICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcclxuXHJcbiAgICAkaHR0cC5nZXQoJy9wZXJtaXNzaW9ucycpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCl7XHJcbiAgICAgICAgJHNjb3BlLlBlcm1pc3Npb25zID0gcmVzdWx0O1xyXG4gICAgfSk7XHJcblxyXG4gICAgJGh0dHAuZ2V0KCcvcm9sZUNhdGVnb3JpZXMnKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpe1xyXG4gICAgICAgICRzY29wZS5Sb2xlQ2F0ZWdvcmllcyA9IHJlc3VsdDtcclxuICAgIH0pO1xyXG5cclxuICAgICRzY29wZS5QZXJtaXNzaW9uID0ge1xyXG4gICAgICAgIHBlcm1pc3Npb25UeXBlOiAnJyxcclxuICAgICAgICBuYW1lOiAnJyxcclxuICAgICAgICBmZWF0dXJlSGFzaDogJycsXHJcbiAgICAgICAgZGVzY3JpcHRpb246ICcnXHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jcmVhdGVQZXJtaXNzaW9uID0gZnVuY3Rpb24gKHBlcm1pc3Npb24pIHtcclxuXHJcbiAgICAgICAgJGh0dHAucG9zdCgnL3Blcm1pc3Npb25zJywgcGVybWlzc2lvbikuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICRyb3V0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZGVsZXRlUGVybWlzc2lvbiA9IGZ1bmN0aW9uKF9pZCl7XHJcbiAgICAgICAgJGh0dHAuZGVsZXRlKCcvcGVybWlzc2lvbnMvJyArIF9pZCkuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuY29kZSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAkcm91dGUucmVsb2FkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IEplc3NlIFFpbiBvbiAzLzE5LzIwMTYuXHJcbiAqL1xyXG5cclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhZG1pbicpO1xyXG52YXIgdGl0bGUgPSAnVXNlciBNYW5hZ2VtZW50JztcclxuXHJcbmFwcC5jb250cm9sbGVyKCdVc2VyTWFuYWdlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGUpIHtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XHJcblxyXG4gICAgJGh0dHAuZ2V0KCcvdXNlcnMnKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpe1xyXG4gICAgICAgICRzY29wZS5Vc2VycyA9IHJlc3VsdDtcclxuICAgIH0pO1xyXG5cclxuICAgICRodHRwLmdldCgnL3JvbGVDYXRlZ29yaWVzJykuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KXtcclxuICAgICAgICAkc2NvcGUuUm9sZUNhdGVnb3JpZXMgPSByZXN1bHQ7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkc2NvcGUuVXNlciA9IHtcclxuICAgICAgICBuYW1lOiAnJyxcclxuICAgICAgICB3ZUNoYXRJZDogJycsXHJcbiAgICAgICAgbW9iaWxlOiAnJyxcclxuICAgICAgICBlbWFpbDogJycsXHJcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxyXG4gICAgICAgIHJvbGU6ICcnXHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jcmVhdGVVc2VyID0gZnVuY3Rpb24gKHVzZXIpIHtcclxuXHJcbiAgICAgICAgJGh0dHAucG9zdCgnL3VzZXJzJywgdXNlcikuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmICghcmVzdWx0LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICRyb3V0ZS5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUuZGVsZXRlVXNlciA9IGZ1bmN0aW9uKF9pZCl7XHJcbiAgICAgICAgJGh0dHAuZGVsZXRlKCcvdXNlcnMvJyArIF9pZCkuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuY29kZSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAkcm91dGUucmVsb2FkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHh6X2xpdSBvbiAyMDE2LzMvOS5cclxuICovXHJcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnbW9iaWxlJyk7XHJcblxyXG5hcHAuY29udHJvbGxlcignQ2F0ZWdvcnknLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCkge1xyXG4gICAgZG9jdW1lbnQudGl0bGUgPSAnQ2F0ZWdvcnknO1xyXG5cclxuICAgICRodHRwLmdldCgnL2dvb2RDYXRlZ29yaWVzJykuc3VjY2VzcyhmdW5jdGlvbiAocmVzdWx0KSB7XHJcbiAgICAgICAgJHNjb3BlLmdvb2RDYXRlZ29yaWVzID0gcmVzdWx0O1xyXG4gICAgfSk7XHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHh6X2xpdSBvbiAyMDE2LzMvOS5cclxuICovXHJcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnbW9iaWxlJyk7XHJcblxyXG5hcHAuY29udHJvbGxlcignR29vZHMnLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJHJvdXRlUGFyYW1zKSB7XHJcbiAgICBkb2N1bWVudC50aXRsZSA9ICdHb29kcyBMaXN0JztcclxuICAgICRzY29wZS5jYXRlZ29yeSA9ICRyb3V0ZVBhcmFtcy5jYXRlZ29yeTtcclxuXHJcbiAgICAkaHR0cC5nZXQoJy9nb29kcz9jYXRlZ29yeT0nICsgJHNjb3BlLmNhdGVnb3J5KS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICBpZiAoIXJlc3VsdC5jb2RlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5nb29kcyA9IHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgeHpfbGl1IG9uIDIwMTYvMy85LlxyXG4gKi9cclxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdtb2JpbGUnKTtcclxuXHJcbmFwcC5jb250cm9sbGVyKCdIb21lJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZSkge1xyXG4gICAgZG9jdW1lbnQudGl0bGUgPSAnSG9tZSc7XHJcbn0pOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IHh6X2xpdSBvbiAyMDE2LzMvOS5cclxuICovXHJcbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJyk7XHJcblxyXG5hcHAuY29udHJvbGxlcignT3JkZXJJbmRleCcsIGZ1bmN0aW9uICgkc2NvcGUsICRodHRwLCAkcm91dGUpIHtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gJ09yZGVyIExpc3QnO1xyXG5cclxuICAgICRodHRwLmdldCgnL29yZGVycycpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICRzY29wZS5vcmRlcnMgPSByZXN1bHQ7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkc2NvcGUuZGVsZXRlT3JkZXIgPSBmdW5jdGlvbiAoX2lkKSB7XHJcbiAgICAgICAgJGh0dHAuZGVsZXRlKCcvb3JkZXJzLycgKyBfaWQpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAkcm91dGUucmVsb2FkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59KTtcclxuXHJcbnZhciBmcnVpdHMgPSBbXHJcbiAgICB7XHJcbiAgICAgICAgZnJ1aXRfbmFtZTogJ0FwcGxlJyxcclxuICAgICAgICB1bml0X3ByaWNlOiAxLjIsXHJcbiAgICAgICAgZnJ1aXRfcXVhbnRpdHk6IDAsXHJcbiAgICAgICAgc2VsZWN0ZDogZmFsc2VcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgZnJ1aXRfbmFtZTogJ0JhbmFuYScsXHJcbiAgICAgICAgdW5pdF9wcmljZTogMi4zLFxyXG4gICAgICAgIGZydWl0X3F1YW50aXR5OiAwLFxyXG4gICAgICAgIHNlbGVjdGQ6IGZhbHNlXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGZydWl0X25hbWU6ICdQaXRheWEnLFxyXG4gICAgICAgIHVuaXRfcHJpY2U6IDMuNCxcclxuICAgICAgICBmcnVpdF9xdWFudGl0eTogMCxcclxuICAgICAgICBzZWxlY3RkOiBmYWxzZVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBmcnVpdF9uYW1lOiAnTWFuZ28nLFxyXG4gICAgICAgIHVuaXRfcHJpY2U6IDQuNSxcclxuICAgICAgICBmcnVpdF9xdWFudGl0eTogMCxcclxuICAgICAgICBzZWxlY3RkOiBmYWxzZVxyXG4gICAgfV07XHJcblxyXG5hcHAuY29udHJvbGxlcignT3JkZXJDcmVhdGUnLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCwgJGxvY2F0aW9uKSB7XHJcbiAgICBkb2N1bWVudC50aXRsZSA9ICdPcmRlciBDcmVhdGUnO1xyXG5cclxuICAgICRzY29wZS5mcnVpdHMgPSBmcnVpdHM7XHJcblxyXG4gICAgJHNjb3BlLm9yZGVyID0ge1xyXG4gICAgICAgIGN1c3RvbWVyOiAnbGVvJyxcclxuICAgICAgICBhbW91bnQ6IDAsXHJcbiAgICAgICAgZGVsaXZlcnlfZGF0ZTogbmV3IERhdGUoKSxcclxuICAgICAgICBmcnVpdHM6IFtdXHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jYWxjVG90YWxBbW91bnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHRvdGFsID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpIGluICRzY29wZS5mcnVpdHMpIHtcclxuICAgICAgICAgICAgdmFyIGZydWl0ID0gJHNjb3BlLmZydWl0c1tpXTtcclxuICAgICAgICAgICAgaWYgKGZydWl0LnNlbGVjdGQpIHtcclxuICAgICAgICAgICAgICAgIHRvdGFsICs9IGZydWl0LnVuaXRfcHJpY2UgKiBmcnVpdC5mcnVpdF9xdWFudGl0eTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAkc2NvcGUub3JkZXIuYW1vdW50ID0gdG90YWw7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5jcmVhdGVPcmRlciA9IGZ1bmN0aW9uIChvcmRlcikge1xyXG4gICAgICAgIGZvciAodmFyIGkgaW4gJHNjb3BlLmZydWl0cykge1xyXG4gICAgICAgICAgICB2YXIgZnJ1aXQgPSAkc2NvcGUuZnJ1aXRzW2ldO1xyXG4gICAgICAgICAgICBpZiAoZnJ1aXQuc2VsZWN0ZCkge1xyXG4gICAgICAgICAgICAgICAgb3JkZXIuZnJ1aXRzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGZydWl0X25hbWU6IGZydWl0LmZydWl0X25hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZnJ1aXRfcXVhbnRpdHk6IGZydWl0LmZydWl0X3F1YW50aXR5XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJGh0dHAucG9zdCgnL29yZGVycycsIG9yZGVyKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgaWYgKCFyZXN1bHQuY29kZSkge1xyXG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9vcmRlci9kZXRhaWwvJyArIHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbn0pO1xyXG5cclxuYXBwLmNvbnRyb2xsZXIoJ09yZGVyRGV0YWlsJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsICRyb3V0ZVBhcmFtcykge1xyXG4gICAgZG9jdW1lbnQudGl0bGUgPSAnT3JkZXIgRGV0YWlsJztcclxuXHJcbiAgICB2YXIgX2lkID0gJHJvdXRlUGFyYW1zLl9pZDtcclxuICAgICRodHRwLmdldCgnL29yZGVycy8nICsgX2lkKS5zdWNjZXNzKGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICBpZiAoIXJlc3VsdC5jb2RlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5vcmRlciA9IHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
