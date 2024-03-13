function SessionHookControl(req, res){
    const userName = req.session.user
    console.log(userName)
    if(!req.session.user){
        return res.status(409).json({ error: 'no active session, redirect' })
    }
    else{
        return res.status(200).json(userName)
    }
}

module.exports = SessionHookControl