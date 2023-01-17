const { Op } = require("sequelize");
const { Favourite, Destination } = require("../models");

class FavouriteController {
  static async readFavourites(req, res, next) {
    try {
      const UserId = req.user.id;
      const readFavourites = await Favourite.findAll({
        where: { UserId },
        include: [
          {
            model: Destination,
            where: { id: { [Op.ne]: 1 } },
          },
        ],
      });

      res.status(200).json(readFavourites);
    } catch (error) {
      next(error);
    }
  }

  static async addFavourites(req, res, next) {
    try {
      const UserId = req.user.id;
      const { id } = req.body;

      const findDestination = await Destination.findByPk(+id);

      if (!findDestination) {
        throw { name: "Destination does not exist" };
      }

      const DestinationId = findDestination.id;

      const [findFavourites, createdFavourites] = await Favourite.findOrCreate({
        where: { DestinationId, UserId },
        defaults: { DestinationId, UserId },
      });

      if (!createdFavourites) {
        throw { name: "Destination already in your favourites" };
      }

      res.status(201).json({
        message: `${findDestination.name} successfully added to your favourites`,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FavouriteController;
