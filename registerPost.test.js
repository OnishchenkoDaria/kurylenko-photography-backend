const RegisterNewUser = require('./registerPost');
const { db } = require('./db.js');
const Hashing = require('./hashing');
const credentials = require('./credentials');

jest.mock('./hashing', () => jest.fn(() => Promise.resolve('hashedPassword')))
const { AdminEmail } = credentials;

describe('RegisterNewUser function', () => {
    let res, req, json, status, query, err, result;

    beforeEach(() => {
        req = {
            session: {},
            body: {
                username: 'testname',
                userpassword: 'testpassword',
                useremail: 'test@gmail.com'
            }
        };
        status = jest.fn().mockReturnThis();
        json = jest.fn();
        res = { status, json };
    
        query = jest.fn();
        db.query = query;
    
        err = null;
        result = [];
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return error if the active session exists', () => {
        req.session.user = true;
        RegisterNewUser(req, res);

        expect(status).toHaveBeenCalledWith(409);
        expect(json).toHaveBeenCalledWith({ error: 'an active session exist' });
    });

    test('should return error of failed query operation', () => {
        err = new Error('db query error');
        query.mockImplementation((_, callback) => callback(err, result));

        RegisterNewUser(req, res);

        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({ error: 'server error' });
    });

    test('should return error if the email was found in db', () => {
        result = [{ useremail: 'test@getMaxListeners.com' }];
        query.mockImplementation((_, callback) => callback(err, result));

        RegisterNewUser(req, res);

        expect(status).toHaveBeenCalledWith(409);
        expect(json).toHaveBeenCalledWith({ error: 'email in use' });
    });

    

    test('should handle hashing success', async () => {
        // Mocking successful hashing
        Hashing.mockResolvedValueOnce('hashedPassword');

        // Mocking the database query to return no user with the input email
        query.mockImplementationOnce((_, callback) => callback(null, []))
        query.mockImplementationOnce((_, __, callback) => callback(null, result))
        await RegisterNewUser(req, res)

        expect(Hashing).toHaveBeenCalledWith('testpassword')
        expect(query).toHaveBeenCalled()
        //SEEct and INSERT CALLS
        expect(db.query).toHaveBeenCalled()
        //checking(let sql = 'INSERT INTO users SET ?'
        //        db.query(sql,post, (err))
        //callback is not a function
        //returning undefined
        const { user, email, role } = req.session;
        expect(user).toBe('testname');
        expect(email).toBe('test@gmail.com');
        expect(role).toBe('user');

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ message: 'user added' })
    })


    /* handling hashing promise */
    test('should catch the error during hashing', async() => {
        
    })

})
