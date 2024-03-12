const {setTime, setDate} = require('./setTimeDate')

function createUniqueNumber() {
    const currTime = setTime()
    console.log(currTime)
    const currDay = setDate()
    console.log(currDay)

    const [hours, minutes, seconds] = currTime.split(':').map(String)
    const [year, day, month] = currDay.split('-').map(String)

    const UniqueNumber = hours+year+minutes+day+seconds+month+ Math.floor(Math.random() * year)
    console.log(UniqueNumber)

    return UniqueNumber
}

module.exports = {createUniqueNumber}