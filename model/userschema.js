const mongoose = require('mongoose');



const userschema = mongoose.Schema({
    
    firstname : {
        type : String,
        required : true,
        unique : true
    },

    lastname  : {
        type : String,
        required : true,
        unique : true
    },

    email : {
        type :String,
        required : true,
        unique : true
    },
    phonenumber :{
        type : String,
        require : true
    },

    password : {
        type : String,
        required :true
    },

    verified : {
        type : Boolean,
        default : false
    },
    isblocked :{
        type:Boolean,
        default:false
    },

    resetpasswordtoken :{
        type :String
    },

    resetpasswordexpire :{
        type: Date
    }
    
})



const mus = mongoose.model('mus',userschema)

module.exports = mus
