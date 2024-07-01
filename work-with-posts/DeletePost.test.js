const DeletePost = require('./DeletePost.js')
const {pool} = require('../database/db');

jest.mock('../database/db', () => ({
    pool: {
        query: jest.fn(),
    },
}));

describe('Delete the post by id', () => {
    let req, res, err;

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
            send: jest.fn()
        };
    });

    test('should return the error if the problem occured while deleting', () => {
        err = new Error('db query error');
        pool.query.mockImplementation((_, callback) => callback(err, null));

        DeletePost(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(`Post wasn't deleted`);
    })

    test('should successfully delete the post by id', () => {
        pool.query.mockImplementation((_, callback) => callback(null, _));

        DeletePost(req, res);

        expect(res.send).toHaveBeenCalledWith('Post deleted successfully!');
    })
})