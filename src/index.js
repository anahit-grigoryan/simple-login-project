const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


require('./main/background-processes/update-restore-passwords');


const port = process.env.PORT;
const session_op = {
    host: process.env.HOST,
    port: process.env.MONGO_PORT,
    db: 'session',
    url: 'mongodb://localhost:27017/UserAuthenticationNodeProject'
};


let app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

let requests = [];
const requestTrimThreshold = 5000;
const requestTrimSize = 4000;

app.use(function(req, res, next) {
    const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    const url = req.url;
    let request = {
        url:url,
        ip:ip,
        date: Date.now()
    };
    requests.push(request);

    if (requests.length > requestTrimThreshold) {
        requests = requests.slice(0, requests.length - requestTrimSize);
    }
    next();
});


module.exports = requests;

app.use(session({
    name:'session',
    store: new MongoStore(session_op),
    resave: false,
    secret: process.env.SESSION_SECRET_VALUE,
    saveUninitialized: false,
    cookie: {
        maxAge: 100000,
        secure: false,
        signed: true
    }

}));
app.use(express.static(__dirname + '/views/public'));

require('./main/controllers/users')(app);
require('./main/controllers/restore-password')(app);
require('./main/controllers/main')(app);


app.listen(port, () => {
    console.log('Server was run on port ', port);
});