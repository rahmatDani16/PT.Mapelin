const {DataTypes} = require("sequelize");
const sequelize = require("../../utils/config_db");

const Pembayaran = sequelize.define("pembayaran",{
    id:{
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    metodePembayaran : {
        type : DataTypes.ENUM("qris","cash","bank"),
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

Pembayaran.sync();
module.exports = Pembayaran;