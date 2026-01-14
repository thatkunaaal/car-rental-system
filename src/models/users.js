"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
const { ServerConfig } = require("../config");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.bookings, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  users.init(
    {
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "users",
    }
  );

  users.addHook("beforeCreate", async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, +ServerConfig.SALT);
    user.password = hashedPassword;
  });
  return users;
};
