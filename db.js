const mysql = require('mysql')
const credentials = require('./credentials')
const Hashing = require('./hashing');

const AdminUsername = credentials.username
const AdminPassword = credentials.password
const AdminEmail = credentials.email

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'users'
})

function connectDB(db) {
    db.connect(err => {
        if (err) {
            console.error('MySQL Connection Error:', err);
            throw err;
        }
        console.log('MySQL Connected');
    });
}

function createUserTable(db) {
    let table = 'CREATE TABLE IF NOT EXISTS users (id int AUTO_INCREMENT, name VARCHAR (255), password VARCHAR (255), email VARCHAR (255), PRIMARY KEY(id))'
    db.query(table, err => {
        if(err){
        throw err
        }
        console.log('users table created')
    });
}

function createOrdersTable(db) {
    let orders = 'CREATE TABLE IF NOT EXISTS orders (id int AUTO_INCREMENT, price VARCHAR (255), email VARCHAR (255), date VARCHAR (255), PRIMARY KEY(id))'
    db.query(orders, err => {
        if(err){
        throw err
        }
        console.log('orders table created')
    });
}

function insertAdminByDefault(db) {
    const checkEmpty = `SELECT COUNT(*) AS count FROM users`
    db.query(checkEmpty, (queryErr, results)=> {
        if(queryErr){
            console.error('Error executing query ', queryErr)
        } else{
            const rowCount = results[0].count
            if(rowCount === 0){
                Hashing(AdminPassword)
                .then((newHashed) => {
                    const insertAdmin = 'INSERT INTO users (name, password, email) VALUES (?, ?, ?)'
                    const values = [AdminUsername, newHashed, AdminEmail];
                    db.query(insertAdmin, values, (insertErr)=> {
                        if (insertErr) {
                            console.error('Error inserting user:', insertErr)
                        } else {
                            console.log(`User inserted`)
                        }
                    })
                })
                // no catch block needed (catching is handeled in hashing.js)
            } else {
                console.log('admin user was already added before')
            }
        }
    })
}

module.exports = {db, connectDB, createUserTable, createOrdersTable, insertAdminByDefault};