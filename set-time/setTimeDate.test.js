const {setTime, setDate, setTimeDate} = require('./setTimeDate');

describe('setTime sunction', () => {

    test('should execute successfully', () => {
       //mocking new Date - 2024-03-12 22:39:20
        const mockDate = new Date('2024-03-12T22:39:20');
        const mockLocateTime = jest.spyOn(mockDate, 'toLocaleTimeString').mockReturnValue('22:39:20');

        global.Date = jest.fn(() => mockDate);

        const result = setTime();
        expect(mockLocateTime).toHaveBeenCalledWith('en-US', {hour12:false});
        expect(result).toBe('22:39:20');
    })
})

describe('setDate function', () => {
    test('should execute successfully', () => {
       //mocking new Date - 2024-03-12 
        const mockDate = new Date('2024-03-12T22:39:20');
        const mockLocateDate = jest.spyOn(mockDate, 'toLocaleDateString').mockReturnValue('2024-03-12');

        global.Date = jest.fn(() => mockDate);

        const result = setDate()
        expect(mockLocateDate).toHaveBeenCalledWith('en-ca', {hour12:false});
        expect(result).toBe('2024-03-12');
    })
})

describe('setTimeDate', () =>{
    test('should execute successfully', () => {
        const mockDate = new Date('2024-03-12T22:39:20');
        const mockLocateTime = jest.spyOn(mockDate, 'toLocaleTimeString').mockReturnValue('22:39:20');
        const mockLocateDate = jest.spyOn(mockDate, 'toLocaleDateString').mockReturnValue('2024-03-12');

        global.Date = jest.fn(() => mockDate);
        const result = setTimeDate();

        expect(mockLocateTime).toHaveBeenCalledWith('en-US', {hour12:false});
        expect(mockLocateDate).toHaveBeenCalledWith('en-ca', {hour12:false});
        expect(result).toBe('2024-03-12 22:39:20');
    })
})