export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/defaultdb';

export const API_ROUTES = {
  USERS: '/api/users',
  AUTH: '/api/auth',
  PRODUCTS: '/api/products',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found.',
  INVALID_CREDENTIALS: 'Invalid credentials provided.',
  DATABASE_CONNECTION_FAILED: 'Failed to connect to the database.',
};
