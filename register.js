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

//try to refactor it in further

const RegisterNewUser = require('./registerPost')

registerRouter.post('/add', (req,res) => {
    //function
    RegisterNewUser(req, res)
})

const isMatch = require('./matching-check')
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


registerRouter.post('/session-hook', (req, res) => {
    const userName = req.session.user
    console.log(userName)
    if(!req.session.user){
        return res.status(409).json({ error: 'no active session, redirect' })
    }
    else{
        return res.status(200).json(userName)
    }
})

registerRouter.get('/get-role', (req, res) => {
    const role = req.session.role
    res.json(role)
})

const LogoutUser = require('./loginPost')
//check

registerRouter.post('/log-out', (req, res) => {
    if(!req.session.user){
        return res.status(409).json({ error: 'no active session to be shut' });
    } else{
        req.session.destroy((err) => {
            if (err) {
            return res.status(500).json({ error: 'Error destroying session' });
            }
            //console.log('Logged out');
            return res.status(200).json({ message: 'session shut' })
        });
    }
})

const keys = require('./be-keys')
const { error } = require('console')

registerRouter.addPayment = (price) => {
    const date = new Date()
    const day = date.toLocaleDateString('en-ca', {hour12:false})
    const time = date.toLocaleTimeString('en-US', {hour12:false})
    const Today = day+' '+time
    console.log(Today)
    let post = {price: price, email:user_email, date: Today}
    let sql = `INSERT INTO orders SET ?`
    db.query(sql,post, (err)=>{
        if (err) {
            return res.status(500).json({ error: 'server error' });
        }
        console.log('payment added!')
    })
}

registerRouter.post('/get-table', (req,res)=>{
    if(!req.session.user){
        return res.status(409).json({ error: 'no active session' });
    } else{
        const email = req.session.email
        console.log(email)
        let sql = `SELECT * FROM orders WHERE email ='${email}'`
        db.query(sql, (err, result)=>{
            if (err) {
                return res.status(500).json({ error: 'server error' });
            }
            console.log(result)
            return res.status(200).json(result);
        })    
    }
})

var user_email=''
const HashPaymentInfo = require('./PaymentPost')

registerRouter.post('/hashing', (req, res) => {
    HashPaymentInfo(req, res)
})

module.exports = registerRouter