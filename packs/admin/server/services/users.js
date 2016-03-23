
var User = require('../../../shared/models').User;

module.exports.userList = function (req, res) {
    User.find().lean().exec(function (err, user) {
        if (err) {
            res.json({code: 500, message: err});
        }
        else {
            res.json(user);
        }
    });
};

module.exports.userDetail = function (req, res) {
    User.findById(req.params._id).lean()
        .exec(function (err, user) {
            if (err) {
                res.json({code: 500, message: err});
            }
            else {
                res.json(user);
            }
        });
};

module.exports.createUser = function (req, res) {
    var user = new User(req.body);

    user.save(function (err) {
        if (err) {
            res.json({code: 500, message: err});
        }
        else {
            res.json(user._id.toString());
        }
    });
};

module.exports.editUser = function (req, res) {
    //Not implemented.
    res.send('edit ' + req.body._id);
};

module.exports.deleteUser = function (req, res) {
    //TODO: set isDeleted to true
    User.remove({_id: req.params._id}, function (err) {
        if (err) {
            res.json({code: 500, message: err});
        }
        else {
            res.json({code: 0});
        }
    });
};
