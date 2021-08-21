// Dependencies
import * as Yup from 'yup';

// Models
import Ingredient from '../models/Ingredient';

class IngredientController {
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

    // Ingredients Exists Validation
    const ingredients = await Ingredient.findAndCountAll({
      order: [['name', 'asc']],
      limit: parseInt(limit, 10),
      offset: (page - 1) * limit,
      where,
    });
    if (!ingredients) {
      return response.json({
        error: 'Não há ingredientes cadastrados ainda.',
      });
    }

    return response.json({
      ingredients: ingredients.rows,
      count: ingredients.count,
    });
  }

  async show(request, response) {
    // Query Setting
    const { id } = request.params;

    // Step Exists Validation
    const ingredient = await Ingredient.findOne({
      where: { id },
    });
    if (!ingredient) {
      return response.status(404).json('Ingrediente não encontrado.');
    }

    return response.json(ingredient);
  }

  async store(request, response) {
    // Body Validation
    const data = request.body;

    const schema = Yup.object().shape({
      name: Yup.string()
        .typeError('Nome do ingrediente é obrigatório.')
        .required('Nome do ingrediente é obrigatório.'),
      quantity: Yup.string(),
      cost: Yup.string(),
      opcional: Yup.bool(),
      recipe_id: Yup.number()
        .typeError(
          'Falha no cadastro do ingrediente, confira os dados inseridos.'
        )
        .required(
          'Falha no cadastro do ingrediente, confira os dados inseridos.'
        ),
    });
    if (!(await schema.validate(data))) {
      return response.status(400).json({
        error: 'Falha no cadastro do ingrediente, confira os dados inseridos.',
      });
    }

    // Post
    const ingredient = await Ingredient.create(data);

    return response.json(ingredient);
  }

  async update(request, response) {
    // Body Validation
    const data = request.body;

    const schema = Yup.object().shape({
      name: Yup.string()
        .typeError('Nome do ingrediente é obrigatório.')
        .required('Nome do ingrediente é obrigatório.'),
      quantity: Yup.string(),
      cost: Yup.string(),
      opcional: Yup.bool(),
    });
    if (!(await schema.validate(data))) {
      return response.status(400).json({
        error: 'Falha no cadastro do ingrediente, confira os dados inseridos.',
      });
    }

    // Ingredient Exists Validation
    const { id } = request.params;
    const ingredient = await Ingredient.findOne({
      where: { id },
    });
    if (!ingredient) {
      return response.status(400).json({
        error: 'Não foi possível encontrar o ingrediente.',
      });
    }

    // Put
    await ingredient.update(request.body);

    return response.json(ingredient);
  }

  async delete(request, response) {
    // Ingredient Exists Validation
    const { id } = request.params;
    const ingredient = await Ingredient.findOne({
      where: { id },
    });
    if (!ingredient) {
      return response
        .status(400)
        .json({ error: 'Ocorreu um erro, tente novamente mais tarde.' });
    }

    // Destroy
    await ingredient.destroy();

    return response.json();
  }
}

export default new IngredientController();
