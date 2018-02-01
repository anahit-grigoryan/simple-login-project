const hashing = require('../security/hashing');
const mail = require('../mail/send-mail');
const restore_password_repository = require ('../repository/restore-password-repository');

function getCodes(done) {

    restore_password_repository.getAll((err,codes)=>{
        if(err)return done(err);
        done(null,codes);
    });
}

function findCodeByUserEmail(user_email, done) {

    restore_password_repository.findByAttribute('user_email',user_email,(err,code)=>{
        if(err)return done(err);
        done(null,code);
    });
}

function addAndSendCode(code, done) {
    findCodeByUserEmail(code.user_email, (err, foundCode) => {
        if (err) return done(err);
        if (foundCode) {
            mail.sendMail(code.user_email, code.secure_code.toString());
            foundCode.secure_code = code.secure_code;
            updateCode(foundCode, done);
        } else {
            mail.sendMail(code.user_email, code.secure_code.toString());
            code.secure_code = hashing.generateHash(code.secure_code.toString()).passwordHash;
            restore_password_repository.add(code,(err,isOk)=>{
                if(err) return done(err);
                done(null,isOk);
            });
        }
    });
}

function updateCode(code, done) {

    code.secure_code = hashing.generateHash(code.secure_code.toString()).passwordHash;
    restore_password_repository.update(code,(err,isOk)=>{
        if(err) return done(err);
        done(null,isOk);
    })

}

function deleteCodeById(codeId, done) {

    restore_password_repository.deleteById(codeId,(err,isOk)=>{
        if(err) return done(err);
        done(null,isOk);
    })
}

module.exports.addAndSendCode = addAndSendCode;
module.exports.findCodeByUserEmail = findCodeByUserEmail;
module.exports.getCodes = getCodes;
module.exports.deleteCodeById = deleteCodeById;

