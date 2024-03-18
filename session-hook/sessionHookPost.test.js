const SessionHookControl = require('./sessionHookPost');

describe('SessionHookControl function', () => {
    let req, res, status, json;
    beforeEach(() => {
        req = {
            session: {
                user: 'testname'
            }
        };
        status = jest.fn().mockReturnThis();
        json = jest.fn();
        res = { status, json };
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return error if no active session exist', () => {
        req.session.user = false;
        SessionHookControl(req, res);

        expect(status).toBeCalledWith(409);
        expect(json).toBeCalledWith({ error: 'no active session, redirect' });
    })

    test('should return success ststus if active session exist', () => {
        SessionHookControl(req, res);

        expect(status).toBeCalledWith(200);
        expect(json).toBeCalledWith(req.session.user);
    })
})