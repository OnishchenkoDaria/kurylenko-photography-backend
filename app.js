//setting server
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('dotenv').config();

const app = express();
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    databaseName: 'users',
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 24 * 2, //is stored for 2 days (in milliseconds)
    connectionOptions: {
        serverSelectionTimeoutMS: 10000 //connectivity or working around deprecation warnings
    }
}, function(error) {
    if (error) {
        console.error("Error while connecting to the MongoDB: ", error);
    } else {
        console.log("MongoDB Session Store Connected!");
    }
});

//catch errors
store.on('error', function(error) {
    console.error("Session Store Error: ", error);
});

//documentation
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const cors = require('cors');

//enable body parsing for incoming JSON and form data
app.use(bodyParser.json());  // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));  // for parsing application/urlencoded

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(cors({
    origin: ['https://kurylenko-photography-frontend.onrender.com'], //frontend hosted
    credentials: true, // enable passing cookies, authorization headers, etc.
    methods: ['GET, POST, PUT, DELETE'],  // allow specified HTTP methods
    allowedHeaders: ['Content-Type, Access-Control-Allow-Origin, *'],  // allow specified headers
}));

const crypto = require('crypto');

app.use( session({
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 48, //sets cookie for 48 hours
        secure: true,  //HTTPS protocol
        httpOnly: true, //prevent access from client-side JS
        sameSite: 'None' //cors
    },
    store: store,
    resave: false, // resaves only in case of change
    saveUninitialized: false,
}))

const postRouter = require('./routes/posts.js');
const registerRouter = require('./routes/register.js')

app.use('/api/posts', postRouter);
app.use('/users', registerRouter);

const options = {
    swaggerDefinition: {
        openapi: "3.0.1",
        info: {
          title: "KURYLENKO PHOTOS",
          version: "1.0.0",
        },
        servers: [
          {
            url: "https://kurylenko-photography-backend.onrender.com",
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "https",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
      apis: ["./routes/*.js"],
    };
    
const swaggerSpecs = swaggerJsdoc(options);
app.use('/apo9i-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

const private_key = process.env.PRIVATE_MOCK_KEY;

/*//dealing with unknown endpoint
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}*/

app.post('/', async (req,res)=> {
    const Received = req.body;
    const dataReceived = Received.data;
    const signatureReceived = Received.signature;

    const jsonString = private_key + dataReceived + private_key;
    const sha1 = crypto.createHash('sha1').update(jsonString).digest('bin');
    const signatureCreated = Buffer.from(sha1).toString('base64');

    if(signatureCreated === signatureReceived){
        const decodedString = Buffer.from(dataReceived, 'base64').toString('utf-8');

        const obj = JSON.parse(decodedString);
        const status = obj.status;
        console.log(status);

        if(status === 'success'){
            console.log('executed success')
            const price = obj.amount
            await registerRouter.addPayment(price, res);
        }
        else if(status === 'error'){
            console.log('executed error')
            return res.status(400).json({ error: 'payment not successful' })
        }
        else if(status === 'failure'){
            console.log('executed fail')
            return res.status(420).json({ error: 'payment failed' })
        }
        else if(status === 'reversed'){
            console.log('executed refund')
            return res.status(423).json({ message: 'refund' })
        }        
    }
    else{
        console.log('signature is not proved')
        return res.status(409).json({ message: 'refund' })
    }
})

app.get('/', (req,res)=> {
    console.log('hello payment get')
    res.send("hi get")
})

//for unknown endpoint
const unknownEndpoint = (req, res) => {
    res.status(404).json({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
    console.error(err.message)

    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'invalid mongo db object id' })
    }

    next(err);
}

app.use(errorHandler);

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})