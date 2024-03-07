function LogoutUser(req, res){
    if(!req.session.user){
        return res.status(409).json({ error: 'no active session to be shut' });
    } else{
        req.session.destroy((err) => {
            if (err) {
            return res.status(500).json({ error: 'Error destroying session' });
            }
            //console.log('Logged out');
            return res.status(200).json({ message: 'session shut' })
        });
    }
}

module.exports = LogoutUser