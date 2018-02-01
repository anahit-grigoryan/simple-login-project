const hashing = require('../security/hashing');
const user_repository = require ('../repository/user-repository');

function getUsers(done) {

    user_repository.getAll((err,users)=>{
        if(err)return done(err);
        done(null,users);
    });
}

function findUserByEmail(email, done) {
    user_repository.findByAttribute('email',email,(err,user)=>{
        if(err)return done(err);
        done(null,user);
    });

}

function findUser(user, done) {
    findUserByEmail(user.email, (err, foundUser) => {
        if (err) return done(err);
        if (foundUser) {
            if (hashing.verify(user.password, foundUser.password)) return done(null, foundUser);
        }
        return done(null, null);
    });
}

function addUser(user, done) {
    findUserByEmail(user.email, (err, foundUser) => {
        if (err) return done(err);
        if (foundUser) {
            return done(null, false);
        }

        user.password = hashing.generateHash(user.password).passwordHash;
        user_repository.add(user,(err,isOk)=>{
            if(err) return done(err);
            done(null,isOk);
        })

    });
}

function updateUser(user, done) {
    user.password = hashing.generateHash(user.password.toString()).passwordHash;
    user_repository.update(user,(err,isOk)=>{
        if(err) return done(err);
        done(null,isOk);
    })

}

function deleteUserById(user_id, done) {

    user_repository.deleteById(user_id,(err,isOk)=>{
        if(err) return done(err);
        done(null,isOk);
    })
}

module.exports.getUsers = getUsers;
module.exports.findUserByEmail = findUserByEmail;
module.exports.addUser = addUser;
module.exports.updateUser = updateUser;
module.exports.deleteUserById = deleteUserById;
module.exports.findUser = findUser;

