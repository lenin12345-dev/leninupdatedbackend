const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    // Extracts and validates the JWT from the request's Authorization header.
    // This header typically contains the JWT in the format Bearer <token>.
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    console.log(token)
    // Uses jsonwebtoken’s verify method to validate the token.
    //  It checks if the token is valid and has been signed with the correct secret (process.env.ACCESS_TOKEN_SECRET).
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
      // If the token is valid, it decodes the token and extracts the user information (username and roles).
      // It then adds this information to the req object (req.user and req.roles),
        (err, decoded) => {
            if (err) return res.sendStatus(403);  // If the token is invalid or verification fails, it sends a 403 Forbidden status code.
            req.user = decoded.UserInfo.username;
            req.userId =  decoded.UserInfo.id
            req.role = decoded.UserInfo.role;
            next();
        }
    );
}

module.exports = verifyJWT