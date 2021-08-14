// Dependencies
import Sequelize, { Model } from 'sequelize';

class Recipe extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.TEXT,
        category: Sequelize.STRING,
        preparation_time: Sequelize.STRING,
        financial_cost: Sequelize.STRING,

        // Associantions
        user_id: Sequelize.INTEGER,
      },
      {
        modelName: 'recipes',
        sequelize,
      }
    );

    return this;
  }

  // Models Association
  static associate(models) {
    this.belongsTo(models.users, {
      foreignKey: 'user_id',
      as: 'user',
    });
    this.hasMany(models.steps);
    this.hasMany(models.ingredients);
    this.hasMany(models.utensils);
  }
}

export default Recipe;
