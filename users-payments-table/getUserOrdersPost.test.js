const getUserTable = require('./getUserOrdersPost');
const {pool} = require('../database/db');

describe('getUserTable function', () => {
    let res, req, json, status, query, err, result;

    beforeEach(() => {
        req = {
            session: {
                user: 'testUser',
                email: 'test@gmail.com'
            }
        };

        status = jest.fn().mockReturnThis();
        json = jest.fn();
        res = { status, json };

        query = jest.fn();
        pool.query = query;

        err = null;
        result = [];
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    test('should return error if no active session exist', () => {
        req.session = false;
        getUserTable(req, res);

        expect(status).toHaveBeenCalledWith(409);
        expect(json).toHaveBeenCalledWith({ error: 'no active session' });
    })

    test('should return error of fail query executing', () => {
        const err = new Error('select error');
        query.mockImplementation((_, callback) => callback(err, []));

        getUserTable(req, res);

        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({ error: 'server error' });
    })

    test('should return success status of select query', () => {
        query.mockImplementation((_, callback) => callback(null, result));
        getUserTable(req, res);

        expect(status).toHaveBeenCalledWith(200);
        expect(json).toHaveBeenCalledWith(result);
    })
})