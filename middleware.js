function authenticationMiddleware() {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    // res.json({ "msg": false })
    // res.status(302).sendFile('./views/login.html', { root: __dirname })
    res.redirect("/");
  };
}
module.exports = authenticationMiddleware;
