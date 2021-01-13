import Running from '../models/runningModel'

export default {
    runRecord:  (req, res) => {
        Running.runRecord(req, res, responseCb => {
            return res.send(responseCb)
        })
    },

    runList: (req, res) => {
        Running.runList(req, res, responseCb => {
            return res.send(responseCb)
        })
    },

    runReport: (req, res) => {
        Running.runReport(req, res, responseCb => {
            return res.send(responseCb)
        })
    }
}