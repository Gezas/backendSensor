"use strict";

const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
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
    patients: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model("doctor", doctorSchema);