const Sequelize = require("sequelize");

const db = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite"
});

function ensureAuthenticated(req, res, next) {
  if (!req.user) {
    return res.status(401).render("unauthenticated");
  }
  next();
}

function getDB() {
  return db;
}

module.exports = { ensureAuthenticated, getDB };