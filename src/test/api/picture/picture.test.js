process.env.NODE_ENV = 'test'
import {expect} from 'chai'
import request from 'supertest'
import db from '../../../db/dbConnect'
import api from '../../../../src/index'
import fs from 'fs'

let user = {
    email: 'tester@gmail.com',
    password: '12345678'
}

let token, file

const picture = () => {
    describe('POST & GET /picture', () => {
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

        it('OK, post picture work', async () => {
            try {
                let req = await request(api)
                    .post('/picture')
                    .set({ auth: token })
                    .attach('files', fs.readFileSync(`${__dirname}/../test-img/run.jpeg`), 'test-img/run.jpeg')
                expect(req.body.status).to.equal(200)
                expect(req.body.success).to.equal(true)
                expect(req.body.data).to.contain.property('_id')
                expect(req.body.data).to.contain.property('userId')
                expect(req.body.data).to.contain.property('img')
                file = req.body.data
            } catch (e) {
                console.log(e)
            }
        })

        it('OK, get picture list work', async () => {
            try {
                let req = await request(api)
                    .get('/picture')
                    .type('json')
                    .set({ auth: token })
                expect(req.body.status).to.equal(200)
                expect(req.body.success).to.equal(true)
                await fs.unlinkSync(`${__dirname}/../../../../uploads/${file.img[0].name}`)
            } catch (e) {
                console.log(e)
            }
        })
    })
}

export default picture
