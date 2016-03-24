/**
 * Created by xz_liu on 2016/3/18.
 */
var router = require('express').Router();
var dic = require('./services/dic');
var good = require('./services/good');
var user = require('./services/users');
var permission = require('./services/permissions');

// dictionary service
router.get('/dics', dic.list)
    .post('/dics', dic.create);
router.get('/dics/:_id', dic.detail)
    .put('/dics/:_id', dic.update)
    .delete('/dics/:_id', dic.delete);
router.get('/dicTypes', dic.getDicTypes);

// good service
router.get('/goods', good.list)
    .get('/goodsPaged', good.listPaged)
    .post('/goods', good.create);
router.get('/goods/:_id', good.detail)
    .put('/goods/:_id', good.update)
    .delete('/goods/:_id', good.delete);
router.get('/goodCategories', good.getgoodCategories);
router.post('/pics', good.uploadPics);

router.get('/users', user.userList)
    .post('/users', user.createUser);

router.get('/users/:_id', user.userDetail)
    .put('/users/:_id', user.editUser)
    .delete('/users/:_id', user.deleteUser);

router.get('/permissions', permission.permissionList)
    .post('/permissions', permission.createPermission);

router.delete('/permissions/:_id',permission.deletePermission);

module.exports = router;