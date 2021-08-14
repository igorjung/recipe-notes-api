// Dependencies
import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

// Configs
import authConfig from '../../config/auth';

// Models
import Recipe from '../models/Recipe';

// Associations
import Step from '../models/Step';
import Ingredient from '../models/Ingredient';
import Utensil from '../models/Utensil';

class RecipeController {
  async index(request, response) {
    // Query Setting
    const { page = 1, limit = 5 } = request.query;
    const { filters } = request;

    // Filter Setting
    const where = {};

    if (filters) {
      if (filters.user_id) {
        where.user_id = filters.user_id;
      }
      if (filters.name) {
        where.name = {
          [Op.like]: `%${filters.name}%`,
        };
      }
      if (filters.category) {
        where.category = {
          [Op.like]: `%${filters.category}%`,
        };
      }
    }

    // Recipes Exists Validation
    const recipes = await Recipe.findAndCountAll({
      order: [['name', 'asc']],
      limit: parseInt(limit, 10),
      offset: (page - 1) * limit,
      distinct: true,
      include: [
        { model: Step, as: 'steps' },
        { model: Ingredient, as: 'ingredients' },
        { model: Utensil, as: 'utensils' },
      ],
      where,
    });
    if (!recipes) {
      return response.json({
        error: 'Não há receitas cadastradas ainda.',
      });
    }

    return response.json({ recipes: recipes.rows, count: recipes.count });
  }

  async show(request, response) {
    // Query Setting
    const { id } = request.params;

    // Recipe Exists Validation
    const recipe = await Recipe.findOne({
      include: [
        {
          model: Step,
          as: 'steps',
          include: [
            { model: Ingredient, as: 'ingredients' },
            { model: Utensil, as: 'utensils' },
          ],
        },
        { model: Ingredient, as: 'ingredients' },
        { model: Utensil, as: 'utensils' },
      ],
      where: { id },
    });
    if (!recipe) {
      return response.status(404).json('Receita não encontrada.');
    }

    // User Id Validation
    const { authorization } = request.headers;
    const auth = authorization.split(' ')[1];
    const decoded = jwt.verify(auth, authConfig.secret);
    const userId = decoded.id;

    if (recipe.user_id !== userId) {
      return response
        .status(401)
        .json({ error: 'Ops, ocorreu um erro! Tente novamente mais tarde.' });
    }

    return response.json(recipe);
  }

  async store(request, response) {
    // Body Validation
    const data = request.body;

    const schema = Yup.object().shape({
      name: Yup.string()
        .typeError('Nome da receita é obrigatório.')
        .required('Nome da receita é obrigatório.'),
      description: Yup.string(),
      category: Yup.string()
        .typeError('Categoria da receita é obrigatória.')
        .required('Categoria da receita é obrigatória.'),
      preparation_time: Yup.string(),
      financial_cost: Yup.string(),
      user_id: Yup.number()
        .typeError('Falha no cadastro da receita, confira os dados inseridos.')
        .required('Falha no cadastro da receita, confira os dados inseridos.'),
    });
    if (!(await schema.validate(data))) {
      return response.status(400).json({
        error: 'Falha no cadastro da receita, confira os dados inseridos.',
      });
    }

    // User Id Validation
    const { authorization } = request.headers;
    const auth = authorization.split(' ')[1];
    const decoded = jwt.verify(auth, authConfig.secret);
    const userId = decoded.id;

    if (data.user_id !== userId) {
      return response
        .status(401)
        .json({ error: 'Ops, ocorreu um erro! Tente novamente mais tarde.' });
    }

    // Post
    const recipe = await Recipe.create(data);

    return response.json(recipe);
  }

  async update(request, response) {
    // Body Validation
    const data = request.body;

    const schema = Yup.object().shape({
      name: Yup.string()
        .typeError('Nome da receita é obrigatório.')
        .required('Nome da receita é obrigatório.'),
      description: Yup.string(),
      category: Yup.string()
        .typeError('Categoria da receita é obrigatória.')
        .required('Categoria da receita é obrigatória.'),
      preparation_time: Yup.string(),
      financial_cost: Yup.string(),
      user_id: Yup.number()
        .typeError('Falha no cadastro da receita, confira os dados inseridos.')
        .required('Falha no cadastro da receita, confira os dados inseridos.'),
    });
    if (!(await schema.validate(data))) {
      return response.status(400).json({
        error: 'Falha no cadastro da receita, confira os dados inseridos.',
      });
    }

    // Recipe Exists Validation
    const { id } = request.params;
    const recipe = await Recipe.findOne({
      where: { id },
    });
    if (!recipe) {
      return response.status(400).json({
        error: 'Não foi possível encontrar a receita.',
      });
    }

    // User Id Validation
    const { authorization } = request.headers;
    const auth = authorization.split(' ')[1];
    const decoded = jwt.verify(auth, authConfig.secret);
    const userId = decoded.id;

    if (data.user_id !== userId) {
      return response
        .status(401)
        .json({ error: 'Ops, ocorreu um erro! Tente novamente mais tarde.' });
    }

    // Put
    await recipe.update(request.body);

    return response.json(recipe);
  }

  async delete(request, response) {
    // Recipe Exists Validation
    const { id } = request.params;
    const recipe = await Recipe.findOne({
      where: { id },
    });
    if (!recipe) {
      return response
        .status(400)
        .json({ error: 'Ocorreu um erro, tente novamente mais tarde.' });
    }

    // User Id Validation
    const { authorization } = request.headers;
    const auth = authorization.split(' ')[1];
    const decoded = jwt.verify(auth, authConfig.secret);
    const userId = decoded.id;

    if (recipe.user_id !== userId) {
      return response
        .status(401)
        .json({ error: 'Ops, ocorreu um erro! Tente novamente mais tarde.' });
    }

    // Destroy Associations
    await Step.destroy({ where: { recipe_id: recipe.id } });
    await Ingredient.destroy({ where: { recipe_id: recipe.id } });
    await Utensil.destroy({ where: { recipe_id: recipe.id } });

    // Destroy
    await recipe.destroy();

    return response.json();
  }
}

export default new RecipeController();