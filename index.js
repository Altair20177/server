require("dotenv").config();

const express = require("express");
const request = require("request");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./schema");
const sequelize = require("./db");
const models = require("./models/models");
const {
  getAllCrypts,
  getFreshDataAboutWallet,
  getCryptAbout,
  getPagesAmount,
} = require("./controllers/requestsToCoincapController");
const {
  getUser,
  createUser,
  getTopCryptsForUser,
} = require("./controllers/userController");

const app = express();
const PORT = process.env.PORT || 5000;
const root = {
  getAllCrypts,
  getFreshDataAboutWallet,
  getCryptAbout,
  getPagesAmount,
  getUser,
  createUser,
  getTopCryptsForUser,
};

app.use(cors());

app.get("/", (req, res) => {
  request("https://api.coincap.io/v2/assets/", (err, response, body) => {
    if (err) return res.status(500).send({ message: err });

    return res.send(body);
  });
});

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema,
    rootValue: root,
  })
);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`server started ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
