// Dependencies
import * as Yup from 'yup';

// Models
import Utensil from '../models/Utensil';

class UtensilController {
  async index(request, response) {
    // Query Setting
    const { page = 1, limit = 5 } = request.query;
    const { filters } = request;

    // Filter Setting
    const where = {};

    if (filters) {
      if (filters.recipe_id) {
        where.recipe_id = filters.recipe_id;
      }
    }

    // Utensils Exists Validation
    const utensils = await Utensil.findAndCountAll({
      order: [['name', 'asc']],
      limit: parseInt(limit, 10),
      offset: (page - 1) * limit,
      where,
    });
    if (!utensils) {
      return response.json({
        error: 'Não há utensílios cadastrados ainda.',
      });
    }

    return response.json({
      utensils: utensils.rows,
      count: utensils.count,
    });
  }

  async show(request, response) {
    // Query Setting
    const { id } = request.params;

    // Step Exists Validation
    const utensil = await Utensil.findOne({
      where: { id },
    });
    if (!utensil) {
      return response.status(404).json('Utensílio não encontrado.');
    }

    return response.json(utensil);
  }

  async store(request, response) {
    // Body Validation
    const data = request.body;

    const schema = Yup.object().shape({
      name: Yup.string()
        .typeError('Nome do utensílio é obrigatório.')
        .required('Nome do utensílio é obrigatório.'),
      opcional: Yup.bool(),
      recipe_id: Yup.number()
        .typeError(
          'Falha no cadastro do utensílio, confira os dados inseridos.'
        )
        .required(
          'Falha no cadastro do utensílio, confira os dados inseridos.'
        ),
    });
    if (!(await schema.validate(data))) {
      return response.status(400).json({
        error: 'Falha no cadastro do utensílio, confira os dados inseridos.',
      });
    }

    // Post
    const utensil = await Utensil.create(data);

    return response.json(utensil);
  }

  async update(request, response) {
    // Body Validation
    const data = request.body;

    const schema = Yup.object().shape({
      name: Yup.string()
        .typeError('Nome do utensílio é obrigatório.')
        .required('Nome do utensílio é obrigatório.'),
      opcional: Yup.bool(),
    });
    if (!(await schema.validate(data))) {
      return response.status(400).json({
        error: 'Falha no cadastro do utensílio, confira os dados inseridos.',
      });
    }

    // Utensil Exists Validation
    const { id } = request.params;
    const utensil = await Utensil.findOne({
      where: { id },
    });
    if (!utensil) {
      return response.status(400).json({
        error: 'Não foi possível encontrar o utensílio.',
      });
    }

    // Put
    await utensil.update(request.body);

    return response.json(utensil);
  }

  async delete(request, response) {
    // Utensil Exists Validation
    const { id } = request.params;
    const utensil = await Utensil.findOne({
      where: { id },
    });
    if (!utensil) {
      return response
        .status(400)
        .json({ error: 'Ocorreu um erro, tente novamente mais tarde.' });
    }

    // Destroy
    await utensil.destroy();

    return response.json();
  }
}

export default new UtensilController();
