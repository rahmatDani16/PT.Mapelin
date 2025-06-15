const {DataTypes} = require("sequelize");
const sequelize = require("../../utils/config_db");

const Transaksi = sequelize.define("transaksi",{
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    idMetodePembayaran : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    idProduk : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    jumlahBeli : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    total : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    tanggalTransaksi: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    userId: {
         type: DataTypes.INTEGER,
         allowNull: false
     },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    freezeTableName: true
});
Transaksi.sync();
module.exports = Transaksi;