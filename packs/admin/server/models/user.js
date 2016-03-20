/**
 * Created by xz_liu on 2016/3/17.
 */
var mongoose = require('mongoose');
require('../../../shared/server/mongoconn');

/**
 * 用户
 */
var UserSchema = new mongoose.Schema({

    Name: String,

    AppUserId: String,

    Mobile: String,

    Password: String,

    Description: String,

    Enabled: { type: Boolean, default: false},

    WeChatId: String,

    IsDeleted: { type: Boolean, default: false},

    LastLoginTime: Date,

    CreateTime: { type: Date, default: Date.now},

    ActiveTime: Date
});

module.exports.User = mongoose.model('Users', UserSchema);