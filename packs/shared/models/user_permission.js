
var mongoose = require('mongoose');

var UserPermissionSchema = new mongoose.Schema({

    UserId: mongoose.Schema.Types.ObjectId,

    PermissionId: mongoose.Schema.Types.ObjectId,

    //Pid: String,

    IsDeleted: Boolean,

    AssignedTime: { type: Date, default: Date.now},

    //AdminUserId: mongoose.Schema.Types.ObjectId,

    Enabled: { type: Boolean, default: true}
});

mongoose.model('UserPermission', UserPermissionSchema);