const validation = require('../security/validation');
const secure_code_creator = require('../security/restore-password');
const hashing = require('../security/hashing');

const restore_password_service = require('../service/restore-password-service');
const users_service = require('../service/user-service');


module.exports = function (app) {
    app.get('/forgot-password', (req, res) => {
        res.render(__dirname + '/../../views/forgot-password',
            {
                email: '',
                enterCode: false,
                setPassword: false,
                errors: []
            });
    });

    app.post('/forgot-password', (req, res) => {
        let new_secure_code = secure_code_creator.generateSecureCode();
        let new_code = {
            user_email: req.body.email,
            secure_code: new_secure_code,
            updated_date: Date.now()
        };

        restore_password_service.addAndSendCode(new_code, (err, isOk) => {
            if (err) console.log(err);
            res.render(__dirname + '/../../views/forgot-password', {
                email: req.body.email,
                enterCode: true,
                setPassword: false,
                errors: []
            });
        });

    });

    app.post('/check-code', (req, res) => {
        restore_password_service.findCodeByUserEmail(req.body.email, (err, foundCode) => {
            if (err) console.log(err);
            if (foundCode) {
                if (hashing.verify(req.body.code, foundCode.secure_code)) {
                    res.render(__dirname + '/../../views/forgot-password', {
                        email: req.body.email,
                        enterCode: false,
                        setPassword: true,
                        errors: []
                    });
                } else {
                    res.render(__dirname + '/../../views/forgot-password', {
                        email: req.body.email,
                        enterCode: true,
                        setPassword: false,
                        errors: [{message: 'Incorrect code'}]
                    });
                }
            }
        });
    });

    app.post('/set-password', (req, res) => {
        users_service.findUserByEmail(req.body.email,
            (err, user) => {
                if (user) {
                    if (validation.checkPassword(req.body.new_password)) {
                        user.password = req.body.new_password;
                        users_service.updateUser(user,
                            (err, isOk) => {
                                if (err) console.log(err);
                                if (isOk) {
                                    req.session.email = user.email;
                                    req.session.username = user.username;
                                    res.status(200);
                                    res.redirect('/user');
                                    res.end();
                                }
                            });
                    }
                }
            });
    });
};

