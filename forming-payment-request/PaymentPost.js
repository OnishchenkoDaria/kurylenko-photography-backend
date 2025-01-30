const {createUniqueNumber} = require('./setUniqueNumber');
const crypto = require('crypto');

function HashPaymentInfo(req, res){
    if(!req.session.user){
        return res.status(409).json({ error: 'no active session' });
    } else{
        const user_email = req.session.email;
        console.log(user_email);
        const value = req.body.value;
        console.log(value);
        
        const id = createUniqueNumber();
        const private_key = process.env.PRIVATE_MOCK_KEY;
        const public_key = process.env.PUBLIC_MOCK_KEY;
        const json_string = {
            "public_key": public_key,
            "version": "3",
            "action": "pay",
            "amount": value,
            "currency": "UAH",
            "description": "test",
            "order_id": id,
            "result_url": "http://localhost:5173/account-page",
            "server_url": "https://ant-maximum-blindly.ngrok-free.app/"
        };

        const jsonString = JSON.stringify(json_string);
        console.log(jsonString);
        //encoding data
        const data = Buffer.from(jsonString).toString('base64');
        console.log(data);

        //encoding signature
        const sign_string = private_key + data + private_key;
        const hash = crypto.createHash('sha1').update(sign_string).digest('bin');
        const signature = Buffer.from(hash).toString('base64');
        const passData = {data: data , signature: signature};
        return res.status(200).json(passData);
    }
}

module.exports = HashPaymentInfo