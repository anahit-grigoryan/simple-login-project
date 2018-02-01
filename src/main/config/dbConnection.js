const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/UserAuthenticationNodeProject');
module.exports = mongoose;
