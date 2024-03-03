const bcrypt = require('bcrypt')
const Hashing = require('./hashing.js')

describe('Hashing password function', () => {
    it('should have the password', async () => {
        const inputPassword = "password"
        const hashedPassword = await Hashing(inputPassword)
        
        expect(typeof hashedPassword).toBe('string')
        expect(hashedPassword).toBeDefined()
    }); 

    it('should throw error if password is not provided', async () => {
        await expect(Hashing('')).rejects.toThrow()
    });
    
    it('should throw error at non-string password', async () => {
        await expect(Hashing(123)).rejects.toThrow('Password must be a string')
    })

    it('should throw an error if bcrypt hash fails', async () => {
        // Mocking bcrypt.hash to always throw an error
        jest.spyOn(bcrypt, 'hash').mockRejectedValue(new Error('Bcrypt hash failed'))

        // Ensure that Hashing function throws the same error caught in the catch block
        await expect(Hashing('password')).rejects.toThrow('Bcrypt hash failed')
        
        // Restore the original implementation of bcrypt.hash
        bcrypt.hash.mockRestore()
    });

});
