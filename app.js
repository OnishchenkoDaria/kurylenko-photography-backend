//setting server
const express = require('express');
const app = express();

//documentation
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // enable passing cookies, authorization headers, etc.
    methods: 'GET, POST, PUT, DELETE',  // allow specified HTTP methods
    allowedHeaders: 'Content-Type, *',  // allow specified headers
  }));

const postRouter = require('./routes/posts.js');
const registerRouter = require('./routes/register.js');

app.use('/api/posts', postRouter);
app.use('/users', registerRouter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const options = {
    swaggerDefinition: {
        openapi: "3.0.1",
        info: {
          title: "KURYLENKO PHOTOS",
          version: "1.0.0",
        },
        servers: [
          {
            url: "http://localhost:3001",
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
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

const keys = require('./be-keys');
const private_key = keys.private;
const crypto = require('crypto');

/*//dealing with unknown endpoint
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}*/

app.post('/', (req,res)=> {   
    const Recieved = req.body;
    const dataRecieved = Recieved.data;
    const signatureRecieved = Recieved.signature;

    const jsonString = private_key + dataRecieved + private_key;
    const sha1 = crypto.createHash('sha1').update(jsonString).digest('bin');
    const signatureCreated = Buffer.from(sha1).toString('base64');

    if(signatureCreated === signatureRecieved){
        const decodedString = Buffer.from(dataRecieved, 'base64').toString('utf-8');

        const obj = JSON.parse(decodedString);
        const status = obj.status;
        console.log(status);

        if(status === 'success'){
            console.log('executed success')
            const price = obj.amount
            registerRouter.addPayment(price)
            return res.status(200).json({ message: 'payment successful' })
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

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})