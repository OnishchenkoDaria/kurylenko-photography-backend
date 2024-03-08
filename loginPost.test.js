const LoginUser = require('./loginPost')
const {db} = require('./db.js') 

describe('Login function', () => {
    let req , res, status, json, query, err, result
   
    //cleaning mock req object after every test
    beforeEach(() => {
        req = {
            session: {},
            body: {
                username: 'test@gmail.com',
                userpassword: 'testpassword'
            }
        }
         //mocking methods
        status = jest.fn().mockReturnThis();
        json = jest.fn();
        res = { status, json };

        query = jest.fn();

        db.query = query;

        err = null;
        result = [];
    })

    test('should eturn server error if the active session exist' , () => {
        req.session.user = true
        LoginUser(req,res)

        expect(status).toHaveBeenCalledWith(409)
        expect(json).toHaveBeenCalledWith({ error: 'an active session exist' })
    })
    //checking wmail in database
    test('should return the error of fail query operation', () => {
        err = new Error('db query error')
        query.mockImplementation((_, callback) => callback(err, null))

        LoginUser(req, res)

        expect(status).toHaveBeenCalledWith(500)
        expect(json).toHaveBeenCalledWith({ error: 'server error' })
    })
})