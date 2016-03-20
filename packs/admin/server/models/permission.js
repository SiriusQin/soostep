/**
 * Created by Jesse Qin on 3/19/2016.
 */

var mongoose = require('mongoose');
require('../../../shared/server/mongoconn');

var PermissionSchema = new mongoose.Schema({

    premissionId: mongoose.Schema.Types.ObjectId,

    permissionType: String,

    name: String,

    featureHash: String,

    description: String,

    isActived: { type: Boolean, default: false }
});

var PermissionModel = mongoose.model('Permissions', PermissionSchema);

PermissionModel.find(function(err, permissions){

    if(permissions.length == 0){

        PermissionModel.create([
            {
                premissionId: new mongoose.Types.ObjectId("56ee60d4490e49600a44425f"),
                permissionType: 'permissionType01',
                name: 'permission01',
                featureHash: '',
                description: '',
                isActived: true
            },
            {
                premissionId: new mongoose.Types.ObjectId("56ee60d4490e49600a444260"),
                permissionType: 'permissionType02',
                name: 'permission02',
                featureHash: '',
                description: '',
                isActived: true
            },
            {
                premissionId: new mongoose.Types.ObjectId("56ee60d4490e49600a444261"),
                permissionType: 'permissionType03',
                name: 'permission03',
                featureHash: '',
                description: '',
                isActived: true
            },
            {
                premissionId: new mongoose.Types.ObjectId("56ee60d4490e49600a444262"),
                permissionType: 'permissionType01',
                name: 'permission04',
                featureHash: '',
                description: '',
                isActived: true
            },
            {
                premissionId: new mongoose.Types.ObjectId("56ee60d4490e49600a444263"),
                permissionType: 'permissionType02',
                name: 'permission05',
                featureHash: '',
                description: '',
                isActived: true
            },
            {
                premissionId: new mongoose.Types.ObjectId("56ee60d4490e49600a444264"),
                permissionType: 'permissionType03',
                name: 'permission06',
                featureHash: '',
                description: '',
                isActived: true
            }]);
    }
});

module.exports.Permission = PermissionModel;
