const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  surname: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  passport: { type: DataTypes.STRING, unique: true },
  age: { type: DataTypes.INTEGER },
  password: { type: DataTypes.STRING },
});

const Wallet = sequelize.define("wallet", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  balanceUSD: { type: DataTypes.FLOAT },
});

const Cryptocurrency = sequelize.define("cryptocurrency_in_wallet", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cryptoName: { type: DataTypes.STRING },
  amount: { type: DataTypes.FLOAT },
});

const TopCryptocurrencies = sequelize.define("top_cryptocurrencies", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cryptoName: { type: DataTypes.STRING },
});

User.hasOne(Wallet);
Wallet.belongsTo(User);

Wallet.hasMany(Cryptocurrency);
Cryptocurrency.belongsTo(Wallet);

User.hasMany(TopCryptocurrencies);
TopCryptocurrencies.belongsTo(User);

module.exports = {
  User,
  Wallet,
  Cryptocurrency,
  TopCryptocurrencies,
};
