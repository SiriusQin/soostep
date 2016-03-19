/**
 * Created by Jesse Qin on 3/19/2016.
 */

var Permission = require('../models/permissions').Permissions;

module.exports.permissionList = function (req, res) {
    Permission.find().lean().exec(function (err, doc) {
        if (err) {
            res.json({code: 500, message: err});
        }
        else {
            res.json(doc);
        }
    });
};

module.exports.permissionDetail = function (req, res) {
    Permission.findById(req.params._id).lean()
        .exec(function (err, doc) {
            if (err) {
                res.json({code: 500, message: err});
            }
            else {
                res.json(doc);
            }
        });
};

module.exports.createPermission = function (req, res) {
    var permission = new Permission(req.body);

    permission.save(function (err) {
        if (err) {
            res.json({code: 500, message: err});
        }
        else {
            res.json(permission._id.toString());
        }
    });
};


module.exports.editPermission = function (req, res) {
    //Not implemented.
    res.send('edit ' + req.body._id);
};

module.exports.deletePermission = function (req, res) {
    Permission.remove({_id: req.params._id}, function (err) {
        if (err) {
            res.json({code: 500, message: err});
        }
        else {
            res.json({code: 0});
        }
    });
};