function SessionHookControl(req, res){
    if(!req.session.user){
        return res.status(409).json({ error: 'no active session, redirect' });
    }
    else{
        return res.status(201).json(req.session.user);
    }
}

module.exports = SessionHookControl