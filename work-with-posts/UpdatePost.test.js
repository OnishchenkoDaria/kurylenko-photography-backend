const UpdatePost = require('../work-with-posts/UpdatePost')
const {pool} = require('../database/db');

jest.mock('../database/db', () => ({
    pool: {
        query: jest.fn(),
    },
}));

describe('Update the existitng post by id', () => {
    let req, res, err, update;

    //cleaning mock req object after every test
    beforeEach(() => {
        //mock request
        req = {
            body: {
                title: 'test',
                content: 'test content'
            },
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

    test('should return the error if the problem occured while updating' , () => {
        err = new Error('db query error');
        pool.query.mockImplementation((_, __, callback) => callback(err, null));

        UpdatePost(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Update wasn't applied.");
    })
    test('should succesfully update the post data' , () => {
        update = ['test', 'test content', '1'];

        pool.query.mockImplementation((_, update, callback) => callback(null, _))
        UpdatePost(req, res);

        expect(res.send).toHaveBeenCalledWith("Post updated successfully!");
    })
})