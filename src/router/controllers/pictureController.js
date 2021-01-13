import Picture from '../models/pictureModel'

export default {

    post: (req, res) => {
        Picture.postPicture(req, res, responseCb => {
            return res.send(responseCb)
        })
    },

    get: (req, res) => {
        Picture.getPicture(req, res, responseCb => {
            return res.send(responseCb)
        })
    }
}