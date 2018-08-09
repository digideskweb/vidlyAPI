const bcrypt = require('bcrypt-nodejs');

let salt;

bcrypt.genSalt(10, (err, res)=> {
    if (err) {
        console.log(err);
    }else {
        salt = res;
        console.log(salt);
    }
    
});







