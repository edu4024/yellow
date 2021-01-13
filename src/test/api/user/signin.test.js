process.env.NODE_ENV = 'test'
import {expect} from 'chai'
import request from 'supertest'
import db from '../../../db/dbConnect'
import api from '../../../../src/index'

let newUser = {
    email: 'tester@gmail.com',
    password: '12345678',
    name: 'test',
    lastName: 'tester'
}

let badUser = {
    email: 'tester.com',
    password: '12345678910'
}

const signin = () => {
    describe('POST /signin', () => {
        before((done) => {
            db.connect()
                .then(() => done())
                .catch((err) => done(err))
        })

        after((done) => {
            db.close()
                .then(() => done())
                .catch((err) => done(err))
        })

        it('OK, creating a new user works', async () => {
            try {
                let req = await request(api)
                    .post('/signin')
                    .type('json')
                    .send(newUser)
                expect(req.statusCode).to.equal(200)
                expect(req.body.success).to.equal(true)
                expect(req.body.data).to.contain.property('email')
                expect(req.body.data).to.contain.property('name')
                expect(req.body.data).to.contain.property('lastName')
            } catch (e) {
                console.log(e)
            }

        })

        it('Fail, registration of an existing user', async () => {
            try {
                let req = await request(api)
                    .post('/signin')
                    .type('json')
                    .send(newUser)
                expect(req.body.status).to.equal(409)
                expect(req.body.success).to.equal(false)
            } catch (e) {

            }

        })

        it('Fail, validation error user', async () => {
            try {
                let req = await request(api)
                    .post('/signin')
                    .type('json')
                    .send(badUser)
                expect(req.statusCode).to.equal(400)
                expect(req.body.result.message).to.equal('user validation failed')
            } catch (e) {
                console.log(e)
            }

        })
    })
}
export default signin

