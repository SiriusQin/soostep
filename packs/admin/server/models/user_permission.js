/**
 * Created by Jesse Qin on 3/19/2016.
 */

var mongoose = require('mongoose');
require('../../../shared/server/mongoconn');

/**
 * 用户
 */
var UserPermissionSchema = new mongoose.Schema({

    userId: ObjectId,

    permissionId: ObjectId,

    pid: String,

    isDeleted: Boolean,

    assignedTime: Date,

    adminUserId: ObjectId,

    enabled: Boolean
});

module.exports.UserPermission = mongoose.model('UserPermission', UserPermissionSchema);