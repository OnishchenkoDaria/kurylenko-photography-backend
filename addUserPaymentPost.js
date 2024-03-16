const {setTimeDate} = require('./setTimeDate')
const {db} = require('./db')

function AddUserPayment(user_email, price) {
    const Today = setTimeDate()
    console.log(Today)
    let post = {price: price, email:user_email, date: Today}
    let sql = `INSERT INTO orders SET ?`
    db.query(sql,post, (err)=>{
        if (err) {
            console.error("error: ", err)
        }
        console.log('payment added!')
    })
}

module.exports = AddUserPayment