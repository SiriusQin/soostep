/**
 * Created by Jesse Qin on 3/19/2016.
 */

var mongoose = require('mongoose');
require('../../../shared/server/mongoconn');

/**
 * 用户
 */
var UserPermissionSchema = new mongoose.Schema({

    UserId: ObjectId,

    PermissionId: ObjectId,

    Pid: String,

    IsDeleted: Boolean,

    AssignedTime: { type: Date, default: Date.now},

    AdminUserId: ObjectId,

    Enabled: { type: Boolean, default: true}
});

module.exports.UserPermission = mongoose.model('UserPermission', UserPermissionSchema);