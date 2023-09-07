function authenticationMiddlewareInternal() {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            // console.log(req)
            return next()
        }
        res.json({ "msg": false })
    }
}
module.exports = authenticationMiddlewareInternal