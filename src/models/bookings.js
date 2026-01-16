"use strict";
const { Model } = require("sequelize");
const { Enum } = require("../utils/common");
const { BOOKED, CANCELLED, COMPLETED } = Enum.BOOKING_TYPE;

module.exports = (sequelize, DataTypes) => {
  class bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.users, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  bookings.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      car_name: { type: DataTypes.STRING, allowNull: false },
      days: { type: DataTypes.INTEGER, allowNull: false },
      rent_per_day: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.ENUM,
        values: [BOOKED, CANCELLED, COMPLETED],
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "bookings",
    }
  );
  return bookings;
};
