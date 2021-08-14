// Controllers
import AuthController from './app/controllers/AuthController';
import UserController from './app/controllers/UserController';

import RecipeController from './app/controllers/RecipeController';
import StepController from './app/controllers/StepController';
import IngredientController from './app/controllers/IngredientController';
import UtensilController from './app/controllers/UtensilController';

// Middlewares
import token from './app/middlewares/token';
import filters from './app/middlewares/filters';

// Dependencies
const { Router } = require('express');

const routes = new Router();

routes.get('/', (req, res) =>
  res.json({ message: 'Welcome to Recipe Notes API' })
);

// Auth
routes.post('/auth/register', AuthController.register);
routes.post('/auth/login', AuthController.login);

// Users
routes.get('/users/:id', UserController.show);
routes.put('/users/:id', token, UserController.update);
routes.delete('/users/:id', token, UserController.delete);

// Recipes
routes.get('/recipes', token, filters, RecipeController.index);
routes.get('/recipes/:id', token, RecipeController.show);
routes.post('/recipes', token, RecipeController.store);
routes.put('/recipes/:id', token, RecipeController.update);
routes.delete('/recipes/:id', token, RecipeController.delete);

// Steps
routes.get('/steps', token, filters, StepController.index);
routes.get('/steps/:id', token, StepController.show);
routes.post('/steps', token, StepController.store);
routes.put('/steps/:id', token, StepController.update);
routes.delete('/steps/:id', token, StepController.delete);

// Ingredients
routes.get('/ingredients', token, filters, IngredientController.index);
routes.get('/ingredients/:id', token, IngredientController.show);
routes.post('/ingredients', token, IngredientController.store);
routes.put('/ingredients/:id', token, IngredientController.update);
routes.delete('/ingredients/:id', token, IngredientController.delete);

// Utensils
routes.get('/utensils', token, filters, UtensilController.index);
routes.get('/utensils/:id', token, UtensilController.show);
routes.post('/utensils', token, UtensilController.store);
routes.put('/utensils/:id', token, UtensilController.update);
routes.delete('/utensils/:id', token, UtensilController.delete);

export default routes;
