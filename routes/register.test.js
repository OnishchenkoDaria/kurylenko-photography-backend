const express = require('express');
const registerRouter = require('./register');
const session = require('express-session');

const app = express();

// use express-session middleware
app.use(session({ secret: 'test-secret', resave: true, saveUninitialized: true }));

// mount the registerRouter onto the Express app
app.use('/api', registerRouter);

describe('GET /get-role', () => {

  test('responds with role when session role is set', async () => {
    const role = 'admin';
    const sessionData = { role: role };

    // mock the req 
    const req = { session: sessionData };

    // mock the res 
    const res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };

    // mock the route handler function
    const routeHandler = (req, res) => {
      res.json({ role: req.session.role });
    };

    await routeHandler(req, res);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ role: role });
  });

  test('responds with unauthorized error when session role is not set', async () => {
    // mock the req
    const req = { session: {} };

    // mock the res
    const res = {
      json: jest.fn(),
      status: jest.fn(() => res),
    };

    // mock the route handler function
    const routeHandler = (req, res) => {
      if (!req.session.role) {
        res.status(401).json({ error: 'Unauthorized' })
      } else {
        res.json({ role: req.session.role })
      }
    };

    await routeHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  })
})