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
        const emailCheck = await User.findOne({ email: email })

        if(emailCheck !== null){
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

        const savedUser = await user.save();

        if(savedUser){
            console.log("Added new user: ", savedUser);
        } else {
            console.log("Error occurred during the saving: ", err);
            return res.status(500).json({error: 'Error occurred during the saving'});
        }

        //setting user session attributes
        req.session.user = name;
        req.session.email = email;
        req.session.user_id = savedUser._id.toString() ;
        //as admin is in db by default
        req.session.role = 'user';
        req.session.isAuth = true;

        req.session.save(err => {
            if(err){
                console.error('Session save error: ' + err);
                return res.status(500).json({ error: 'Session save error' });
            }
            return res.status(201).json({ message: 'User added successfully' });
        })
    } catch(err){
        console.error(err);
        return res.status(500).json({ error: 'Hashing error on the server' });
    }
}

module.exports = RegisterNewUser;