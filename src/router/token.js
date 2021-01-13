function getToken (headers) {
    if (headers && headers.auth) {
        let parted = headers.auth
        return parted
    } else {
        return null
    }
}

export default getToken