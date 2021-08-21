// Dependencies
import * as Yup from 'yup';

// Models
import Step from '../models/Step';

class StepController {
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

    // Steps Exists Validation
    const steps = await Step.findAndCountAll({
      order: [['order', 'asc']],
      limit: parseInt(limit, 10),
      offset: (page - 1) * limit,
      distinct: true,
      where,
    });
    if (!steps) {
      return response.json({
        error: 'Não há etapas cadastradas ainda.',
      });
    }

    return response.json({ steps: steps.rows, count: steps.count });
  }

  async show(request, response) {
    // Query Setting
    const { id } = request.params;

    // Step Exists Validation
    const step = await Step.findOne({
      where: { id },
    });
    if (!step) {
      return response.status(404).json('Etapa não encontrada.');
    }

    return response.json(step);
  }

  async store(request, response) {
    // Body Validation
    const data = request.body;

    const schema = Yup.object().shape({
      description: Yup.string()
        .typeError('Descrição da etapa é obrigatório.')
        .required('Descrição da etapa é obrigatório.'),
      time: Yup.string(),
      opcional: Yup.bool(),
      recipe_id: Yup.number()
        .typeError('Falha no cadastro da etapa, confira os dados inseridos.')
        .required('Falha no cadastro da etapa, confira os dados inseridos.'),
    });
    if (!(await schema.validate(data))) {
      return response.status(400).json({
        error: 'Falha no cadastro da etapa, confira os dados inseridos.',
      });
    }

    // Set Order
    const steps = await Step.count();
    data.order = steps + 1;

    // Post
    const step = await Step.create(data);

    return response.json(step);
  }

  async update(request, response) {
    // Body Validation
    const data = request.body;

    const schema = Yup.object().shape({
      description: Yup.string()
        .typeError('Descrição da etapa é obrigatório.')
        .required('Descrição da etapa é obrigatório.'),
      time: Yup.string(),
      order: Yup.number(),
      opcional: Yup.bool(),
    });
    if (!(await schema.validate(data))) {
      return response.status(400).json({
        error: 'Falha no cadastro da etapa, confira os dados inseridos.',
      });
    }

    // Step Exists Validation
    const { id } = request.params;
    const step = await Step.findOne({
      where: { id },
    });
    if (!step) {
      return response.status(400).json({
        error: 'Não foi possível encontrar a etapa.',
      });
    }

    // Put
    await step.update(request.body);

    return response.json(step);
  }

  async delete(request, response) {
    // Step Exists Validation
    const { id } = request.params;
    const step = await Step.findOne({
      where: { id },
    });
    if (!step) {
      return response
        .status(400)
        .json({ error: 'Ocorreu um erro, tente novamente mais tarde.' });
    }

    // Destroy
    await step.destroy();

    return response.json();
  }
}

export default new StepController();
