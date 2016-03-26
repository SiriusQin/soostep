/**
 * Created by xz_liu on 2016/3/17.
 */
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({

    name: String,

    appUserId: [String],

    mobile: String,

    email: String,

    password: String,

    description: String,

    role: String,

    enabled: { type: Boolean, default: false},

    weChatId: String,

    isDeleted: { type: Boolean, default: false},

    lastLoginTime: [Date],

    createTime: { type: Date, default: Date.now},

    activeTime: [Date]
});

UserSchema.index({ name: 1 });

mongoose.model('User', UserSchema);