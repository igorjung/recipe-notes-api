// Dependencies
import * as Yup from 'yup';
import jwt from 'jsonwebtoken';

// Models
import User from '../models/User';

// Configs
import authConfig from '../../config/auth';

class AuthController {
  async register(request, response) {
    // Body Validation
    const schema = Yup.object().shape({
      name: Yup.string()
        .typeError('Falha no cadastro, nome é obrigatório.')
        .required('Falha no cadastro, nome é obrigatório.'),
      email: Yup.string()
        .email()
        .typeError('Falha no cadastro, email é obrigatório.')
        .required('Falha no cadastro, email é obrigatório.'),

      password: Yup.string()
        .min(6)
        .typeError('Falha no cadastro, senha é obrigatório.')
        .required('Falha no cadastro, senha é obrigatório.'),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref('password')])
        .typeError('Falha no cadastro, confirmação de senha é obrigatório.')
        .required('Falha no cadastro, confirmação de senha é obrigatório.'),
    });
    if (!(await schema.validate(request.body))) {
      return response
        .status(401)
        .json({ error: 'Falha no cadastro, confira os dados inseridos.' });
    }

    // Unique Validation
    const { email } = request.body;
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return response.status(400).json({
        error: 'Já existe um usuário cadastrado com esse e-mail.',
      });
    }

    // Post
    const data = {
      ...request.body,
      xp: 0,
    };
    const userCreated = await User.create(data);
    delete userCreated.password;

    return response.json(userCreated);
  }

  async login(request, response) {
    // Body Validation
    const schema = Yup.object().shape({
      email: Yup.string()
        .required()
        .email(),
      password: Yup.string().required(),
    });
    if (!(await schema.isValid(request.body))) {
      return response
        .status(400)
        .json({ error: 'Falha no login, confira os dados inseridos.' });
    }

    // User Exists Validation
    const { email } = request.body;
    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      return response
        .status(404)
        .json({ error: 'Esse e-mail não pertence a um usuário existente.' });
    }

    // Password Validation
    const { password } = request.body;
    if (password && !(await user.checkPassword(password))) {
      return response
        .status(401)
        .json({ error: 'A senha atual não esta correta.' });
    }

    return response.json({
      token: jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
      user: {
        id: user.id,
        name: user.name,
        nick: user.nick,
        email: user.email,
      },
    });
  }
}

export default new AuthController();
