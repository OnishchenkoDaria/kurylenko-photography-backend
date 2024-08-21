const {setTimeDate} = require('../set-time/setTimeDate');
const {pool} = require('../database/db');
const Order = require('../models/order');

function AddUserPayment(user_email, price, req, res) {
    const Today = setTimeDate();
    console.log(Today);

    if(req.session){
        return res.status(400).json({error: 'no active session'});
    }

    const data = {price: price, date: Today, status: 'payed'};

    const order = new Order(data);

    order.save().then((savedOrder) => {
        console.log('added new order: ', savedOrder);
    }).catch(err => {
        console.log('error occurred during the saving: ', err);
        return res.status(500).json({error: 'error occurred during saving'});
    })

    /*const sql = `INSERT INTO orders SET ?`;
    pool.query(sql,post, (err)=>{
        if (err) {
            console.error("error: ", err);
        }
        console.log('payment added!');
    })*/
}

module.exports = AddUserPayment