const {setTimeDate} = require('../set-time/setTimeDate');
const User = require('../models/User');

async function AddUserPayment(user_email, price, res) {
    const Today = setTimeDate();
    const data = {price: price, date: Today, status: 'payed'};

    try{
        await User.findOneAndUpdate({email:user_email}, {$push: {orders: data}}, {new: true});

        return res.status(200).json({ message: 'order record added successfully' });
    } catch (err){
        console.log(err);
        return res.status(500).json({error: 'error adding order record to user' });
    }
}

module.exports = AddUserPayment;