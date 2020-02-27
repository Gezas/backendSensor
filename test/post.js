process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const newone = require('./tempDB');
const app = require('../Server.js');

describe('POST /notes', () => {
    before((done) => {
        
        newone.connect();
        console.log("hello world");
        done();
    })

    beforeEach((done) => {
        newone.clearDatabase();
        done();
    })

    after((done) => {
        newone.closeDatabase();
        console.log("goodbye world");
        done();
    })

    it('OK, creating a new patient', (done) => {
        request(app).post('/api/patients')
          .send({ fullName: null, dob: new Date(), dateCreated: new Date(), healthData:{
            heartRate: 120, bloodPressure: 150, timeStamp: new Date()
          }, deviceId:"1" })
          .then((res) => {
            const body = res.body;
            expect(body).not.to.contain.property('_id')
            done();
          })
          .catch((err) => done(err));
      });

      it('OK2, creating 2nd patient', (done) => {
        request(app).post('/api/patients')
          .send({ fullName: 'Jeff Bezos', dob: new Date(), dateCreated: new Date(), healthData:{
            heartRate: 120, bloodPressure: 150, timeStamp: new Date()
          }, deviceId:"1" })
          .then((res) => {
            const body = res.body;
            expect(body).to.contain.property('_id')
            done();
          })
          .catch((err) => done(err));
      });
    
    })