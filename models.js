const Sequelize = require("sequelize");

const helpers = require("./helpers");

const db = helpers.getDB();
const Post = db.define("users", {
  user: { type: Sequelize.STRING }
});

db.sync();

module.exports = { Post };