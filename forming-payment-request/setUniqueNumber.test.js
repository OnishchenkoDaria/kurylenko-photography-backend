const {createUniqueNumber} = require('../forming-payment-request/setUniqueNumber');

jest.mock('../set-time/setTimeDate', () => ({
    setTime: jest.fn().mockReturnValue('22:39:20'),
    setDate: jest.fn().mockReturnValue('2024-03-12')
}));

describe('createUniqueNumber function', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should successfully execute', () => {
        Math.random = jest.fn(() => 0.123456);

        const result = createUniqueNumber();
        expect(result).toBe('22202439032012249');
    })
})