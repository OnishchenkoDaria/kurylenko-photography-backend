const bcrypt = require('bcrypt')
const Hashing = require('./hashing.js')

describe('Hashing password function', () => {

     afterEach(() => {
        // restore the mock
        jest.restoreAllMocks();   
    });

    test('should have the password', async () => {
        const inputPassword = "password"
        const hashedPassword = await Hashing(inputPassword)
        
        expect(typeof hashedPassword).toBe('string')
        expect(hashedPassword).toBeDefined()
    }); 

    test('should throw error if password is not provided', async () => {
        await expect(Hashing('')).rejects.toThrow()
    });
    
    test('should throw error at non-string password', async () => {
        await expect(Hashing(123)).rejects.toThrow('Password must be a string')
    })

    test('should throw an error if bcrypt hash fails', async () => {
        // mocking bcrypt.hash to always throw an error
        jest.spyOn(bcrypt, 'hash').mockRejectedValue(new Error('Bcrypt hash failed'))

        // checking that Hashing function throws the same error as in the catch block
        await expect(Hashing('password')).rejects.toThrow('Bcrypt hash failed')
    });

});
