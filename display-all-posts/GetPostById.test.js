const displayBlog = require('./GetPostById');
const {pool} = require('../database/db');

jest.mock('../database/db', () => ({
    pool: {
        query: jest.fn(),
    },
}));

describe('Display all posts in Blog page', () =>{
    let req , res, err, result;

    //cleaning mock req object after every test
    beforeEach(() => {
        //mock request
        req = {
            params: {
                id: '1'
            }
        };
        //mock response
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        };
    });

    test('should return the error if there is no such post in db', () => {
        err = new Error('db query error');
        pool.query.mockImplementation((_, callback) => callback(err, null));

        displayBlog(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Can't get this post");
    })

    test('should return the json data of post if successful', () => {
        result = [{ id: 1, title: 'Test Post', content: 'This is a test post' }];
        pool.query.mockImplementation((query, callback) => {
            callback(null, result);
        });

        displayBlog(req, res);

        expect(res.json).toHaveBeenCalledWith(result);
    })
})