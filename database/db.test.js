var {createUserTable, createOrdersTable, insertAdminByDefault} = require('../database/db');
const mysql = require('mysql');

/*describe('Connecting database', () => {

    afterEach(() => {
        // restore the spy created with spyOn
        jest.restoreAllMocks();   
    });
    
    test('should log "MySQL Connected" if success', () => {
        const dbMock = {
            connect: jest.fn(callback => callback(null)) //defining to return null in stead of undefined
        }

        // Mock spy console.log
        const spyLog = jest.spyOn(console, 'log');

        connectDB(dbMock);
        expect(spyLog).toHaveBeenCalledWith('MySQL Connected');

    })
    
    test('should return error in connection failure case', () => {
        const error = new Error('Connection error');
        const dbMock = {
            connect: jest.fn(callback => callback(error))
        };

        // Mock spy console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => connectDB(dbMock)).toThrow(error);
        expect(consoleErrorSpy).toHaveBeenCalledWith('MySQL Connection Error:', error);
    })
})*/

 const dbMock = {
        query: jest.fn()
    }

describe('Creating User Table in a database', () => {
    
    beforeEach(() => {
        jest.restoreAllMocks(); // Restore mocks before each test
    });
    
    test('should create the users table successfully', async() => {
        dbMock.query.mockImplementation((_, callback) => {
            callback(null); //success
        })  
         // Spy on console.log
        const logSpy = jest.spyOn(console, 'log');

        createUserTable(dbMock);
        expect(dbMock.query).toHaveBeenCalledWith(
            'CREATE TABLE IF NOT EXISTS users (id int AUTO_INCREMENT, name VARCHAR (255), password VARCHAR (255), email VARCHAR (255), PRIMARY KEY(id))',
            expect.any(Function)
        )
        expect(logSpy).toHaveBeenCalledWith('users table created');
    })

    test('should throw the error beacause of users query failure', async() => {
        dbMock.query.mockImplementation((_, callback) => {
            callback(new Error('users Query execution failed')); // failure
        });

        expect(() => createUserTable(dbMock)).toThrow('users Query execution failed');
    });
})

describe('Creating Order Table in a database', () => {
    beforeEach(() => {
        jest.restoreAllMocks(); // Restore mocks before each test
    });

    test('should create the orders tale successfully', async() => {
        dbMock.query.mockImplementation((_, callback) => {
            callback(null) //success
        })  
         // Spy on console.log
        const logSpy = jest.spyOn(console, 'log');

        createOrdersTable(dbMock);
        expect(dbMock.query).toHaveBeenCalledWith(
            'CREATE TABLE IF NOT EXISTS orders (id int AUTO_INCREMENT, price VARCHAR (255), email VARCHAR (255), date VARCHAR (255), PRIMARY KEY(id))',
            expect.any(Function)
        );
        expect(logSpy).toHaveBeenCalledWith('orders table created');
    })

    test('should throw the error beacause of orders query failure', async() => {
        dbMock.query.mockImplementation((_, callback) => {
            callback(new Error('orders Query execution failed')); // failure
        });

        expect(() => createOrdersTable(dbMock)).toThrow('orders Query execution failed');
    })
})


// Mocking the database connection
jest.mock('mysql', () => ({
    createConnection: jest.fn(() => ({
        query: jest.fn(),
    })),
}));

// Mocking the hashing function
jest.mock('../hashing-data/hashing', () => jest.fn(() => Promise.resolve('hashedPassword')))

describe('insertAdminByDefault', () => {
    let mockDb;
    let consoleErrorSpy;

    beforeEach(() => {
        // Reset mock functions and clear mock calls history before each test
        jest.clearAllMocks()

        // Creating a mock DB instance
        mockDb = new mysql.createConnection();

        // Spy on console.error
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    })

    afterEach(() => {
        // Restore console.error after each test
        consoleErrorSpy.mockRestore();
    })

    test('should insert admin when no users exist', async () => {
        // Mocking a zero users in the database
        mockDb.query.mockImplementationOnce((_, callback) => {
            callback(null, [{ count: 0 }]);
        })

        // Mocking the insertion function
        mockDb.query.mockImplementationOnce((_, __, callback) => {
            callback(null);
        })

        await insertAdminByDefault(mockDb);

        expect(mockDb.query).toHaveBeenCalledTimes(2);
        expect(mockDb.query.mock.calls[1][0]).toContain('INSERT INTO users');
    })

    test('should not insert admin when users exist', async () => {
        // Mocking the existing users in the database
        mockDb.query.mockImplementationOnce((_, callback) => {
            callback(null, [{ count: 1 }]);
        });

        await insertAdminByDefault(mockDb);
    });

    test('should handle errors during insertion', async () => {
        //anslogically to 1st test
        mockDb.query.mockImplementationOnce((_, callback) => {
            callback(null, [{ count: 0 }]);
        })

        mockDb.query.mockImplementationOnce((_, __, callback) => {
            callback(new Error('Insertion error'));
        })

        await insertAdminByDefault(mockDb);
        expect(console.error).toHaveBeenCalledWith('Error inserting user:', new Error('Insertion error'));
    });

    test('should handle errors during query execution', async () => {
       //Mocking error
        mockDb.query.mockImplementationOnce((_, callback) => {
            callback(new Error('Query execution error'));
        })

        await insertAdminByDefault(mockDb);

        expect(console.error).toHaveBeenCalledWith('Error executing query ', new Error('Query execution error'));
    })
})