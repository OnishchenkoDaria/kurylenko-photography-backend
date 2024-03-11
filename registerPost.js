const Hashing = require('./hashing');
const {db} = require('./db')
const credentials = require('./credentials')
const AdminEmail = credentials.email

async function RegisterNewUser( req, res){
    if(req.session.user){
        console.log('an active session is going')
        return res.status(409).json({ error: 'an active session exist' });
    }
    console.log('success')
    
    const name = req.body.username
    const email = req.body.useremail
    const password = req.body.userpassword

    // mysql syntax meaning : finding a matching email in the table with the recieved email
    const checkEmailQuery = `SELECT * FROM users WHERE email = '${email}'`;
    db.query(checkEmailQuery, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'server error' });
        }
        // if found => result of matching search is not zero but email(s)
        if (result.length > 0) {
            return res.status(409).json({ error: 'email in use' });
        }
    
        //handling hashing
    
        Hashing(password)
            .then((newHashedPassword) => {

                //перенести все з цього .then у функцію, передавшт нароль newHashedPassword, req, res
                console.log(newHashedPassword)
                //initialization of the post object ---> inserting into mysql table with post
                let post = {name: name , password: newHashedPassword, email: email}
                console.log('orig: '  + name, email, password)
                console.log('after hash: ' + post.name, post.email, post.password)
                //mysql syntax for inserting
                let sql = 'INSERT INTO users SET ?'
                db.query(sql,post, (err) => {
                    console.log('passed')
                    if(err){
                        console.error(err);
                        return res.status(500).json({ error: 'server error' });
                    }
                    //success case
                    console.log('user added!')
                    req.session.user = post.name
                    req.session.email = post.email
                    console.log('session: ' + req.session.user , req.session.email)
                    if(post.email === AdminEmail){
                        req.session.role = 'admin'
                    } else {
                        req.session.role = 'user'
                    }
                                
                    res.status(201).json({ message: 'user added' });
                })
            })
            .catch((error) => {
                console.error(error);
                return res.status(500).json({ error: 'server error' });
            })
    })
}

module.exports = RegisterNewUser