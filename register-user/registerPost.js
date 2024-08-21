const Hashing = require('../hashing-data/hashing');
//mongoDB schemas
const  User = require('../models/User');

async function RegisterNewUser(req, res){
    if(req.session.user){
        return res.status(409).json({ error: 'an active session exist' });
    }

    const { username: name, useremail: email, userpassword: password } = req.body;

    //checking for the user being already in mongo db
    try{
        const emailCheck = await User.find({ email: email })

        if(emailCheck.length > 0){
            return res.status(409).json({error: 'email in use'});
        }

        //handling hashing
        //added await and moved hashing to the function mani body
        const newHashedPassword = await Hashing(password)

        const user = new User({
            username: name,
            password: newHashedPassword,
            email: email,
        })

        user.save().then(savedUser => {
            console.log("added new user: ", savedUser);
        }).catch(err => {
            console.log("error occurred during the saving: ", err);
            return res.status(500).json({error: 'error occurred during the saving'});
        });

        //setting user session attributes
        req.session.username = name;
        req.session.email = email;
        req.session.role = 'user';

        return res.status(201).json({ message: 'user added' });
        }
        catch(err){
            console.error(err);
            return res.status(500).json({ error: 'hashing error' });
        }
}

module.exports = RegisterNewUser;