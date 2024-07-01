const displayAll = require('./DisplayAllPosts');
const {pool} = require('../database/db');

jest.mock('../database/db', () => ({
    pool: {
        query: jest.fn(),
    },
}));

describe('Display all available posts', () => {
    let req , res, err, result;

    //cleaning mock req object after every test
    beforeEach(() => {
        //mock request
        req = { };
        //mock response
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        };
    });

    test('should return an error while pulling from db', () => {
        err = new Error('db query error');
        pool.query.mockImplementation((_, callback) => callback(err, null));

        displayAll(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(`Can't get this post`);
    })

    test('should pull all posts from db posts table successfully', () => {
        result = [{ id: 1, title: 'test', content: 'test content' }];
        pool.query.mockImplementation((_, callback) => callback(null, result));

        displayAll(req, res);
        
        expect(res.json).toHaveBeenCalledWith(result);
    })
})