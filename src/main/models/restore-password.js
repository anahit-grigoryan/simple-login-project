const db = require('../config/dbConnection');

const restorePasswordDataSchema = new db.Schema({
    user_email:{type:String,required:true},
    secure_code: {type:String,required:true},
    id:{type:Number,required:true}
},{collaction:'restore_passwords'});

let RestorePasswordData = db.model('Restore_passwords',restorePasswordDataSchema);

module.exports = RestorePasswordData;


