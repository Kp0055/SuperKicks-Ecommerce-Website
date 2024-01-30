
const adminVerify = (req,res,next )=>{


    console.log('////////////////////////////////////55555555555555555555555');

    
    
    if(req.session && req.session.verify){
        console.log( req.session.verify);
        return   next();
      
    }else{
    return res.redirect('/admin/login')
    }
  

}

module.exports =  adminVerify;

