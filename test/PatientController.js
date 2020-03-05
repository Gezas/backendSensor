process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const newone = require('./tempDB');
const app = require('../Server.js');

describe('Creating patients with invalid data fields', () => {

    before((done) => {
        
        newone.connect();
        console.log("Connected to DB");
        done();
    })

    beforeEach((done) => {
        console.log("Cleared DB");
        newone.clearDatabase();
        done();
    })

    after((done) => {
        newone.closeDatabase();
        console.log("Closed DB");
        done();
    })

    it('Creating a patient with one of the properties being an empty value', () => {
      const patientData =
      {
        fullName: null,
        dob: new Date(),
        dateCreated: new Date(),
        healthData: [{
          heartRate: 120,
          bloodPressure: 150,
          timeStamp: new Date()
        }],
        deviceId: "1"
      };

      let nullName = JSON.parse(JSON.stringify(patientData));
      nullName.fullName = "";

      let nullDob = JSON.parse(JSON.stringify(patientData));
      nullDob.dob = "a string";

      let nullDateCreated = JSON.parse(JSON.stringify(patientData));
      nullDateCreated.dateCreated = "a string";


      return request(app)
        .post('/api/patients')
        .send(nullName)
        .expect(400)
        .send(nullDob)
        .expect(400)
        .send(nullDateCreated)
        .expect(400)
    })

    it('Creating a patient with valid data', () => {
      const patientDataFull =
      {
        fullName: "Jeff",
        dob: new Date(),
        dateCreated: new Date(),
        healthData: [{
          heartRate: 120,
          bloodPressure: 150,
          timeStamp: new Date()
        }],
        deviceId: "1"
      };
      const patientData =
      {
        fullName: "Jeff",
        dob: new Date(),
        dateCreated: new Date()
      };

      return request(app)
        .post('/api/patients')
        .send(patientData)
        .expect(201)
        .send(patientDataFull)
        .expect(201)
      });

    it('Get all patients', (done) => {
      const patientDataFull =
      {
        fullName: "Jeff",
        dob: new Date(),
        dateCreated: new Date(),
        healthData: [{
          heartRate: 120,
          bloodPressure: 150,
          timeStamp: new Date()
        }],
        deviceId: "1"
      };
      const patientData =
      {
        fullName: "Jeff2",
        dob: new Date(),
        dateCreated: new Date()
      };

      // uploading first patient
      request(app)
        .post('/api/patients')
        .send(patientDataFull)
        // uploading second patient
        .then(() => {
          request(app)
            .post('/api/patients')
            .send(patientDataFull)
            // retrieving all users
            .then((res) => {
              request(app)
                .get('/api/patients')
                .then((res) => {
                  const body = res.body;
                  expect(body.length).to.be.above(1);
                  expect(body[0]).to.contain.property("fullName");
                  expect(body[0]).to.contain.property("dob");
                  expect(body[0]).to.contain.property("dateCreated");
                  expect(body[0]).to.contain.property("healthData");
                  expect(body[0].healthData[0]).to.contain.property("heartRate");
                  expect(body[0].healthData[0]).to.contain.property("bloodPressure");
                  expect(body[0].healthData[0]).to.contain.property("timeStamp");
                  expect(body[0]).to.contain.property("deviceId");
                  done();
                })
            })
        })
    });

    it('Get a patient by ID', (done) => {
      const patientDataFull =
      {
        fullName: "Jeff",
        dob: new Date(),
        dateCreated: new Date(),
        healthData: [{
          heartRate: 120,
          bloodPressure: 150,
          timeStamp: new Date()
        }],
        deviceId: "1"
      };

      // uploading first patient
      request(app)
        .post('/api/patients')
        .send(patientDataFull)
        .then((res) => {
          request(app)
            .get('/api/patients/' + res.body._id)
            .then((res) => {
              const body = res.body;
              expect(body.fullName).to.equal("Jeff");
              expect(body).to.contain.property("dob");
              expect(body).to.contain.property("dateCreated");
              expect(body).to.contain.property("healthData");
              expect(body.healthData[0].heartRate).to.equal(120);
              expect(body.healthData[0].bloodPressure).to.equal(150);
              expect(body.healthData[0]).to.contain.property("timeStamp");
              expect(body.deviceId).to.equal("1");
              done();
            }).catch((err) => console.log("The error is: ", err.message))
        })
    });
    
    it('Modify a patient', (done) => {
      const originalPatientDataFull =
      {
        fullName: "Jeff",
        dob: new Date(),
        dateCreated: new Date(),
        healthData: [{
          heartRate: 120,
          bloodPressure: 150,
          timeStamp: new Date()
        }],
        deviceId: "1"
      };
      const newPatientDataFull =
      {
        fullName: "Mike",
        dob: new Date(),
        dateCreated: new Date(),
        healthData: [{
          heartRate: 123,
          bloodPressure: 199,
          timeStamp: new Date()
        }],
        deviceId: "2"
      };

      // uploading first patient
      request(app)
        .post('/api/patients')
        .send(originalPatientDataFull)
        .then((res) => {
          // update the user
          request(app)
            .put('/api/patients/' + res.body._id)
            .send(newPatientDataFull)
            // updated patient's _id stored in res2
            .then((res2) => {
              // retrieve the updated patient
              request(app)
                .get('/api/patients/' + res2.body)
                // updated patient object stored in res3
                .then((res3) => {
                  const body = res3.body;
                  expect(body._id).to.equal(res2.body);
                  expect(body.fullName).to.equal(newPatientDataFull.fullName);
                  expect(body).to.contain.property('dob');
                  expect(body).to.contain.property('dateCreated');
                  expect(body).to.contain.property('healthData');
                  expect(body.healthData[0].heartRate).to.equal(newPatientDataFull.healthData[0].heartRate);
                  expect(body.healthData[0].bloodPressure).to.equal(newPatientDataFull.healthData[0].bloodPressure);
                  expect(body.healthData[0]).to.contain.property('timeStamp');
                  expect(body.deviceId).to.equal(newPatientDataFull.deviceId);
                  done();
                }).catch((err) => console.log("The error is: ", err.message))
            })
        }).catch((err) => console.log("The error is: ", err.message))
    });

    it('Delete a patient', () => {
      const patientDataFull =
      {
        fullName: "Jeff",
        dob: new Date(),
        dateCreated: new Date(),
        healthData: [{
          heartRate: 120,
          bloodPressure: 150,
          timeStamp: new Date()
        }],
        deviceId: "1"
      };

      // uploading first patient
      request(app)
        .post('/api/patients')
        .send(patientDataFull)
        .then((res) => {
          // delete the user
          request(app)
            .delete('/api/patients/' + res.body._id)
            .expect(200)
        }).catch((err) => console.log("The error is: ", err.message))
    })

    it('Update patient\'s health data', (done) => {
      const patientDataFull =
      {
        fullName: "Jeff",
        dob: new Date(),
        dateCreated: new Date(),
        healthData: [{
          heartRate: 120,
          bloodPressure: 150,
          timeStamp: new Date()
        }],
        deviceId: "1"
      };
      const data = {
        healthData: [{
          heartRate: 130,
          bloodPressure: 140,
          timeStamp: new Date()
        },
        {
          heartRate: 180,
          bloodPressure: 140,
          timeStamp: new Date()
        }],
        deviceId: "1"
      }

      // create a new patient
      request(app)
      .post('/api/patients')
      .send(patientDataFull)
      // newly created patient stored in res
      .then((res) => {
        request(app)
        .post('/api/patients/data')
        .send(data)
        .then((res) => {
          const body = res.body;
          expect(body).to.contain.property('_id');
          expect(body.healthData.length).to.be.above(2)
          done();
        }).catch((err) => console.log('The error: ', err.message))
      })
    })
    })