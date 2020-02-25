const patientRouter = require('express').Router();
const PATIENT = require('../model/PatientModel');

/*
    ENDPOINTS

    GET
        /
        /:id

    POST
        /

    PUT
        /:id

    DELETE
        /:id

*/

// Get all patients
patientRouter.route("/").get((req, res) => {
    PATIENT.find((err, result) => {
        if (err) {
            res.status(500).send();
        } else {
            res.status(200).json(result);
        }
    });
});

// Get one patient
patientRouter.route("/:id").get((req, res) => {
    PATIENT.findById(req.params.id, (err, result) => {
        if (err) {
            res.status(404).send();
        } else {
            res.status(200).json(result);
        }
    });
});

// Create a new Patient
patientRouter.route("/").post((req, res) => {
    let patient = new PATIENT(req.body);

    // Creation date assigned on server-side
    patient.dateCreated = new Date();
    
    patient.save().then(saved => {
        res.status(201).json(saved);
    }).catch(err => {
        res.status(400).send();
    });
});

// Modify a patient
patientRouter.route("/:id").put((req, res) => {
    PATIENT.findById(req.params.id, (err, result) => {
        result.fullName = req.body.fullName;
        result.dob = req.body.fullName;

        result.save().then(saved => {
            res.status(200).json(saved);
        }).catch(err => {
            res.status(400).send();
        });
    });
});

// Delete a patient
patientRouter.route("/:id").delete((req, res) => {
    PATIENT.findByIdAndDelete(req.params.id, (err, result) => {
        if (err) {
            res.status(404).send();
        } else {
            res.status(200).send();
        }
    });
});

module.exports = patientRouter;