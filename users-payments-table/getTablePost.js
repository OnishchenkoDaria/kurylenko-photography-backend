const {db} = require('../database/db');

function getUserTable(req, res) {
    if(!req.session.user){
        return res.status(409).json({ error: 'no active session' });
    } else{
        const email = req.session.email;
        console.log(email);
        let sql = `SELECT * FROM orders WHERE email ='${email}'`;
        db.query(sql, (err, result)=>{
            if (err) {
                return res.status(500).json({ error: 'server error' });
            }
            console.log(result);
            return res.status(200).json(result);
        })    
    }
}

module.exports = getUserTable