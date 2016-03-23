
var mongoose = require('mongoose');

var UserPermissionSchema = new mongoose.Schema({

    UserId: ObjectId,

    PermissionId: ObjectId,

    //Pid: String,

    IsDeleted: Boolean,

    AssignedTime: { type: Date, default: Date.now},

    //AdminUserId: ObjectId,

    Enabled: { type: Boolean, default: true}
});

mongoose.model('UserPermission', UserPermissionSchema);