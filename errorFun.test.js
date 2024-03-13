const errorFunction = require("./errorFun")
const errorInside = require('./errorInside')

jest.mock('./errorInside')

describe('errorFunc', ()=>{
    test('try catch', async() => {
        console.log('test start')
        const errorMessage = 'inside error';
        const err = new Error(errorMessage);

        errorInside.mockRejectedValueOnce(err)
        console.log('before await')

        await errorFunction()

        console.log('after await')
        
    });
})