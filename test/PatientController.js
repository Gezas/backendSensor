const expect = require('chai').expect;
const request = require('supertest');

const app = require('../Server.js');

describe('First test of the day', () => {
    let userIDs = []
    let token;
    before((done) => {
        request(app)
        .post('/api/doctors/auth')
        .send({username: "znagy", password:"pizza"})
        .then((res) => {
            const body = res.body;
            token = body.token;
            done();
        })
    })
    after(() => {
        userIDs.forEach((id) => {
            console.log(id)
        })
        return request(app)
        .delete('/api/patients/' + userIDs[0])
        .set('Authorization', token)
        .expect(200)

    })

    it('Creating a patient', (done) => {
        const newuser = {
            fullName: "Jeffery",
            dob: new Date(),
            dateCreated: new Date(),
            prescriptions: "Paracetamol"
        }
        request(app)
        .post('/api/patients')
        .set('Authorization', token)
        .send(newuser)
        .then((res) => {
            const body = res.body;
            expect(res.status).to.equal(201);
            expect(body.fullName).to.equal("Jeffery");
            expect(body).to.contain.property("dob");
            expect(body).to.contain.property("dateCreated");
            expect(body.prescriptions).to.equal("Paracetamol");
            userIDs.push(body._id);
            done();
        })
    })

    it('Get all patients', () => {
        return request(app)
        .get('/api/patients')
        .set('Authorization', token)
        .expect(200)
    });

});

describe('Retrieving a single patient', () => {
    let userIDs = []
    let newuserID = "";
    let token = "";

    
    // create a patient in the database
    const newuser = {
        fullName: "Matthew",
        dob: new Date(),
        dateCreated: new Date(),
        prescriptions: "Paracetamol Uno"
    }
    before((done) => {
        request(app)
        .post('/api/doctors/auth')
        .send({username: "znagy", password:"pizza"})
        .then((res) => {
            const body = res.body;
            token = body.token;

            request(app)
            .post('/api/patients')
            .set('Authorization', token)
            .send(newuser)
            .then((res) => {
                newuserID = res.body._id;
                userIDs.push(newuserID)
                done();
            })
        })
    })

    after(() => {
        userIDs.forEach((id) => {
            console.log(id)
        })
        return request(app)
        .delete('/api/patients/' + userIDs[0])
        .set('Authorization', token)
        .expect(200)

    })

    it('Get one patient', (done) => {

        request(app)
        .get('/api/patients/' + newuserID)
        .set('Authorization', token)
        .then((res) => {
            const body = res.body;
            expect(res.status).to.equal(200);
            expect(body._id).to.equal(newuserID);
            expect(body.fullName).to.equal("Matthew");
            expect(body).to.contain.property("dob");
            expect(body).to.contain.property("dateCreated");
            expect(body.prescriptions).to.equal("Paracetamol Uno");
            done();
        })
    })
})
