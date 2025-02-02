const express = require('express');
const registerRouter = express.Router();
const bodyParser = require('body-parser');

app.use(bodyParser.json());  // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));  // for parsing application/urlencoded

//handling user registration
const RegisterNewUser = require('../register-user/registerPost');

/**
 * @swagger
 * tags:
 *  name: registerUser
 *  description: Register a new user by providing username, email, and password.
 * /users/add:
 *   post:
 *     tags: [registerUser]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 default: testuser
 *               useremail:
 *                 type: string
 *                 format: email
 *                 default: test@email.com
 *               userpassword:
 *                 type: string
 *                 default: test123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Conflict - An active session exists or email is already in use
 *       500:
 *         description: Internal Server Error - Server encountered an unexpected condition
 */

registerRouter.post('/add', (req,res) => {
    RegisterNewUser(req, res);
});

//handling user log in
const LoginUser = require('../log-in-user/loginPost');

/**
 * @swagger
 * tags:
 *  name: loginUser
 *  description: Login the user by providing email, and password.
 * /users/log-in:
 *   post:
 *     tags: [loginUser]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               useremail:
 *                 type: string
 *                 format: email
 *                 default: test@email.com
 *               userpassword:
 *                 type: string
 *                 default: test123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Conflict - An active session exists or email is already in use
 *       500:
 *         description: Internal Server Error - Server encountered an unexpected condition
 */

registerRouter.post('/log-in', (req,res) => {
    LoginUser(req, res);
});

registerRouter.get('/user', (req, res) => {
    if(req.session){
        return res.status(201).json(req.session);
    }
    else{
        return res.status(409).json({ error: 'not session created' });
    }
})

//handles the session check
const SessionHookControl = require('../session-hook/sessionHookPost')
/**
 * @swagger
 * tags:
 *  name: sessionHook
 *  description: This checks if there is an active session and return the username.
 * /users/session-hook:
 *   post:
 *     tags: [sessionHook]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Active session exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userName:
 *                   type: string
 *       409:
 *         description: No active session exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error.
 */
registerRouter.post('/session-hook', (req, res) => {
    SessionHookControl(req, res);
});

/**
 * @swagger
 * tags:
 *  name: getRole
 *  description: This is for returning the role of the user from the active session
 * /users/get-role:
 *  get:
 *      tags: [getRole]
 *      responses:
 *          200:
 *              description: Active role exists
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              role:
 *                                  type: string
 *                                  default: user
 *                                  description: The role of the user
 *          409:
 *              description: No active session exist (Unauthorized)
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  default: Unauthorized
 *                                  description: Error text                      
 */

//too tiny to do it outer - remains in router
//handles the role check --- for posts
registerRouter.get('/get-role', (req, res) => {
    const role = req.session.role
    if (role) {
        res.json({ role: role }); // Send the role in the response body
    } else {
        res.status(409).json({ error: 'Unauthorized' }); // Handle case where role is not set
    }
});

//handles user log out
const LogoutUser = require('../log-out-user/logoutPost');

/**
 * @swagger
 * tags:
 *  name: logOut
 *  description: End the active session for the user.
 * /users/logout:
 *   post:
 *     tags: [logOut]
 *     responses:
 *       200:
 *         description: Session successfully ended.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message that the session has been shut down.
 *       409:
 *         description: No active session to be shut down.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Description of the error.
 */
registerRouter.post('/log-out', (req, res) => {
    LogoutUser(req, res);
});

//handles recording user successsful payment in database orders table
const AddUserPayment = require('../process-liqpay-reaponse/addUserPaymentPost');

/**
 * @swagger
 * tags:
 *  name: addPayment
 *  description: Add payment information for a user.
 * /users/add-user-payment:
 *   post:
 *     tags: [addPayment] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_email:
 *                 format: email
 *                 type: string
 *                 default: test@email.com
 *               price:
 *                 type: string
 *                 default: 2
 *     responses:
 *       200:
 *         description: Payment successfully added.
 *       500:
 *         description: Server error.
 */
registerRouter.addPayment = (price, req, res) => {
    AddUserPayment(user_email, price, req, res);
};

//handles active users all payments table data print
const getUserTable = require('../users-payments-table/getUserOrdersPost');

/**
 * @swagger
 * tags:
 *  name: showTable
 *  description: Retrieve orders information for the authenticated user.
 * /users/user-table:
 *   post:
 *     tags: [showTable] 
 *     responses:
 *       200:
 *         description: Orders information retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   order_id:
 *                     type: integer
 *                     description: The ID of the order.
 *                   email:
 *                     type: string
 *                     description: The email of the user who placed the order.
 *                   price:
 *                     type: number
 *                     description: The price of the order.
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the order was placed.
 *       409:
 *         description: No active session.
 *       500:
 *         description: Server error.
 */
registerRouter.post('/get-table', (req,res)=>{
    getUserTable(req, res);
});

//handles hashing the payment information and transfering it to liq pay
var user_email='';
const HashPaymentInfo = require('../forming-payment-request/PaymentPost');

/**
 * @swagger
 * tags:
 *  name: hashInfo
 *  description: Hash payment information for the Liqpay paument request.
 * /users/hash-payment-info:
 *   post:
 *     tags: [hashInfo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_email:
 *                 format: email
 *                 type: string
 *                 default: test@email.com
 *               value:
 *                 type: number
 *                 default: 
 *     responses:
 *       200:
 *         description: Payment information hashed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   description: The base64-encoded data.
 *                 signature:
 *                   type: string
 *                   description: The base64-encoded signature.
 *       409:
 *         description: No active session.
 */

registerRouter.post('/hashing', (req, res) => {
    user_email = req.session.email;
    HashPaymentInfo(req, res);
});

module.exports = registerRouter