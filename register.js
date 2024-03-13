const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const sessions = require('express-session');

//header("Access-Control-Allow-Origin: http://localhost:5173");
//creating our mysql database + connecting it with node (next function)

const {db, connectDB, createUserTable, createOrdersTable, insertAdminByDefault} = require('./db')

connectDB(db);

//users table creation
createUserTable(db);

//orders table creation
createOrdersTable(db);


//adding admain user by default with data from unttracked credentails
const credentials = require('./credentials')

//const AdminUsername = credentials.username
//const AdminPassword = credentials.password
const AdminEmail = credentials.email

insertAdminByDefault(db);

const registerRouter = express.Router();

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,  // enable passing cookies, authorization headers, etc.
    methods: 'GET, POST, PUT, DELETE',  // allow specified HTTP methods
    allowedHeaders: 'Content-Type, *',  // allow specified headers
};
registerRouter.use(cors(corsOptions));

//session implementation || future data hash
const crypto = require('crypto');

const generateSecretKey = () => {
  return crypto.randomBytes(64).toString('hex');
};

//console.log(generateSecretKey());

registerRouter.use(
    sessions({
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 //for 24 hours
        },
        secret:generateSecretKey(),
        resave: true,
        saveUninitialized: false,
    })
)
registerRouter.use(express.json());
registerRouter.use(express.urlencoded({ extended: true }));

registerRouter.use(bodyParser.json());

registerRouter.get('/', (req,res) => {
   res.send('<h1>Works</h1>')
})

const RegisterNewUser = require('./registerPost')

registerRouter.post('/add', (req,res) => {
    //function
    RegisterNewUser(req, res)
})

const LoginUser = require('./loginPost')

registerRouter.post('/log-in', (req,res) => {
    LoginUser(req, res)
})

/*
was used at development for checking session functionality

registerRouter.get('/user', (req,res)=> {
    const user = req.session.user
    const role = req.session.role 
    console.log("user: " , user)
    console.log("role: " , role)
    res.json(({user , role }) || null)
})*/

const SessionHookControl = require('./sessionHookPost')

registerRouter.post('/session-hook', (req, res) => {
    SessionHookControl(req, res)
})

registerRouter.get('/get-role', (req, res) => {
    const role = req.session.role
    if (role) {
        res.json({ role: role }); // Send the role in the response body
    } else {
        res.status(409).json({ error: 'Unauthorized' }); // Handle case where role is not set
    }
})

const LogoutUser = require('./logoutPost')
//check

registerRouter.post('/log-out', (req, res) => {
    LogoutUser(req, res)
})

const AddUserPayment = require('./addUserPaymentPost')

registerRouter.addPayment = (price) => {
    AddUserPayment(req, res, user_email, price)
}

const getUserTable = require('./getTablePost')
registerRouter.post('/get-table', (req,res)=>{
    getUserTable(req, res)
})

var user_email=''
const HashPaymentInfo = require('./PaymentPost')

registerRouter.post('/hashing', (req, res) => {
    user_email = req.session.email
    HashPaymentInfo(req, res)
})

module.exports = registerRouter