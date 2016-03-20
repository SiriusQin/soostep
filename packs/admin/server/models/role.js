/**
 * Created by Jesse Qin on 3/20/2016.
 */

var mongoose = require('mongoose');
require('../../../shared/server/mongoconn');

var RoleSchema = new mongoose.Schema({

    roleId: mongoose.Schema.Types.ObjectId,

    roleType: String,

    name: String,

    displayName: Number,

    description: String,

    permissionIds: mongoose.Schema.Types.Mixed,

    isActived: { type: Boolean, default: true }
});

var RolesModel = mongoose.model('Roles', RoleSchema);

RolesModel.find(function(err, roles){

    if(roles.length == 0){

        RolesModel.create([
            {
                roleId: new mongoose.Types.ObjectId("56ee510848dbdbf8108ee70c"),
                roleType: 'Admin',
                name: 'Administrator',
                desplayName: 'Admin',
                description: 'This is a admin role',
                permissionIds: [new mongoose.Types.ObjectId("56ee60d4490e49600a44425f"), new mongoose.Types.ObjectId("56ee60d4490e49600a444260")],
                isActived: true
            },
            {
                roleId: new mongoose.Types.ObjectId("56ee510848dbdbf8108ee70d"),
                roleType: 'Agent',
                name: 'Agent',
                desplayName: 'Agent',
                description: 'This is a Agent role',
                permissionIds: [new mongoose.Types.ObjectId("56ee60d4490e49600a444261"), new mongoose.Types.ObjectId("56ee60d4490e49600a444262")],
                isActived: true
            },
            {
                roleId: new mongoose.Types.ObjectId("56ee510848dbdbf8108ee70e"),
                roleType: 'User',
                name: 'Common User',
                desplayName: 'Common User',
                description: 'This is a CommonUser role',
                permissionIds: [new mongoose.Types.ObjectId("56ee60d4490e49600a444263"), new mongoose.Types.ObjectId("56ee60d4490e49600a444264")],
                isActived: true
            }]);
    }
});

module.exports.Role = RolesModel;
