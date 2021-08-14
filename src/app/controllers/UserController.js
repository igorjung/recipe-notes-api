// Dependencies
import * as Yup from 'yup';
import jwt from 'jsonwebtoken';

// Configs
import authConfig from '../../config/auth';

// Models
import User from '../models/User';

// Associations
import Recipe from '../models/Recipe';

class UserController {
  async show(request, response) {
    // Query Setting
    const { id } = request.params;

    // User Exists Validation
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ['password_hash'] },
      include: [{ model: Recipe, as: 'recipes' }],
    });
    if (!user) {
      return response.status(404).json('Ops! Não há nada aqui.');
    }

    // User Id Validation
    const { authorization } = request.headers;
    const auth = authorization.split(' ')[1];
    const decoded = jwt.verify(auth, authConfig.secret);
    const userId = decoded.id;

    if (user.id !== userId) {
      return response
        .status(401)
        .json({ error: 'Ops, ocorreu um erro! Tente novamente mais tarde.' });
    }

    return response.json(user);
  }

  async update(request, response) {
    // Body Validation
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string()
        .email('O email é invalido')
        .typeError('O email é invalido'),
      password: Yup.string().min(6),
      password_confirmation: Yup.string().when('password', (password, field) =>
        password ? field.oneOf([Yup.ref('password')]).required() : field
      ),
      old_password: Yup.string().when('password', (password, field) =>
        password ? field.required() : field
      ),
    });
    if (!(await schema.validate(request.body))) {
      return response.status(400).json({
        error: 'Falha na atualização do usuário, confira os dados inseridos.',
      });
    }

    // User Exists Validation
    const { id } = request.params;
    const user = await User.findOne({
      where: { id },
    });
    if (!user) {
      return response.status(400).json({
        error: 'Não foi possível encontrar o usuário.',
      });
    }

    // Unique Validation
    const { email } = request.body;
    if (email && user.email !== email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return response.status(400).json({
          error: 'Já existe um usuário cadastrado com esse e-mail.',
        });
      }
    }

    // Password Validation
    const { old_password } = request.body;
    if (old_password && !(await user.checkPassword(old_password))) {
      return response
        .status(401)
        .json({ error: 'A senha atual não esta correta.' });
    }

    // User Id Validation
    const { authorization } = request.headers;
    const auth = authorization.split(' ')[1];
    const decoded = jwt.verify(auth, authConfig.secret);
    const userId = decoded.id;

    if (user.id !== userId) {
      return response
        .status(401)
        .json({ error: 'Ops, ocorreu um erro! Tente novamente mais tarde.' });
    }

    // Put
    await user.update(request.body);

    return response.json(user);
  }

  async delete(request, response) {
    // User Exists Validation
    const { id } = request.params;
    const { authorization } = request.headers;

    const user = await User.findOne({
      where: { id },
    });
    if (!user) {
      return response
        .status(400)
        .json({ error: 'Ops, ocorreu um erro! Tente novamente mais tarde.' });
    }

    // User Id Validation
    const auth = authorization.split(' ')[1];
    const decoded = jwt.verify(auth, authConfig.secret);
    const userId = decoded.id;

    if (user.id !== userId) {
      return response
        .status(401)
        .json({ error: 'Ops, ocorreu um erro! Tente novamente mais tarde.' });
    }

    // Destroy
    await user.destroy();

    return response.json();
  }
}

export default new UserController();
