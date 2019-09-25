const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send({
        status: "error",
        msg: "Access Denied! No token provided"
    });

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded;
        next();
    } catch(ex) {
        res.status(400).send({
            status: "error",
            msg: "Invalid Token!"
        })
    }
}