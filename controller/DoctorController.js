const doctorRouter = require('express').Router();
const DOCTOR = require('../model/DoctorModel');
const PATIENT = require('../model/PatientModel');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Get all doctors
doctorRouter.route("/").get((req, res) => {
    DOCTOR.find((err, result) => {
        if (err) {
            res.status(500).send();
        } else {
            res.status(200).json(result);
        }
    });
});

// Get one doctor
doctorRouter.get('/doctor', auth, (req,res) => {
    DOCTOR.findById(req.user.name)
        //Get the user without password
        .select('-password')
        .then(doctor => res.json(doctor));
});

// Create a new Doctor
doctorRouter.route("/").post((req, res) => {
    let doctor = new DOCTOR(req.body);

    // Creation date assigned on server-side
    doctor.dateCreated = new Date();

    bcrypt.hash(doctor.password, 12, (err, hash) => {
        doctor.password = hash;
        doctor.save().then(saved => {
            res.status(201).json(saved);
        }).catch(err => {
            res.status(400).send();
        });
    });
});

// Authenticate a Doctor
doctorRouter.route("/auth").post((req, res) => {
    const { name, password } = req.body;
    //Validation check
    if(!name || !password) {
        return res.status(400).json({ msg: 'Fields Empty!Please enter all the fields'});
    }
    //Check existing user
    DOCTOR.findOne({ name })
        .then(doctor => {
            if(!doctor) return res.status(400).json({msg: 'User cannot be found' });
            //Check hash password
            bcrypt.compare(req.body.password, user.password)
                .then(isMatch => {
                    if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });                    
                    jwt.sign(
                        { id: user.id },
                        config.get('jwtSecret'),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if(err) throw err; 
                            res.json({
                                token,
                                doctor: {
                                    id: doctor.id,
                                    username: doctor.username,
                                    fullName: doctor.fullName,
                                    dob: doctor.dob,
                                    dateCreated: doctor.dateCreated,
                                    patients: doctor.patients
                                }
                            });
                        }
                    )
                })
         })
});

// Modify a doctor alltogether
doctorRouter.route("/:id").put((req, res) => {
    DOCTOR.findById(req.params.id, (err, result) => {
        if (err || !result) {
            res.status(404).send();
            return;
        }

        result.username = req.body.username;
        result.fullName = req.body.fullName;
        result.dob = req.body.fullName;
        result.patients = req.body.patients;

        // If password has been changed, hash the new password
        if (req.body.password != result.password) {
            bcrypt.hash(req.body.password, 12, (err, hash) => {
                result.password = hash;
                result.save().then(saved => {
                    res.status(200).json(saved);
                }).catch(err => {
                    res.status(400).send();
                });
            });
        } else {
            result.save().then(saved => {
                res.status(200).json(saved);
            }).catch(err => {
                res.status(400).send();
            });
        }
    });
});

// Add a patient to a doctor
doctorRouter.route("/addPatient/:patientID/to/:doctorID").put((req, res) => {
    DOCTOR.findById(req.params.doctorID, (err, doctor) => {
        if (err || !doctor) {
            res.status(404).send();
            return;
        }

        PATIENT.findById(req.params.patientID, (err, patient) => {
            if (err || !patient) {
                res.status(404).send();
                return;
            }

            doctor.patients.push(patient._id);
            doctor.save().then(saved => {
                res.status(200).json(saved);
            }).catch(err => {
                res.status(400).send();
            })
        });
    });
});

// Delete a doctor
doctorRouter.route("/:id").delete((req, res) => {
    DOCTOR.findByIdAndDelete(req.params.id, (err, result) => {
        if (err) {
            res.status(404).send();
        } else {
            res.status(200).send();
        }
    });
});


module.exports = doctorRouter;