// Dependencies
import Sequelize, { Model } from 'sequelize';

class Utensil extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        opcional: Sequelize.BOOLEAN,

        // Associantions
        recipe_id: Sequelize.INTEGER,
      },
      {
        modelName: 'utensils',
        sequelize,
      }
    );

    return this;
  }

  // Models Association
  static associate(models) {
    this.belongsTo(models.recipes, {
      foreignKey: 'recipe_id',
      as: 'recipe',
    });
  }
}

export default Utensil;
