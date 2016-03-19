/**
 * Created by xz_liu on 2016/3/17.
 */
var mongoose = require('mongoose');
require('../../../shared/server/mongoconn');

/**
 * 用户
 */
var UserSchema = new mongoose.Schema({

    name: String,

    appUserId: String,

    mobile: String,

    password: String,

    description: String,

    enabled: Boolean,

    weChatId: String,

    isDeleted: Boolean,

    lastLoginTime: Date,

    createTime: Date,

    activeTime: Date
});

module.exports.Users = mongoose.model('Users', UserSchema);