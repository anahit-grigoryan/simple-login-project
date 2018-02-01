function generateSecureCode(){
    const MIN = 1000;
    const MAX = 10000;

    const secureCode = Math.floor(Math.random() * (MAX - MIN)) + MIN;

    return secureCode;

}

module.exports.generateSecureCode = generateSecureCode;