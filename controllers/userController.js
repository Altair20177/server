const fetch = require("node-fetch");
const bcrypt = require("bcrypt");

const {
  User,
  Wallet,
  TopCryptocurrencies,
  Cryptocurrency,
} = require("../models/models");
const ApiError = require("../errors/ApiError");

async function getCryptsData(crypts) {
  const ids = crypts.map((crypt) => crypt.cryptoName);

  const cryptsFetchPromise = await fetch(
    `https://api.coincap.io/v2/assets?ids=${ids}`
  );
  const cryptsFetch = await cryptsFetchPromise.json();

  return cryptsFetch.data;
}

async function getUser({ email = null, password = email }) {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return ApiError.badRequest("Пользователь не найден!");
  }

  const wallet = await Wallet.findOne({ where: { userId: user.id } });
  const cryptsInWallet = await Cryptocurrency.findAll({
    where: { walletId: wallet.id },
  });
  const topCrypts = await TopCryptocurrencies.findAll({
    where: { userId: user.id },
  });

  const cryptsWalletData = await getCryptsData(cryptsInWallet);
  const cryptsTopData = await getCryptsData(topCrypts);

  return user.password === password
    ? { user, topCrypts: cryptsTopData, cryptsInWallet: cryptsWalletData }
    : ApiError.badRequest("Неверный пароль!");
}

async function createUser({ input }) {
  const hashPassword = await bcrypt.hash(input.password, 4);

  const user = await User.create({
    name: input.name,
    surname: input.surname,
    age: input.age,
    email: input.email,
    passport: input.passport,
    password: hashPassword,
  });

  const wallet = await Wallet.create({ userId: user.id });

  return user;
}

module.exports = {
  getUser,
  createUser,
};
