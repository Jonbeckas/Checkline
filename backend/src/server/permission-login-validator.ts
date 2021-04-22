import * as Jwt from "jsonwebtoken";
import {CONFIG} from "../config";
import {UserService} from "../services/UserService";

export const PermissionLoginValidator = (permissions:string[][]) => {
    return async (req: any, res: any, next: Function) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded: any = Jwt.verify(
                token,
                CONFIG.jwtSecret
            );
            req.userData = decoded;
            console.log(permissions.concat(["CENGINE_ADMIN"]))
            if (await UserService.hasUserPermissions(decoded.userId, permissions.concat([["CENGINE_ADMIN"]]))) {
                next();
            } else {
                return res.status(401).send({
                    err: 'Invalid Permissions'
                });
            }
        } catch (err) {
            return res.status(401).send({
                err: 'Invalid session'
            });
        }
    }

}
