// Dependencies
import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        modelName: 'users',
        sequelize,
      }
    );

    // Password Encrypt
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // Password Validation
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  // Models Association
  static associate(models) {
    this.hasMany(models.recipes);
  }
}

export default User;
