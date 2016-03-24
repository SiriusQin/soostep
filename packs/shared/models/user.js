/**
 * Created by xz_liu on 2016/3/17.
 */
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({

    name: String,

    appUserId: String,

    mobile: String,

    password: String,

    description: String,

    enabled: { type: Boolean, default: false},

    weChatId: String,

    isDeleted: { type: Boolean, default: false},

    lastLoginTime: Date,

    createTime: { type: Date, default: Date.now},

    activeTime: Date
});

mongoose.model('User', UserSchema);