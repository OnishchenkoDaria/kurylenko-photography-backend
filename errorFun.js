const errorInside = require('./errorInside')

async function errorFunction() {
    await errorInside()
    .then(()=>{
        console.log('then')
    })
    .catch((err)=>{
        console.log('err: ', err)
    })
    console.log('end of errorFunction')
}

module.exports = errorFunction