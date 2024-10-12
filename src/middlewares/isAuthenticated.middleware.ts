
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: jwt.JwtPayload | string;
        }
    }
}

export const isAuthenticated = <RequestHandler>(async (req, res, next) => {
    try{
        let accessToken: string | undefined = req.headers.authorization;
    if (!accessToken) {
        return res.status(401).json({
            "error": "You are not authenticated"
        });
    }
    accessToken = accessToken.split(" ")[1];
    const user: jwt.JwtPayload | string = jwt.verify(accessToken, 'SECRET');
    if (!user) {
        return res.status(401).json({
            "error": "You are not authenticated"
        });
    }

    req.user = user;
    next();
    } catch {
        return res.status(401).json({
            "error": "You are not authenticated"
        });
    }
});