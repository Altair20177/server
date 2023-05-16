const fetch = require("node-fetch");
const bcrypt = require("bcrypt");

const {
  User,
  Wallet,
  TopCryptocurrencies,
  Cryptocurrency,
} = require("../models/models");
const ApiError = require("../errors/ApiError");

async function getCryptsData(crypts, type = "") {
  const ids = crypts.map((crypt) => crypt.cryptoName);

  const cryptsFetchPromise = await fetch(
    `https://api.coincap.io/v2/assets?ids=${ids}`
  );
  const cryptsFetch = await cryptsFetchPromise.json();

  const cryptsToReturn = [];

  cryptsFetch.data.forEach((crypt) => {
    const newObj = {
      ...crypt,
    };

    if (type === "wallet") {
      newObj.amount = crypts.find(
        (cryptFromDB) => cryptFromDB.cryptoName === crypt.id
      ).amount;
    }

    cryptsToReturn.push(newObj);
  });

  return cryptsToReturn;
}

async function getUser({ email = null, password = null }) {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return ApiError.badRequest("User not found!");
  }

  const wallet = await Wallet.findOne({ where: { userId: user.id } });
  const cryptsInWallet = await Cryptocurrency.findAll({
    where: { walletId: wallet.id },
  });
  const topCrypts = await TopCryptocurrencies.findAll({
    where: { userId: user.id },
  });

  const cryptsWalletData = await getCryptsData(cryptsInWallet, "wallet");
  const cryptsTopData = await getCryptsData(topCrypts);

  let comparePassword = bcrypt.compareSync(password, user.password);

  return comparePassword
    ? {
        user,
        topCrypts: cryptsTopData,
        cryptsInWallet: cryptsWalletData,
        balanceUSD: wallet.balanceUSD,
      }
    : ApiError.badRequest("Incorrect password!");
}

async function updateUser({
  id,
  email,
  name,
  surname,
  age,
  passport,
  oldPassword,
  newPassword,
  newPasswordRepeat,
}) {
  const objToUpdate = {
    email,
    name,
    surname,
    age,
    passport,
  };

  const userOld = await User.findOne({ where: { id } });

  if (oldPassword && !bcrypt.compareSync(oldPassword, userOld.password)) {
    return ApiError.badRequest("Old password is incorrect!");
  }

  if (newPassword && newPasswordRepeat && newPassword !== newPasswordRepeat) {
    return ApiError.badRequest("Passwords aren't equal!");
  }

  if (
    bcrypt.compareSync(oldPassword, userOld.password) &&
    newPassword === newPasswordRepeat
  ) {
    const hashPassword = await bcrypt.hash(newPassword, 4);
    objToUpdate.hashPassword = hashPassword;
  }

  const user = await User.update(objToUpdate, {
    where: { id },
  });

  return user;
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

async function replenishBalance({ amount, id }) {
  const wallet = await Wallet.findOne({ where: { userId: id } });

  const newAmount = wallet.balanceUSD + amount;

  await Wallet.update({ balanceUSD: newAmount }, { where: { userId: id } });

  const walletAfterUpdate = await Wallet.findOne({ where: { userId: id } });

  return walletAfterUpdate;
}

module.exports = {
  getUser,
  createUser,
  updateUser,
  replenishBalance,
};
