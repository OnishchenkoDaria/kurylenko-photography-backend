const User = require('../models/User');

function getUserTable(req, res) {
    if(!req.session){
        return res.status(409).json({ error: 'no active session' });
    }

    console.log(req.session.email);

    User.findOne({email: req.session.email})
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: 'server error' });
        })
}

module.exports = getUserTable