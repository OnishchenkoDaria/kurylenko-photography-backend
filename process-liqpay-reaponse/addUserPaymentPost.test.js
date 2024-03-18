const AddUserPayment = require('./addUserPaymentPost')
const {db} = require('../database/db')

jest.mock('../set-time/setTimeDate', () => ({
    setTimeDate: jest.fn().mockReturnValue('2024-03-12 22:39:20')
}))

describe('AddUserPayment function', () => {
    let query, err

    beforeEach(() => {
        price = '2'
        user_email = 'test@gmail.com'

        query = jest.fn();
        db.query = query;

        err = null;
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    //mocking console prints
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})

    test('should return error of fail query execution', () => {
        const err = new Error('Insert error')
        query.mockImplementation((_, __, callback) => callback(err))
        AddUserPayment(user_email, price)

        expect(console.error).toHaveBeenCalledWith('error: ', err)
    })

    test('should return success status of insert query', () => {
        query.mockImplementation((_, __, callback) => callback(null))
        AddUserPayment(user_email, price)

        expect(console.log).toHaveBeenCalledWith('payment added!')
    })
})