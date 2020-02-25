"use strict";

const mongoose = require('mongoose');

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
    }
});

module.exports = mongoose.model("patient", patientSchema);