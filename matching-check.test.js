const bcrypt = require('bcrypt')
const isMatch = require('./matching-check.js')
const credentials = require('./credentials')
const AdminEmail = credentials.email

// Mocking bcrypt compare function
jest.mock('bcrypt', () => ({
    compare: jest.fn()
}));

describe('isMatch function', () => {
    // Mock request and response objects
    const req = {
        session: {}
    };
    const res = {
        status: jest.fn(() => res),
        json: jest.fn()
    };

    // Sample user data for testing
    const FoundPassword = 'testPassword'
    const found = {
        password: '$2b$10$8nhaydQcuyVegD5h33wOKepiKhRPwHh1EFCGprI3s5DEjtmKlYySW', // bcrypt hash of 'testPassword'
        name: 'testUser',
        email: 'test@email.com'
    }

    test('should throw error if input values are empty', async () => {
        await expect(isMatch('', found, res, req)).rejects.toThrowError('Input values should be not empty')
    })

    test('should return login passed message with user role if passwords match and user is not an admin', async () => {
    bcrypt.compare.mockResolvedValueOnce(true)
    await isMatch(FoundPassword, found, res, req)
        
    expect(req.session.user).toEqual(found.name)
    expect(req.session.email).toEqual(found.email)
    expect(req.session.role).toEqual('user')
        
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ message: 'login passed' })
    })

    test('should return login passed message with admin role if passwords match and user is an admin', async () => {
    bcrypt.compare.mockResolvedValueOnce(true)
    //substituding the avarage uder  email in a sample info with the admin email
    const foundAdmin = { ...found, email: AdminEmail }
    await isMatch(FoundPassword, foundAdmin, res, req)
    
    expect(req.session.user).toEqual(foundAdmin.name)
    expect(req.session.email).toEqual(foundAdmin.email)
    expect(req.session.role).toEqual('admin')
    
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ message: 'login passed' })
    })

    test('should return login failed message if passwords do not match', async () => {
        bcrypt.compare.mockResolvedValueOnce(false)
        await isMatch(FoundPassword, found, res, req)
        
        expect(res.status).toHaveBeenCalledWith(409)
        expect(res.json).toHaveBeenCalledWith({ error: 'login failed' })
    })

    test('should return server error message if an error occurs during comparison', async () => {
        bcrypt.compare.mockRejectedValueOnce(new Error('Comparison error'))
        await isMatch(FoundPassword, found, res, req)
        
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ error: 'server error' })
    })
})
