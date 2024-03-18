const Hashing = require('../hashing-data/hashing');
const {db} = require('../database/db');
const credentials = require('../credentials');
const AdminEmail = credentials.email;

async function RegisterNewUser(req, res){
    if(req.session.user){
        console.log('an active session is going');
        return res.status(409).json({ error: 'an active session exist' });
    }
    console.log('success');
    
    const name = req.body.username;
    const email = req.body.useremail;
    const password = req.body.userpassword;

    // mysql syntax meaning : finding a matching email in the table with the recieved email
    const checkEmailQuery = `SELECT * FROM users WHERE email = '${email}'`;
    const result = await new Promise((resolve) => {
        db.query(checkEmailQuery, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'server error'});
            }
            // if found => result of matching search is empty arr or email(s)
            resolve(result);
        })
    })
    console.log(result);
    
    if (result.length > 0) {
        console.log('lenth check');
        return res.status(409).json({ error: 'email in use' });
    }
    console.log('after length check');
    
    //handling hashing
    //added await and moved hashing to the function mani body
    await Hashing(password)
        .then((newHashedPassword) => {
                
            console.log(newHashedPassword);
            
            //initialization of the post object ---> inserting into mysql table with post
            const post = {name: name , password: newHashedPassword, email: email};
            console.log('orig: '  + name, email, password);
            console.log('after hash: ' + post.name, post.email, post.password);
           
            //mysql syntax for inserting
            const sql = 'INSERT INTO users SET ?';
            db.query(sql,post, (err) => {
                console.log('passed');
                if(err){
                    console.error(err);
                    return res.status(500).json({ error: 'server error' });
                }

                //success case
                console.log('user added!');
                req.session.user = post.name;
                req.session.email = post.email;
                console.log('session: ' + req.session.user , req.session.email);
                if(post.email === AdminEmail){
                    req.session.role = 'admin';
                } else {
                    req.session.role = 'user';
                }
                                
                return res.status(201).json({ message: 'user added' });
            })
        })
        .catch((error) => {
            console.log('catch block');
            console.error(error);
            return res.status(500).json({ error: 'hashing error' });
        })
    
}

module.exports = RegisterNewUser