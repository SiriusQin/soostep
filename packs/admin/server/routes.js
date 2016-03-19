/**
 * Created by xz_liu on 2016/3/18.
 */
var router = require('express').Router();
var dic = require('./services/dic');
var user = require('./services/users');

// dic service
router.get('/dics', dic.list)
    .post('/dics', dic.create);

router.get('/dics/:_id', dic.detail)
    .put('/dics/:_id', dic.edit)
    .delete('/dics/:_id', dic.delete);

router.get('/dicTypes', dic.getDicTypes);

router.get('/users', user.userList)
    .post('/users', user.createUser);

router.get('/users/:_id', user.userDetail)
    .put('/users/:_id', user.editUser)
    .delete('/users/:_id', user.deleteUser);

module.exports = router;