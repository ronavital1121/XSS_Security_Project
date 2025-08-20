import request from 'supertest';
import app from '../expressApp';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the correct path
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Increase timeout for all tests
jest.setTimeout(30000);

describe('User Registration and Login', () => {
  const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    username: 'testuser123',
    password: 'testpassword',
  };

  beforeAll(async () => {
    try {
      const uri = process.env.MONGO_URI;
      if (!uri) {
        throw new Error('MONGO_URI not defined in .env');
      }
      
      // Connect to MongoDB with correct case for database name
      await mongoose.connect(uri, { 
        dbName: 'notesDB',
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      // Only clean up our test user if it exists
      await mongoose.connection.collection('users').deleteOne({ username: testUser.username });
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      // Only clean up our test user
      await mongoose.connection.collection('users').deleteOne({ username: testUser.username });
      // Close the connection
      await mongoose.connection.close();
    } catch (error) {
      console.error('Error during cleanup:', error);
      throw error;
    }
  });

  it('registers a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('username', testUser.username);
    expect(res.body).not.toHaveProperty('password');
    expect(res.body).not.toHaveProperty('passwordHash');
  });

  it('fails to register with missing fields', async () => {
    const res = await request(app)
      .post('/users')
      .send({ username: 'incomplete' });
    expect(res.statusCode).toBe(400);
  });

  it('logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: testUser.username, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('_id');
    expect(res.body.user).toHaveProperty('name', testUser.name);
    expect(res.body.user).toHaveProperty('email', testUser.email);
  });

  it('fails to login with wrong password', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: testUser.username, password: 'wrongpassword' });
    expect(res.statusCode).toBe(401);
  });

  it('fails to login with non-existent user', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'nonexistent', password: 'irrelevant' });
    expect(res.statusCode).toBe(401);
  });
}); 