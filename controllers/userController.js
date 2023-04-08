const { User } = require("../models/models");
const ApiError = require("../errors/ApiError");
const bcrypt = require("bcrypt");

async function getUser({ id = null }) {
  const user = await User.findOne({ where: { id } });

  return user ? user : ApiError.badRequest("Пользователь не найден!");
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

  return user;
}

module.exports = {
  getUser,
  createUser,
};
