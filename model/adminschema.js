const mongoose = require('mongoose');


const adminschema = mongoose.Schema({

    email : {
        type : String,
    },
    password :{
        type : String
    }
})



 const adminmongo = mongoose.model('adminmongo', adminschema)

module.exports  = adminmongo;
