const isMatch = require('./matching-check');
//mongoDB schemas
const  User = require('../models/User');

async function LoginUser(req, res){
    if(req.session.user){
        return res.status(409).json({ error: 'an active session exist' });
    }

    const { useremail: email, userpassword: password } = req.body;

    try{
        const foundData = await User.find({ email: email})

        //if no email in db matched
        if(foundData.length === 0){
            res.status(409).json({error: 'email not found'});
        }
        await isMatch(password, foundData[0], res, req);
    }
    catch(err){
        console.log(err)
        res.status(500).json({error: 'error working record'});
    }
}

module.exports = LoginUser