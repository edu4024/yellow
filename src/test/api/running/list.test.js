process.env.NODE_ENV = 'test'
import {expect} from 'chai'
import request from 'supertest'
import db from '../../../db/dbConnect'
import api from '../../../../src/index'

let user = {
    email: 'tester@gmail.com',
    password: '12345678'
}

let token


const list = () => {
    describe('GET /list & GET /report', () => {
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

        it('OK, get run list work', async () => {
            try {
                let req = await request(api)
                    .get('/list')
                    .type('json')
                    .set({ auth: token })
                expect(req.body.status).to.equal(200)
                expect(req.body.success).to.equal(true)
            } catch (e) {
                console.log(e)
            }
        })


       it('Fail, get run list, bad token user', async () => {
            try {
                let req = await request(api)
                    .get('/list')
                    .type('json')
                    .set({ auth: 'bad' + token })
                expect(req.status).to.equal(302)
                expect(req.header.connection).to.equal('close')
            } catch (e) {
                console.log(e)
            }
        })

        it('OK, get report list work', async () => {
            try {
                let req = await request(api)
                    .get('/report')
                    .type('json')
                    .set({ auth: token })
                expect(req.body.status).to.equal(200)
                expect(req.body.success).to.equal(true)
            } catch (e) {
                console.log(e)
            }
        })

        it('Fail, get report list, bad token user', async () => {
            try {
                let req = await request(api)
                    .get('/report')
                    .type('json')
                    .set({ auth: 'bad' + token })
                expect(req.status).to.equal(302)
                expect(req.header.connection).to.equal('close')
            } catch (e) {
                console.log(e)
            }

        })

    })
}
export default list