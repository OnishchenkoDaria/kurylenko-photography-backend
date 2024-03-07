function HashPaymentInfo(req, res){
    if(!req.session.user){
        return res.status(409).json({ error: 'no active session' });
    } else{
        user_email = req.session.email
        console.log(user_email)
        const value = req.body.value
        console.log(value)
        let post = `SELECT MAX(id) AS latest_id FROM orders`
        db.query(post , (err, result) => {
            if(err){
                return res.status(500).json({ error: 'server error' })
            }
            var string = JSON.stringify(result);
            var json = JSON.parse(string)
            let latest_id = json[0].latest_id
            console.log(latest_id)
            if(latest_id === null){
                latest_id = 1
                console.log(latest_id)
            }
            else{
                latest_id = latest_id + 1
                console.log(latest_id)
            }
            
            const private_key = keys.private
            const public_key = keys.public
            const json_string = {
                "public_key": public_key,
                "version": "3",
                "action": "pay",
                "amount": value,
                "currency": "UAH",
                "description": "test",
                "order_id": latest_id,
                "result_url": "http://localhost:5173/account-page",
                "server_url": "https://ant-maximum-blindly.ngrok-free.app/"
            };

            const jsonString = JSON.stringify(json_string);
            console.log(jsonString)
            //encoding data
            const data = Buffer.from(jsonString).toString('base64')
            console.log(data)

            //encoding signature
            const sign_string = private_key + data + private_key
            //console.log(sign_string)
            const hash = crypto.createHash('sha1').update(sign_string).digest('bin')
            //console.log(hash)
            const signature = Buffer.from(hash).toString('base64')
            //console.log(signature)
            const passData = {data: data , signature: signature}
            //console.log(passData.data)
            //console.log(passData.signature)
            return res.status(200).json(passData)
            })
    }

}

module.exports = HashPaymentInfo