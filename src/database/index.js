import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import Recipe from '../app/models/Recipe';
import Step from '../app/models/Step';
import Ingredient from '../app/models/Ingredient';
import Utensil from '../app/models/Utensil';

const models = [User, Recipe, Step, Ingredient, Utensil];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
