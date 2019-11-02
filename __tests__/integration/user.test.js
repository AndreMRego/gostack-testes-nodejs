import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';

import User from '../../src/app/models/User';
import truncate from '../util/trucate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt user password when new user created', async () => {
    const user = await User.create({
      name: 'Andre Marcelo',
      email: 'andre@gmail.com',
      password: '123456',
    });
    // Comparar senha inserida com a senha hash gerada no banco
    const compareHash = await bcrypt.compare('123456', user.password_hash);

    // verificar se a senha hash foi gerada
    expect(compareHash).toBe(true);
  });

  it('should be able to register', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Andre Marcelo',
        email: 'andre@gmail.com',
        password: '123456',
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register with duplicated email', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'Andre Marcelo',
        email: 'andre@gmail.com',
        password: '123456',
      });

    const response = await request(app)
      .post('/users')
      .send({
        name: 'Andre Marcelo',
        email: 'andre@gmail.com',
        password: '123456',
      });

    expect(response.status).toBe(400);
  });
});
