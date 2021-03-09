import User from '../../models/User'
import Running from '../../models/Running'
import getToken from '../token'
import errorHandler from '../../errorHandler/errorHandler'
import moment from 'moment'
moment.locale('ru')

const findUser = (token) => {
    return User.findOne({
        token: token
    })
}

const createRecord = (user, body, res) => {
    const { distance, time } = body
    if (distance && time) {
        const avSpeed = ((distance /  moment.duration(time).asSeconds()) * 3.6).toFixed(2)
        return Running
            .create({
                distance: distance,
                time: time,
                userId: user._id,
                date: moment(),
                avSpeed: avSpeed
            })
    } else {
        return errorHandler('Record validation failed', res)
    }

}

const getRunList = (user, res) => {
    return Running
        .find({
            userId: user._id
        })
        .then(result => {
            let sortResult = result.sort((a, b) => {
                if (moment(a.date) > moment(b.date)) {
                    return -1
                }
                if (moment(a.date) < moment(b.date)) {
                    return 1
                } else {
                    return 0
                }
            })
            return sortResult
        })
        .catch(error => {
            errorHandler(error, res)
        })
}

const createReport = (list) => {
    if (list.length > 1) {
        let week = [[]]
        let counter = 0
        list.sort((a, b) => {
            if (moment(a.date).week() === moment(b.date).week() && moment(a.date).weekYear() === moment(b.date).weekYear()) {
                return week[counter].length > 0 ?  week[counter].push(a) : week[counter].push(a, b)
            }
            if (moment(a.date).week() > moment(b.date).week() && moment(a.date).weekYear() === moment(b.date).weekYear()) {
                week.push([])
                counter++
                return week[counter].push(a)
            }
            if (moment(a.date).week() < moment(b.date).week() && moment(a.date).weekYear() === moment(b.date).weekYear()) {
                week.push([])
                counter++
                return week[counter].push(a)
            } else {
                week.push([])
                counter++
                return week[counter].push(a)
            }

        })

        let reportList = week.map(itemArr => {
            let result = {
                startWeek: '',
                endWeek: '',
                avTime: 0,
                totalDistance: 0,
                avSpeed: 0
            }
            let count = 1
            itemArr.forEach(item => {
                if (count <= itemArr.length) {
                    const today = moment(item.date)
                    const from_date = today.startOf('week').format('YYYY-MM-DD')
                    const to_date = today.endOf('week').format('YYYY-MM-DD')
                    result.startWeek = from_date
                    result.endWeek = to_date
                    result.avTime += item.time
                    result.totalDistance += item.distance
                    result.avSpeed += item.avSpeed
                    count++
                    return result
                }
            })
            result.avTime = (result.avTime / itemArr.length).toFixed(2)
            result.avSpeed = (result.avSpeed / itemArr.length).toFixed(2)
            return result
        })
        return reportList
    } else {
        return list
    }
}

export default {
    runRecord: async (req, res, callback) => {
        const token = getToken(req.headers)
        if  (token) {
            try {
                const user = await findUser(token)
                const record = await createRecord(user, req.body, res)
                await callback({status: 200, success: true, token: token, data: record})
            } catch (e) {
                errorHandler(e, res)
            }
        } else {
            return errorHandler('Authentication failed. Wrong token.', res)
        }
    },

    runList: async (req, res, callback) => {
        const token = getToken(req.headers)
        if (token) {
            try {
                const user = await findUser(token)
                const runList = await getRunList(user, res)
                await callback({status: 200, success: true, token: token, data: runList})
            } catch (e) {
                return errorHandler(e, res)
            }
        } else {
            return errorHandler('Authentication failed. Wrong token.', res)
        }
    },

    runReport: async (req, res, callback) => {
        const token = getToken(req.headers)
        if (token) {
            try {
                const user = await findUser(token)
                const runList = await getRunList(user, res)
                const report = await createReport(runList)
                await callback({status: 200, success: true, token: token, data: report})
            } catch (e) {
                return errorHandler(e, res)
            }
        } else {
            return errorHandler('Authentication failed. Wrong token.', res)
        }

    }
}