var {db, connectDB, createUserTable, createOrdersTable, insertAdminByDefault} = require('./db')

describe('Connecting database', () => {

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

        connectDB(dbMock)
        expect(spyLog).toHaveBeenCalledWith('MySQL Connected')

    })
    
    test('should return error in connection failure case', () => {
        const error = new Error('Connection error')
        const dbMock = {
            connect: jest.fn(callback => callback(error))
        };

        // Mock spy console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => connectDB(dbMock)).toThrow(error);
        expect(consoleErrorSpy).toHaveBeenCalledWith('MySQL Connection Error:', error);
    })
})

 const dbMock = {
        query: jest.fn()
    }

describe('Creating User Table in a database', () => {
    
    beforeEach(() => {
        jest.restoreAllMocks(); // Restore mocks before each test
    });
    
    test('should create the users table successfully', async() => {
        dbMock.query.mockImplementation((table, callback) => {
            callback(null) //success
        })  
         // Spy on console.log
        const logSpy = jest.spyOn(console, 'log')

        createUserTable(dbMock);
        expect(dbMock.query).toHaveBeenCalledWith(
            'CREATE TABLE IF NOT EXISTS users (id int AUTO_INCREMENT, name VARCHAR (255), password VARCHAR (255), email VARCHAR (255), PRIMARY KEY(id))',
            expect.any(Function)
        )
        expect(logSpy).toHaveBeenCalledWith('users table created')
    })

    test('should throw the error beacause of users query failure', async() => {
        dbMock.query.mockImplementation((table, callback) => {
            callback(new Error('users Query execution failed')); // failure
        });

        expect(() => createUserTable(dbMock)).toThrow('users Query execution failed');
    })
})

describe('Creating Order Table in a database', () => {
    beforeEach(() => {
        jest.restoreAllMocks(); // Restore mocks before each test
    });

    test('should create the orders tale successfully', async() => {
        dbMock.query.mockImplementation((orders, callback) => {
            callback(null) //success
        })  
         // Spy on console.log
        const logSpy = jest.spyOn(console, 'log')

        createOrdersTable(dbMock);
        expect(dbMock.query).toHaveBeenCalledWith(
            'CREATE TABLE IF NOT EXISTS orders (id int AUTO_INCREMENT, price VARCHAR (255), email VARCHAR (255), date VARCHAR (255), PRIMARY KEY(id))',
            expect.any(Function)
        )
        expect(logSpy).toHaveBeenCalledWith('orders table created')
    })

    test('should throw the error beacause of orders query failure', async() => {
        dbMock.query.mockImplementation((orders, callback) => {
            callback(new Error('orders Query execution failed')); // failure
        });

        expect(() => createOrdersTable(dbMock)).toThrow('orders Query execution failed');
    })
})

const mockHashing = jest.fn();

jest.mock('./hashing', () => jest.fn());

describe('insertAdminByDefault function', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    });

    test('should insert admin user when users table is empty', async () => {
        const mockResultsEmpty = [{ count: 0 }]
        dbMock.query.mockImplementation((query, values, callback) => {
            if (typeof values === 'function') {
                callback = values
                values = null
            }
            if (query === 'SELECT COUNT(*) AS count FROM users') {
                callback(null, mockResultsEmpty)
            } else if (query === 'INSERT INTO users (name, password, email) VALUES (?, ?, ?)') {
                callback(null)
            }
        });

        mockHashing.mockReturnValue('hashedPassword')
        insertAdminByDefault(dbMock)

        expect(dbMock.query).toHaveBeenCalledTimes(2) // 1 check + 1 insert admin into users
        expect(dbMock.query).toHaveBeenCalledWith(expect.any(String), expect.any(Function)) // Check for SELECT COUNT(*) query
        expect(dbMock.query).toHaveBeenCalledWith(expect.any(String), expect.any(Array), expect.any(Function)) // Check for INSERT INTO users query
    })

    test('should execute query error while inserting admin user in empty table', () => {
        const mockResultsEmpty = [{ count: 0 }]
        const mockError = new Error('Error inserting user:')
        dbMock.query.mockImplementation((query, values, callback) => {
            if (typeof values === 'function') {
                callback = values
                values = null
            }
            //if select -> success callback || if insert -> error callback
            if (query === 'SELECT COUNT(*) AS count FROM users') {
                callback(null, mockResultsEmpty)
            }
            else if (query === 'INSERT INTO users (name, password, email) VALUES (?, ?, ?)') {
                callback(mockError)
            }
        })
        mockHashing.mockReturnValue('hashedPassword')
        console.error = jest.fn()
        insertAdminByDefault(dbMock)

        expect(dbMock.query).toHaveBeenCalledTimes(2)
        expect(dbMock.query).toHaveBeenCalledWith(expect.any(String), expect.any(Function)); // Check for SELECT COUNT(*) query
        expect(dbMock.query).toHaveBeenCalledWith(expect.any(String), expect.any(Array), expect.any(Function)); // Check for INSERT INTO users query
        expect(console.error).toHaveBeenCalledWith('Error inserting user:', mockError); // Check error case

    })

    test('should not insert admin user when users table is not empty', async () => {
        const mockResultsNotEmpty = [{ count: 1 }]
        dbMock.query.mockImplementation((query, callback) => {
            callback(null, mockResultsNotEmpty);
        });

        await insertAdminByDefault(dbMock)

        expect(dbMock.query).toHaveBeenCalledTimes(1) //just check , no insert
        expect(dbMock.query).toHaveBeenCalledWith(expect.any(String), expect.any(Function)) // Check for SELECT COUNT(*) query
    })

    test('should handle database query errors', async () => {
        const mockError = new Error('Database error')
        dbMock.query.mockImplementation((query, callback) => {
            callback(mockError)
        });

        console.error = jest.fn() // Mock console.error

        await insertAdminByDefault(dbMock)

        expect(dbMock.query).toHaveBeenCalledTimes(1); // Only SELECT COUNT(*) query should be called
        expect(console.error).toHaveBeenCalledWith('Error executing query ', mockError) // Check for error message
    })
})