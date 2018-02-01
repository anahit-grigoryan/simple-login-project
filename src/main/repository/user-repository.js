const User = require('../models/User');

function getMaxId(done) {
    User.aggregate([
            {$group: {_id: null, maxId: {$max: '$id'}}},
            {$project: {_id: 0, maxId: 1}}
        ],
        function (err, res) {
            if (err) return done(err);
            let id = res[0] && res[0].maxId ? res[0].maxId : 0;
            done(null, id);
        }
    );

}

function getAll(done) {
    User.find((err, users) => {
        if (err) return done(err);
        done(null, users);

    })
}

function findByAttribute(att_name, att_value, done) {

    let queryObj = {};
    queryObj[att_name] = att_value;
    User.findOne(queryObj, function (err, user) {
        if (err) return done(err);
        user = user ? user._doc : user;
        done(null, user);
    });
}


function add(user, done) {
    getMaxId((err, id) => {
        if (err) return done(err);
        user.id = ++id;
        User.create(user, (err) => {
            if (err) return done(err);
            done(null, true);
        });
    });
}

function update(user, done) {
    User.update({_id: user._id}, {
        password: user.password
    }, (err, affected, resp) => {
        if (err) return done(err);
        done(null, true);
    });
}

function deleteById(user_id, done) {
    User.deleteById(user_id, (err) => {
        if (err) return done(err);
        done(null, true);
    })
}

module.exports.getAll = getAll;
module.exports.findByAttribute = findByAttribute;
module.exports.add = add;
module.exports.update = update;
module.exports.deleteById = deleteById;



