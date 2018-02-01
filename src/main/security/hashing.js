const crypto = require('crypto');


const hashingAlgorithm = function(password, salt){
    const hash = crypto.createHmac(process.env.HASHING_ALGORITHM_NAME, salt);
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    const salt = process.env.SALT;
    const passwordData = hashingAlgorithm(userpassword, salt);
    return passwordData;
}

function verify(value,hashvalue){
    return saltHashPassword(value).passwordHash === hashvalue;
}

module.exports.generateHash = saltHashPassword;
module.exports.verify = verify;

