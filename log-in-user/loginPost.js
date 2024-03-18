const isMatch = require('./matching-check');
const {db} = require('../database/db');

function LoginUser(req, res){
    if(req.session.user){
        console.log('an active session is going');
        return res.status(409).json({ error: 'an active session exist' });
    }
    console.log('login enter success');
    const email = req.body.useremail;
    const password = req.body.userpassword;

    const checkEmailQuery = `SELECT * FROM users WHERE email = '${email}'`;
    db.query(checkEmailQuery, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'server error' });
        }
        //if no email in db matched
        if(result.length === 0){
            return res.status(409).json({ error: 'email not found' });
        }
        //converting data propely into json format
        const string = JSON.stringify(result);
        const json =  JSON.parse(string);
        console.log(json);

        console.log("1: ", password , "2: " , json[0].password);
        isMatch(password, json[0], res, req);
    })
}

module.exports = LoginUser