/**
 * Created by Jesse Qin on 3/19/2016.
 */

var mongoose = require('mongoose');
require('../../../shared/server/mongoconn');

/**
 * Permissions
 */
var PermissionSchema = new mongoose.Schema({

    description: String,

    featureHash: String,

    permission: String
});

module.exports.Permissions = mongoose.model('Permissions', PermissionSchema);
