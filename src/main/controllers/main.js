const path = require('path');

module.exports = function(app){
    app.get('/', (req, res) => {
        res.sendFile(path.resolve('views/main-page.html'));
    });

    app.get('/login', (req, res) => {

        if (req.session.email) {
            res.redirect('/user');
        } else {
            res.render(__dirname + '/../../views/login-form', {
                errors: [],
                email: '',
                username: '',
                site_key:''
            });
        }
    });
};