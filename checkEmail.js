const {db} = require('./db')

async function checkEmail(checkEmailQuery, res) {
    try{
        db.query(checkEmailQuery, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'server error' });
            }
            // if found => result of matching search is not zero but email(s)
            if (result.length > 0) {
                return res.status(409).json({ error: 'email in use' });
            }
        })
    } catch(err){
        throw err
    }
}

module.exports = checkEmail