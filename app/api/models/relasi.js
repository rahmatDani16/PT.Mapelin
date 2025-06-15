const ProfileToko = require("../profilToko/models");
const Pembayaran = require("../pembayaran/models");

ProfileToko.hasMany(Pembayaran, { foreignKey: "idProfilToko" });
Pembayaran.belongsTo(ProfileToko, { foreignKey: "idProfilToko" });
