exports.authenticated = (req , res , next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/404")
}

exports.access_denied = (req , res , next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/404")
    }
    return next()
}