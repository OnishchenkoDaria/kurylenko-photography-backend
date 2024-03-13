const {setTimeDate} = require('./setTimeDate')
const {db} = require('./db')

function AddUserPayment(req, res, user_email, price) {
    const Today = setTimeDate()
    console.log(Today)
    let post = {price: price, email:user_email, date: Today}
    let sql = `INSERT INTO orders SET ?`
    db.query(sql,post, (err)=>{
        if (err) {
            return res.status(500).json({ error: 'server error' });
        }
        console.log('payment added!')
        return res.status(200).json({ message: 'payment added!' })
    })
}

module.exports = AddUserPayment