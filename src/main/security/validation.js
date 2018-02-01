function checkEmail(email){
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regEx.test(email.toLowerCase())&& email.length < 100;
}


function checkPassword(password){
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-!_@#\$%\^&\*])(?=.{6,})");
    return strongRegex.test(password);
}



module.exports.checkEmail = checkEmail;
module.exports.checkPassword = checkPassword;