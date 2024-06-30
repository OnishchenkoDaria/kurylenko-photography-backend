const mysql = require('mysql');
const credentials = require('../credentials');
const Hashing = require('../hashing-data/hashing');

const AdminUsername = credentials.username;
const AdminPassword = credentials.password;
const AdminEmail = credentials.email;

var pool =  mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'users'
});

function createUserTable(pool) {
    
    const table = `
        CREATE TABLE IF NOT EXISTS users (
            id int AUTO_INCREMENT, 
            name VARCHAR (255), 
            password VARCHAR (255), 
            email VARCHAR (255), 
            PRIMARY KEY(id)
        )`;

    pool.query(table, (err) => {
        if(err){
            console.error('Error creating thr UserTable: ');
            throw err;
        }
        console.log('users table created');
    });
}

function createPostsTable(pool){

    const table = `CREATE TABLE IF NOT EXISTS posts (
        id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(50) NOT NULL,
        content VARCHAR(1000) NOT NULL,
        date DATE NOT NULL,
        likes INT NOT NULL DEFAULT 0,
        views INT NOT NULL DEFAULT 0,
        imageURL VARCHAR(255) NULL DEFAULT NULL,
        PRIMARY KEY (id));`

    pool.query(table, err => {
        if (err) {
            throw err;
        }
        console.log('posts table created');
    })
}

function createOrdersTable(pool) {
    const orders = 'CREATE TABLE IF NOT EXISTS orders (id int AUTO_INCREMENT, price VARCHAR (255), email VARCHAR (255), date VARCHAR (255), PRIMARY KEY(id))';
    pool.query(orders, err => {
        if(err){
        throw err;
        }
        console.log('orders table created');
    });
}

function insertAdminByDefault(pool) {
    const checkEmpty = `SELECT COUNT(*) AS count FROM users`;
    pool.query(checkEmpty, (queryErr, results)=> {
        if(queryErr){
            console.error('Error executing query ', queryErr);
        } else{
            const rowCount = results[0].count;
            if(rowCount === 0){
                Hashing(AdminPassword)
                .then((newHashed) => {
                    const insertAdmin = 'INSERT INTO users (name, password, email) VALUES (?, ?, ?)';
                    const values = [AdminUsername, newHashed, AdminEmail];
                    pool.query(insertAdmin, values, (insertErr)=> {
                        if (insertErr) {
                            console.error('Error inserting user:', insertErr);
                        } else {
                            console.log(`User inserted`);
                        }
                    });
                });
                // no catch block needed (catching is handeled in hashing.js)
            } else {
                console.log('admin user was already added before');
            }
        }
    });
}

module.exports = {pool, createUserTable, createPostsTable, createOrdersTable, insertAdminByDefault};