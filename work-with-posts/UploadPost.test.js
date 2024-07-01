const UploadPost = require('../work-with-posts/UploadPost')
const {pool} = require('../database/db');

jest.mock('../database/db', () => ({
    pool: {
        query: jest.fn(),
    },
}));

describe('Upload the post with parsed info', () => {
    let req, res, err, post, imageUrl;

    //cleaning mock req object after every test
    beforeEach(() => {
        //mock request
        req = {
            body: {
                title: 'test',
                content: 'test content',
                date: '12/12/2012'
            },
            file: {
                filename: 'title'
            }
        };
        //mock response
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
    });

    test('should return the error if the problem occured while uploading', () => {
        err = new Error('db query error');
        pool.query.mockImplementation((_, __, callback) => callback(err, null));

        UploadPost(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith(`Post wasn't sent.`);
    })

    test('should successfully upload the post', () => {
        imageUrl = '../../public/' + 'title'
        post = ['test','test content','12/12/2012', imageUrl]
        pool.query.mockImplementation((_, post, callback) => callback(null, _));

        UploadPost(req, res);

        expect(res.send).toHaveBeenCalledWith('Post created successfully!');
    })
})