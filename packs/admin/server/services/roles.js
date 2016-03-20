/**
 * Created by Jesse Qin on 3/20/2016.
 */

var Role = require('../models/role').Role;

var Permission = require('../models/permission').Permission;

module.exports.roleList = function (req, res) {
    Role.find().lean().exec(function (err, role) {
        if (err) {
            res.json({code: 500, message: err});
        }
        else {
            res.json(role);
        }
    });
};
