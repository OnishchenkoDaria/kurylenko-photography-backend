const express = require('express')
const request = require('supertest');
const registerRouter = require('./register.js')

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

  test('should respond with "Works" on GET /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('<h1>Works</h1>');
  });  
});

/*describe('Register Router Register', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/add', registerRouter);
  });

  afterEach(() => {
    // Clean up
  });
*/
  /*it('should respond with "Works" on GET /', async () => {
    //mocking request object
    const req = {
      session: {},
      body: {
        username: 'test',
        usermail: 'test@email.com',
        userpassword: 'testpassword'
      }
    }
    /*const res = {
      status: jest.fn(() => res),
      json: jest.fn()
    }*/
/*
    await request(app).post('/add')
  //  expect(res.json).toHaveBeenCalledWith({ message: 'user added' });
  });  
});*/

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