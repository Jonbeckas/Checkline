import * as Jwt from "jsonwebtoken";
import {UserService} from "../services/UserService";
import {GroupService} from "../services/GroupService";
import { CONFIG } from "../config/Config";

export const PermissionLoginValidator = (permissions:string[][]) => {
    return async (req: any, res: any, next: Function) => {
        try {
            const userService = req.userService as UserService;
            const groupService = req.groupService as GroupService;
            const token = req.headers.authorization.split(' ')[1];
            const decoded: any = Jwt.verify(
                token,
                CONFIG.jwtSecret
            );
            req.userData = decoded;
            let user = await userService.getUserById(decoded.userId)
            if (await  groupService.userHasPermission(user, permissions.concat([["CENGINE_ADMIN"]]))) {
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
