const LoginUser = require('./loginPost')
const {db} = require('./db.js')
const isMatch = require('./matching-check')

//mocking the module of isMatch and replacing the implementation with jest.fn()
jest.mock('./matching-check' , () => jest.fn())

describe('Login function', () => {
    let req , res, status, json, query, err, result
   
    //cleaning mock req object after every test
    beforeEach(() => {
        req = {
            session: {},
            body: {
                useremail: 'test@gmail.com',
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

    test('should return the error of unsuccessful find of email in db', () => {
        query.mockImplementation((_, callback) => callback(err, result))

        LoginUser(req,res)

        expect(status).toHaveBeenCalledWith(409)
        expect(json).toHaveBeenCalledWith({ error: 'email not found' })
    })

    test('should pass data to isMatch', () => {
        result = [{password: 'hashed'}]
        query.mockImplementation((_,callback) => callback(null, result))

        LoginUser(req, res)

        expect(isMatch).toHaveBeenCalledWith(req.body.userpassword, result[0], res, req)
    })
})