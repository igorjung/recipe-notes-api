// Dependencies
import Sequelize, { Model } from 'sequelize';

class Ingredient extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        quantity: Sequelize.STRING,
        cost: Sequelize.STRING,
        opcional: Sequelize.BOOLEAN,

        // Associantions
        recipe_id: Sequelize.INTEGER,
        step_id: Sequelize.INTEGER,
      },
      {
        modelName: 'ingredients',
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
    this.belongsTo(models.steps, {
      foreignKey: 'step_id',
      as: 'step',
    });
  }
}

export default Ingredient;
