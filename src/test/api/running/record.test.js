process.env.NODE_ENV = 'test'
import {expect} from 'chai'
import request from 'supertest'
import db from '../../../db/dbConnect'
import api from '../../../../src/index'

let user = {
    email: 'tester@gmail.com',
    password: '12345678'
}

let testRecord = {
    distance: 1000,
    time: 138000
}

let badRecord = {
    time: 138000
}

let token


const record = () => {
    describe('POST /record', () => {
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
                token = req.body.token
                expect(req.body.status).to.equal(200)
            } catch (e) {
                console.log(e)
            }
        })

        it('OK, create record works', async () => {
            try {
                let req = await request(api)
                    .post('/record')
                    .type('json')
                    .set({ auth: token })
                    .send(testRecord)
                expect(req.body.status).to.equal(200)
                expect(req.body.success).to.equal(true)
                expect(req.body.data).to.contain.property('distance')
                expect(req.body.data).to.contain.property('time')
                expect(req.body.data).to.contain.property('userId')
                expect(req.body.data).to.contain.property('date')
                expect(req.body.data).to.contain.property('avSpeed')
            } catch (e) {
                console.log(e)
            }
        })


        it('Fail, bad token user', async () => {
            try {
                let req = await request(api)
                    .post('/record')
                    .type('json')
                    .set({ auth: 'bad' + token })
                    .send(testRecord)
                expect(req.status).to.equal(302)
                expect(req.header.connection).to.equal('close')
            } catch (e) {
                console.log(e)
            }
        })

        it('Fail, validation error record', async () => {
            let badUser = {
                email: 'tester.com',
                password: '12345678910'
            }
            let req = await request(api)
                .post('/record')
                .type('json')
                .set({ auth: token })
                .send(badRecord)
            expect(req.statusCode).to.equal(400)
            expect(req.body.result.message).to.equal('running validation failed')
        })

    })
}
export default record