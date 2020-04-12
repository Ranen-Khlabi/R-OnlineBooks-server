const jwt = require("jsonwebtoken");



// Autherization middleware function that is used with all protected route
const contributorAuth = (req, res, next) => {
    // Get the token from the client cookie
    // const token = req.cookies.contributorToken ;
    const token = req.header('x-auth-contributorToken') ;
    // If there's no token in the requster cookie, Unauthorize access
    if (!token) {
        return res.status(401).json({ msg: "Unauthorized: No token provided" });
    }
    // In case a token is provided, verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        // In case of failed verfication
        if (err) {
            return res
                .status(401)
                .json({ msg: "Unauthorized: No token provided" });
        }
        // Case of successfull autherization
        req.name = decoded.name;
        // After autherization continue to the next middlware/route
        next();
    });
};


module.exports = contributorAuth;