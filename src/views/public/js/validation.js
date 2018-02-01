function checkEmail(email) {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regEx.test(email.toLowerCase()) && email.length < 100;
}


function checkPassword(password) {
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-!_@#\$%\^&\*])(?=.{6,})");
    return strongRegex.test(password);
}

function validateForm(formName) {
    // const regForm =document.forms["register-form"];
    const confirm_password = document.forms[formName]["confirm-password"].value;
    const password = document.forms[formName]["password"].value;
    const email = document.forms[formName]["email"].value;
    if (!checkEmail(email) || !checkPassword(password) || password != confirm_password) {
        if (!checkEmail(email)) {
            document
                .getElementById('email-error')
                .innerHTML = '<div style = "color:#ef4747; margin-top: -15px; margin-bottom: 15px;">Pleas input valid email</div>';
        } else {
            document
                .getElementById('email-error')
                .innerHTML = '';
        }
        if (!checkPassword(password)) {
            document
                .getElementById('password-error')
                .innerHTML = '<div style = "color:#ef4747; margin-top: -15px; margin-bottom: 15px;">' +
                'Password must contain at least 1 lowercase, 1 uppercase, 1numeric, special character and be 6 characters or longer ' +
                '</div>';
        } else {
            document
                .getElementById('password-error')
                .innerHTML = '';
        }
        if (password != confirm_password) {
            document
                .getElementById('confirm-password-error')
                .innerHTML = '<div style = "color:#ef4747; margin-top: -15px; margin-bottom: 15px;">Pleas confirm password again</div>';
        } else {
            document
                .getElementById('confirm-password-error')
                .innerHTML = '';
        }
        return false;
    }
    return true;
}
