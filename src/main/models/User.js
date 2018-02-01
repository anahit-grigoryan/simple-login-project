const db = require('../config/dbConnection');

const userSchema = new db.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    id:{type:Number,required:true}
},{collection:'users'});


const User = db.model('Users',userSchema);

module.exports = User;