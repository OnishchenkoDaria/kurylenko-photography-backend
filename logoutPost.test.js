const LogoutUser = require("./logoutPost");

describe('log out User function',() => {
    let res, req, json, status, err;

    beforeEach(() => {
        req = {
            session: {
               user: "testUser"
            }
        }

        status = jest.fn().mockReturnThis();
        json = jest.fn()
        res = { status, json }
    
        err = null;
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    test('should return error if no active session exist' , () => {
        req.session.user = false;
        LogoutUser(req, res)

        expect(status).toBeCalledWith(409);
        expect(json).toBeCalledWith({ error: 'no active session to be shut' })
    })

    test('should return error while destroying session', () => {
        const err = new Error('Destroying error')
        req.session.destroy = jest.fn(callback => callback(err))
        LogoutUser(req, res)

        expect(status).toBeCalledWith(500)
        expect(json).toBeCalledWith({ error: 'Error destroying session' })
    })

    test('should cope with Logging out successfully', () => {
        req.session.destroy = jest.fn(callback => callback())
        LogoutUser(req, res)

        expect(status).toBeCalledWith(200)
        expect(json).toBeCalledWith({ message: 'session shut' })
    })
})