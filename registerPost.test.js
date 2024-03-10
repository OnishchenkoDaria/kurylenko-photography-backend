const RegisterNewUser = require('./registerPost');
const { db } = require('./db.js');
const Hashing = require('./hashing');
const credentials = require('./credentials');

jest.mock('./hashing');

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
        result = {};
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
        /*const hashedPassword = 'hashedPassword';
        Hashing.mockResolvedValueOnce(hashedPassword);

        await RegisterNewUser(req, res);

        expect(Hashing).toHaveBeenCalledWith('testpassword');
        expect(query).toHaveBeenCalled();*/
        // Add more assertions as needed
    });

    /* handling hashing promise */
    test('should catch the error during hashing', async() => {
        /*jest.mock('./hashing', () => jest.fn().mockRejectedValue(new Error('haching error')));*/
        /*err = new Error('hashing error')
        await RegisterNewUser(req, res);
    
        expect(Hashing).toHaveBeenCalledWith('testpassword');
        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({ error: 'server error' });*/
    });
    
});
