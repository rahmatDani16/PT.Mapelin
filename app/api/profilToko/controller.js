const {check , validations } = require("express-validator");
const ProfileToko = require("../profilToko/models");

//validasi input profile toko 
const validation = [
    check("email")
    .notEmpty().withMessage("Email tidak boleh kosong")
    .isEmail().withMessage("Format email tidak boleh kosong"),
    check("password")
    .notEmpty().withMessage("password tidak boleh kosong")
    .isLength({min : 6}).withMessage("Password minimal 6 karakter"),
    check("alamat")
    .notEmpty().withMessage("Alamat tidak boleh kosong"),
    check("namaToko")
    .notEmpty().withMessage("Nama toko tidak boloh kosong"),
    check("noHp")
    .notEmpty().withMessage("Nomor Hp tidak boleh kosong")
    .isMobilePhone().withMessage("Format nomor Hp tidak valid")
]

//Membuat Profil toko 
const createProfileToko = async(req,res) => {
    try{
        const error = validations(req);
        if(!error.isEmpty()){
            return resizeBy.status(400).json({
                message :error.array()
            })
        }
        const {email, password,alamat,namaToko,noHp} = req.body;

        const profile = await ProfileToko.create({
            email,
            password,
            alamat,
            namaToko,
            noHp
        });
        resizeBy.status(201).json({
            status : 201,
        message : "Profil toko berhasil di buat",
        data : profile
        })
    }catch(error) {
        return res.status(500).json({
            message : "Gagal membuat profile",
            error : error.message
        })
    }
}
//Mengambil profil toko berdasarkan user login
const getAllProfileToko = async (req,res) => {
    try{
        const profile = await ProfileToko.findOne({
            where : {id : req.user.id}
        });
        if(!profile){
            return res.status(404).json({
                message : "Profile toko tidak ditemukan "
            })
        }
        res.status(200).json({
            status : 200,
            message : "Detail Profile toko",
            data : profile
        })
    }catch(error){
        return res.status(500).json({
            message : "Gagal mengambil data profile",
            error : error.message
        })
    }
}
//Mnegupdate profil toko 
const updateProfileToko = async (req,res) => {
    try{
        const error = validation(req);
        if(!error.isEmpty()){
            return res.status(400).json({
                message : error.array()
            })
        }
        const profile = await ProfileToko.findOne({
            where : {id : req.user.id}
        });
        if(!profile){
            return res.status(400).json({
                message : "Profile toko tidak di temukan"
            })
        }
        const {email,password,alamat,namaToko,noHp} = req.body;

        await profile.update({
            email,
            password,
            alamat,
            namaToko,
            noHp
        });
        res.status(200).json({
            status : 200,
            message : "Profile berasi di perbarui "
        })
    }catch(error){
        res.status(500).json({
            message : "Gagal memperbarui profil toko",
            error : error.message
        })
    }
}
//Menghapus profil toko 
const deleteProfileToko = async (req,res) => {
    try{
        const profile = await ProfileToko.findOne({
            where : {id : req.user.id}
        });
        if(!profile){
            return res.status(404).json({
                message : "Profil toko tidak di temukan"
            })
        }
        await profile.destroy();
        res.status(200).json({
            status :200,
            message : "profil toko berhasil dihapus"
        })
    }catch(error){
        return res.status(500).json({
            message : "Gagak menghapus profil toko",
            error : err.message
        })
    }
}
module.exports = {
    validation,
    createProfileToko,
    getAllProfileToko,
    updateProfileToko,
    deleteProfileToko
}