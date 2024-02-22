const   mongoose =  require('mongoose')
const banner_Model = require('../model/banner')

const banner = (req,res)=>{
    
    res.render("admin_banner")
}

const post_banner = async (req, res) => {

    const { title, startDate, endDate, } = req.body;

    console.log(title, startDate, endDate,  );
    const image = req.file.filename;

    if (image === '') {
        return res.status(400).json({ msg: "Image is required" });
    } else {
        try {
            let bannerData = await banner_Model.create({
                title: title,
                startDate: startDate,
                endDate: endDate,
                image: image
            });

            console.log("Banner added Successfully");
            res.redirect('/admin/banner');
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Internal server error" });
        }
    }
}



module.exports = {
    banner,
    post_banner,
}