import mongoose from 'mongoose'
import {Mockgoose} from 'mockgoose'
const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zu6qg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

export default {
    connect: () => {
        return new Promise((resolve, reject) => {

            if (process.env.NODE_ENV === 'test') {
                const mockgoose = new Mockgoose(mongoose)

                mockgoose.prepareStorage()
                    .then(() => {
                        mongoose.connect(DB_URI,{
                            useNewUrlParser: true,
                            useCreateIndex: true,
                            useUnifiedTopology: true,
                            socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 },
                        })
                            .then((res, err) => {
                                if (err) return reject(err)
                                resolve(console.log('TEST DB works'))
                            })
                    })
            } else {
                mongoose.connect(DB_URI,{
                    useNewUrlParser: true,
                    useCreateIndex: true,
                    useUnifiedTopology: true,
                    socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 },
                })
                    .then((res, err) => {
                        if (err) return reject(err)
                        resolve(console.log('DB works'))
                    })
            }

        })
    },

    close: () => {
        return mongoose.disconnect()
    }
}

