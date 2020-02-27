"use strict";

const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
    heartRate: {
        type: Number,
        required:true
    },
    bloodPressure: {
        type: Number,
        required:true
    },
    timeStamp: {
        type: Date,
        required:true
    }
});

const patientSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true
    },
    healthData: {
        type: [healthDataSchema]
    },
    deviceId:{
        type: String
    }
});

module.exports = mongoose.model("patient", patientSchema);