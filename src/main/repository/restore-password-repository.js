const restore_password = require('../models/restore-password');

function getMaxId(done) {
    restore_password.aggregate([
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
    restore_password.find((err, restore_passwods) => {
        if (err) return done(err);
        done(null, restore_passwods);

    })
}

function findByAttribute(att_name, att_value, done) {

    let queryObj = {};
    queryObj[att_name] = att_value;
    restore_password.findOne(queryObj, function (err, code) {
        if (err) return done(err);
        code = code ? code._doc : code;
        done(null, code);
    });
}


function add(code, done) {
    getMaxId((err, id) => {
        if (err) return done(err);
        code.id = ++id;
        restore_password.create(code, (err) => {
            if (err) return done(err);
            done(null, true);
        });
    });
}

function update(code, done) {
    restore_password.update({_id: code._id}, {
        secure_code: code.secure_code
    }, (err, affected, resp) => {
        if (err) return done(err);
        done(null, true);
    });
}

function deleteById(code_id, done) {
    restore_password.deleteById(code_id, (err) => {
        if (err) return done(err);
        done(null, true);
    })
}

module.exports.getAll = getAll;
module.exports.findByAttribute = findByAttribute;
module.exports.add = add;
module.exports.update = update;
module.exports.deleteById = deleteById;



