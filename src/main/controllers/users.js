const validation = require('../security/validation');
const users_service = require('../service/user-service');

const captcha = require('../security/captcha/captcha');


const requests_controle = require('../security/requests-controle');



module.exports = function(app){

    app.post('/login', (req, res) => {

        users_service.findUser(req.body,(err,currentUser)=>{

            if(err) return res.status(401).send('Failed to log in');

            let capthchaResult = captcha.testCaptcha(req, res);

            if (currentUser && currentUser.id && (!(req.session.incorrectDataCount > 2) || capthchaResult)) {
                req.session.email = currentUser.email;
                req.session.username = currentUser.username;
                req.session.incorrectDataCount = 0;
                res.status(200);
                res.redirect('/user');
                res.end();
            } else if (req.session.incorrectDataCount > 2 && !captcha.testCaptcha(req, res)) {
                res.render(__dirname + '/../../views/login-form', {
                    errors: [{message: 'Pleas select captcha'}],
                    email: req.body.email,
                    username: '',
                    site_key: process.env.SITE_KEY
                });
            } else {
                res.status(401);
                req.session.incorrectDataCount = req.session.incorrectDataCount +1 || 1;
                console.log(req.session.incorrectDataCount);
                const site_key = req.session.incorrectDataCount > 2 ? process.env.SITE_KEY : '';
                res.render(__dirname + '/../../views/login-form', {
                    errors: [{message: 'Incorect email or password'}],
                    email: req.body.email,
                    username: '',
                    site_key: site_key
                });
                res.end();

            }
        });
    });

    app.get('/logout', (req, res) => {
        req.session.email = '';
        req.session.username = '';
        req.session.destroy();
        res.status(200);
        res.redirect('/login');
        res.end();
    });

    app.get('/user', (req, res) => {
        users_service.findUserByEmail(req.session.email,(err,user)=>{
            if(err) return res.status(401).send('Something was wrong,try again');
            if (user) {
                res.render(__dirname + '/../../views/user-page', {username: req.session.username});
            } else {
                res.status(403).redirect('/login');
            }
        });


    });

    app.post('/signup', (req, res) => {

        if(!requests_controle.isAllowableCount(req)){
            res.end('Your ip address locked. Pleas try again after 30 minutes');
        }else{
            const newUser = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            };
            if (validation.checkEmail(req.body.email) && validation.checkPassword(req.body.password)) {
                users_service.addUser(newUser,(err,isOk)=>{
                    if(err)return res.status(401).send('Failed to register');
                    if (isOk) {
                        req.session.email = newUser.email;
                        req.session.username = newUser.username;
                        res.status(200);
                        res.redirect('/user');
                        res.end();
                    } else {
                        res.render(__dirname + '/../../views/login-form', {
                            errors: [{message: 'Email already exists'}],
                            email: req.body.email,
                            username: req.body.username,
                            site_key:process.env.SITE_KEY
                        });
                        res.status(401);
                        res.end();
                    }
                });

            } else {
                res.status(400);
                res.end();
            }
        }



    });

    app.get('/change-password', (req, res) => {

        res.render(__dirname + '/../../views/forgot-password', {
            email: req.session.email,
            enterCode: false,
            setPassword: true,
            errors: []
        });
    });
};
