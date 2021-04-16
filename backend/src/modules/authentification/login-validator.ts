import * as Jwt from "jsonwebtoken"
import {CONFIG} from "../../config";

   export const LoginValidator = (req:any, res:any, next:Function) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = Jwt.verify(
                token,
                CONFIG.jwtSecret
            );
            req.userData = decoded;
            next();
        } catch (err) {
            return res.status(401).send({
                err: 'Invalid session'
            });
        }
    }
