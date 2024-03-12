function setTime(){
    const date = new Date()
    const time = date.toLocaleTimeString('en-US', {hour12:false})
    return time
}

function setDate(){
    const date = new Date()
    const day = date.toLocaleDateString('en-ca', {hour12:false})
    return day
}

function setTimeDate(time, date) {
    time = setTime()
    day = setDate()
    const Today = day+' '+time
    console.log(Today)
    return Today
}

module.exports = {setTime, setDate, setTimeDate}