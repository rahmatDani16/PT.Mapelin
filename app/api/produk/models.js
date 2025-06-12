const { DataTypes} = require("sequelize");
const sequelize = require("../../utils/config_db");

const Produk = sequelize.define("produk",{
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true

    },
    namaProduk : {
        type : DataTypes.STRING,
        allowNull :false
    },
    harga : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    stok : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    gambarProduk : {
        type : DataTypes.STRING,
    },
    kategoriId : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    userId : {
        type : DataTypes.INTEGER,
        allowNull : false
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
Produk.sync();
module.exports = Produk;