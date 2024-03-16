const AddUserPayment = require('./addUserPaymentPost')
const {db} = require('./db')

jest.mock('./setTimeDate', () => ({
    setTimeDate: jest.fn().mockReturnValue('2024-03-12 22:39:20')
}))

describe('AddUserPayment function', () => {
    let res, req, json, status, query, err, result

    beforeEach(() => {
        price = '2'
        user_email = 'test@gmail.com'
        
        req={}

        status = jest.fn().mockReturnThis();
        json = jest.fn();
        res = { status, json };

        query = jest.fn();
        db.query = query;

        err = null;
        result = [];
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    test('should return error of fail query execution', () => {
        const err = new Error('Insert error')
        query.mockImplementation((_, __, callback) => callback(err))
        AddUserPayment(user_email, price)
    })

    test('should return success status of insert query', () => {
        query.mockImplementation((_, __, callback) => callback(null))
        AddUserPayment(user_email, price)
    })
})