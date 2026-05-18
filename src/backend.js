import session from 'express-session';

export function initSession(secretKey) {
    return session({
        secret: secretKey,
        resave: false,
        saveUninitialized: false,
        cookie:{
            maxAge: 1000 * 60 * 60 * 24
        }
    })
}

export function requireAuth(req, res, next) {
    if (req.session && req.session.userID){
        return next();
    }
    return res.status(401).json({ authenticated: false, Error: 'Unauthenticated' })
}