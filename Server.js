"use strict";

const express = require('express'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
cors = require('cors');

const patientController = require('./controller/PatientController');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.set("port", process.env.PORT || 5000);

// Mongoose
mongoose.connect(
    "mongodb://localhost:27017/tmsdb",
    { useNewUrlParser: true,
    useUnifiedTopology: true }
);
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

// Controllers
app.use('/api/patients', patientController);

app.listen(app.get("port"), () => {
    console.log(`CSISD Backend running on port ${app.get("port")}`);
});

module.exports = app;