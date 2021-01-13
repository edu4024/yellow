function errorHandler (err, res){
    let result = {}
    let success = false
    let status
    if (typeof err === 'string'){
        status = (err.indexOf('Authentication') === 0)? 401 : 400
        status = (err.indexOf('Authorization') === 0)? 302 : 400
        result.message = err
    } else if (typeof err === 'object') {
        result.message = err._message ? err._message: 'Validation err'

        status = 400
    }
    return res.status(status).send({success, result})
}
export default errorHandler
