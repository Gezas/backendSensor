const axios = require('axios');
const DEVICEID = 1;

let data = []

let interval = setInterval(function() {
    data.push({
        heartRate: 120,
        bloodPressure: 110,
        timeStamp: Date()
    })
    
  }, 1000);
  

  let postData = setInterval(function() {
    axios.post('http://localhost:5000/api/patients/data', {deviceId: DEVICEID, healthData: data})
        .then(res => {
            console.log(res.data);
            data = [];
        })
        .catch(err => {
            console.log(err.message);
            clearInterval(interval);
            clearInterval(postData);
        })
    
  }, 10000);