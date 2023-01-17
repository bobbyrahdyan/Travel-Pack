"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Favourites", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      DestinationId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Destinations",
          key: "id",
        },
      },
      UseTravelStepId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "TravelSteps",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Favourites");
  },
};
