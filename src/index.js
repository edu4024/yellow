import express from 'express'
const app = express()
import bodyParser from 'body-parser'
import api from './router/routePath'
import db from './db/dbConnect'
import cors from 'cors'
import passport from 'passport'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './../swagger.json'

const port = process.env.SERVER_APP_PORT || 8088

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {explorer : true}))
app.use('/uploads', express.static('./uploads'))
app.use('*', cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(api)
app.route('/')
    .get((req, res) => {
        res.sendFile(process.cwd() + '/src/index.html')
    })

db.connect()
    .then(() => {
        app.listen(port, (err) => {
            if (err) {
                console.log(err)
            }
            console.log(`we have fun on http://localhost:${port}`)
        })
    })

/**
 * export for run test
 */
export default app