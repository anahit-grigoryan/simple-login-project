const codes_service = require('../service/restore-password-service');

function updateRestorePasswordsData () {
    console.log('test');

    codes_service.getCodes((err,codes)=>{
        if(err)console.log(err);
       for(let index in codes){
           if(!isActive(codes[index])){
               codes_service.deleteCodeById(codes[index]._id,(err,isOk)=>{
                   if(err) console.log(err);
                   if(isOk){
                       console.log( 'Updated');
                   }
               })
           }
       }
    });

}

function isActive(code){
    return !(Date.now() - code.updated_date > 60 * 60 * 1000);
}


const interval_id = setInterval(updateRestorePasswordsData,60*60*1000);

