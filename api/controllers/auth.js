const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Secret key for JWT
const JWT_SECRET = process.env.JWT;

if (!JWT_SECRET) {
    throw new Error('JWT secret is not configured');
}

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}
module.exports = authenticateToken;