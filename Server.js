"use strict";

const express = require('express'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
cors = require('cors');

const patientController = require('./controller/PatientController');
const doctorController = require('./controller/DoctorController');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.set("port", process.env.PORT || 5000);

// Mongoose
if (process.env.NODE_ENV !== 'test') {
    const mongooseOpts = {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
    };
    mongoose.connect("mongodb://localhost:27017/csisddb", mongooseOpts)
        .then((res, err) => {
            if (err) console.log("error connecting to database");
        })

    }
// Controllers
app.use('/api/patients', patientController);
app.use('/api/doctors', doctorController);

app.listen(app.get("port"), () => {
    console.log(`CSISD Backend running on port ${app.get("port")}`);
});

module.exports = app;