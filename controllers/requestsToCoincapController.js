const fetch = require("node-fetch");

async function getAllCrypts({ limit, offset }) {
  const cryptsFetchPromise = await fetch(
    `https://api.coincap.io/v2/assets?limit=${limit}&offset=${offset}`
  );
  const cryptsFetch = await cryptsFetchPromise.json();

  return cryptsFetch.data;
}

async function getFreshDataAboutWallet({ ids }) {
  const cryptsFetchPromise = await fetch(
    `https://api.coincap.io/v2/assets?ids=${ids}`
  );
  const cryptsFetch = await cryptsFetchPromise.json();

  return cryptsFetch.data;
}

async function getCryptAbout({ id }) {
  const obj = {
    about: {},
    historyPerDay: [],
    markets: [],
    rates: {},
  };

  const aboutPromise = await fetch(`https://api.coincap.io/v2/assets/${id}`);
  const about = await aboutPromise.json();

  const historyPromise = await fetch(
    `https://api.coincap.io/v2/assets/${id}/history?interval=d1`
  );
  const history = await historyPromise.json();

  const marketsPromise = await fetch(
    `https://api.coincap.io/v2/assets/${id}/markets`
  );
  const markets = await marketsPromise.json();

  const ratesPromise = await fetch(`https://api.coincap.io/v2/rates/${id}`);
  const rates = await ratesPromise.json();

  obj.about = about.data;
  obj.historyPerDay = history.data;
  obj.markets = markets.data;
  obj.rates = rates.data;

  return obj;
}

async function getPagesAmount() {
  const cryptsFetchPromise = await fetch(`https://api.coincap.io/v2/assets`);
  const cryptsFetch = await cryptsFetchPromise.json();

  return cryptsFetch.data.length;
}

module.exports = {
  getPagesAmount,
  getAllCrypts,
  getFreshDataAboutWallet,
  getCryptAbout,
};
