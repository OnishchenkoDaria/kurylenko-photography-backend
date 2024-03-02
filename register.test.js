const axios = require('axios');
//const register = require('../register.js');
const bcrypt = require('bcrypt');
const express = require('express');
const request = require('supertest');
const registerRouter = require('./register.js')
//const { Hashing } = require('../register');

describe('Register Router', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/', registerRouter);
  });

  afterEach(() => {
    // Clean up
  });

  it('should respond with "Works" on GET /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('<h1>Works</h1>');
  });

  // Add more test cases for other routes and functions
});

//hashing
/*describe('Hashing password function', () => {
    it('should have the password', async () => {
        const inputPassword = "password"
        const hashedPassword = await Hashing(inputPassword)
        
        expect(typeof hashedPassword.toBe('string'))
        expect(hashedPassword).toBeDefined()
    }) 

    it('should throw error if password is not provided', async () => {
        await expect(Hashing()).rejects.toThrow()
    })
})*/