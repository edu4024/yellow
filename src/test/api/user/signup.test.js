process.env.NODE_ENV = 'test'
import {expect} from 'chai'
import request from 'supertest'
import db from '../../../db/dbConnect'
import api from '../../../../src/index'

let user = {
    email: 'tester@gmail.com',
    password: '12345678'
}

let userBadEmail = {
    email: 'badTester@gmail.com',
    password: '12345678'
}

let userBadPass = {
    email: 'tester@gmail.com',
    password: '123456'
}


const signup = () => {
    describe('POST /signup', () => {
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

        it('OK, sing up user works', async () => {
            try {
                let req = await request(api)
                    .post('/signup')
                    .type('json')
                    .send(user)
                expect(req.body.status).to.equal(200)
                expect(req.body.success).to.equal(true)
                expect(req.body.data).to.contain.property('email')
                expect(req.body.data).to.contain.property('name')
                expect(req.body.data).to.contain.property('lastName')
            } catch (e) {
                console.log(e)
            }

        })

        it('Fail, bad email user', async () => {
            try {
                let req = await request(api)
                    .post('/signup')
                    .type('json')
                    .send(userBadEmail)
                expect(req.body.status).to.equal(404)
                expect(req.body.success).to.equal(false)
            } catch (e) {
                console.log(e)
            }
        })

        it('Fail, bad pass user', async () => {
            try {
                let req = await request(api)
                    .post('/signup')
                    .type('json')
                    .send(userBadPass)
                expect(req.body.status).to.equal(400)
                expect(req.body.success).to.equal(false)
            } catch (e) {
                console.log(e)
            }

        })
    })
}
export default signup



