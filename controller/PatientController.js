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

//Modify a patient
patientRouter.put('/:id', (req, res) => {
    PATIENT.findByIdAndUpdate({_id: req.params.id},req.body)
      .then(function(){
        PATIENT.findOne({_id: req.params.id}).then(function(patient){
          res.json(patient._id);
        })
      })
      .catch(err => {
        res.status(400).send();
    });
});

// Delete a patient
patientRouter.delete('/:id', (req, res) => {
    PATIENT.findById(req.params.id)
      .then(patient => patient.remove().then(() => res.status(200).send()))
      .catch(err => res.status(404).send());
  });

// update patient's health data 
patientRouter.post('/data', (req, res) => {
    console.log("Health data updated successfully!!!!!")
    PATIENT.findOne({deviceId : req.body.deviceId})
        .then((patient) => {
            patient.healthData.push(...req.body.healthData);
            //patient.healthData.concat(req.body.healthData);
            patient.save()
                .then(saved => {
                    //res.status(201).json(saved);
                    res.status(201).json(saved);
                })
                .catch(err => {
                    //res.status(400).send();
                    res.status(201).json({_id:"lol"});
                });
        });
});

module.exports = patientRouter;