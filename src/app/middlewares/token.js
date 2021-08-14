// Dependencies
import jwt from 'jsonwebtoken';

// Utils
import { promisify } from 'util';

// Configs
import authConfig from '../../config/auth';

// Authentication Validation
async function Token(request, response, next) {
  // Token Exists Validation
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return response.status(401).json({
      error: 'Usuário precisa esta logado para executar essa ação.',
    });
  }

  // Get Token
  const [, BearerToken] = authHeader.split(' ');

  try {
    // Token Validation
    const decoded = await promisify(jwt.verify)(BearerToken, authConfig.secret);

    request.userId = decoded.id;

    return next();
  } catch (err) {
    return response.status(401).json({
      error: 'Usuário precisa esta logado para executar essa ação.',
    });
  }
}

export default Token;
