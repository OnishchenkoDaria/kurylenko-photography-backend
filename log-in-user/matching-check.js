const bcrypt = require('bcrypt');
const credentials = require('../credentials');

async function isMatch(FoundPassword, found, res, req) {
    if (FoundPassword.length === 0 || found.length === 0) {
        throw new Error('Input values should be not empty');
    }

    try{
        //the order of input into bcrypt matters!
        // 1st - not hashed password (from user input) , 2nd - hashed (from db)
        const Match = await bcrypt.compare(FoundPassword, found.password);

        if(Match){

            req.session.user = found.username;
            req.session.email = found.email;

            //comparison with admin's info
            if(found.email === process.env.ADMIN_EMAIL){
                req.session.role = 'admin';
            } else{
                req.session.role = 'user';
            }

            return res.status(201).json({ message: 'login passed' });
        }
        else{
            //if passwords did not match
            return res.status(409).json({ error: 'incorrect password' });
        }
    } 
    catch(err){
        console.log("alert!");
        console.error(err);
        return res.status(500).json({ error: 'server error' });
    }
}

module.exports = isMatch;