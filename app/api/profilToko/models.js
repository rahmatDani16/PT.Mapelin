const {DataTypes} = require("sequelize");
const sequelize = require("../../utils/config_db");

const ProfileToko = sequelize.define("profiletoko",{
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    alamat : {
        type : DataTypes.STRING,
        allowNull : false
    },
    namaToko : {
        type : DataTypes.STRING,
        allowNull : false
    },
    noHp : {
        type : DataTypes.STRING,
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
}
)
ProfileToko.sync();
module.exports = ProfileToko;