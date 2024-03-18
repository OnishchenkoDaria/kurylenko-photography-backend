const {setTime, setDate} = require('../set-time/setTimeDate');

function createUniqueNumber() {
    const currTime = setTime();
    console.log(currTime);
    const currDay = setDate();
    console.log(currDay);

    const [hours, minutes, seconds] = currTime.split(':').map(String);
    const [year, day, month] = currDay.split('-').map(String);

    const randomElement = Math.floor(Math.random() * year);
    console.log(randomElement);

    const UniqueNumber = hours + year + minutes + day + seconds + month + randomElement;
    console.log(UniqueNumber);

    return UniqueNumber;
}

module.exports = {createUniqueNumber}