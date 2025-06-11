const {DataTypes} = require("sequelize");
const db = require("../../utils/config_db");
const sequelize = require("../../utils/config_db");

const Kategori = sequelize.define("kategori",{
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement: true
    },
    namaKategori : {
        type : DataTypes.STRING,
        allowNull : true
    },
    createdAt : {
        type : DataTypes.DATE,
        allowNull : true
    },
    updatedAt : {
        type : DataTypes.DATE,
        allowNull : true
    }
},{
    freezeTableName : true
});

Kategori.sync();
module.exports = Kategori;