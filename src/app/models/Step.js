// Dependencies
import Sequelize, { Model } from 'sequelize';

class Step extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.TEXT,
        time: Sequelize.STRING,
        order: Sequelize.INTEGER,
        opcional: Sequelize.BOOLEAN,

        // Associantions
        recipe_id: Sequelize.INTEGER,
      },
      {
        modelName: 'steps',
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

export default Step;
