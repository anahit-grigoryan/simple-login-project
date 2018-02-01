const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

function testCaptcha(req,res){

    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return false;
    }

    const secretKey = process.env.SECURE_KEY;

    const verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret="
                            + secretKey
                            + "&response="
                            + req.body['g-recaptcha-response']
                            + "&remoteip="
                            + req.connection.remoteAddress;

    let returnValue = request(verificationUrl,function(error,response,body) {
        try{
            body = JSON.parse(body);
        }catch(ex){
            console.log(ex);
        }
        if(body.success !== undefined && !body.success) {
            return false;
        }
        return true;
    });

    return returnValue;
}

module.exports.testCaptcha = testCaptcha;