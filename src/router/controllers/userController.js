import User from '../models/userModel'

export default {

    userSingin: (req, res) => {
        User.userSingin(req, res, responseCb => {
            return res.send(responseCb)
        })
    },

    userSingup: (req, res) => {
        User.userSingup(req, res, responseCb => {
            return res.send(responseCb)
        })
    }
}

