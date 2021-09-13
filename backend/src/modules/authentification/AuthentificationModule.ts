import express from "express";
import {LoginDto} from "./dtos/LoginDto";
import * as Argon2 from "argon2";
import * as Jwt from "jsonwebtoken"
import {UserService} from "../../services/UserService";
import bodyParser from "body-parser";
import {LoginValidator} from "../../server/LoginValidator";
import {User} from "../../model/User";
import {GroupService} from "../../services/GroupService";
import {UserNotFoundError} from "../../exception/UserNotFoundError";
import { CONFIG } from "../../config/Config";

export const authRouter = express.Router();
authRouter.use(bodyParser.json());
authRouter.use(bodyParser.urlencoded({ extended: true }))

authRouter.post('/login', async (req:any, res, next) => {
    const logReq = <LoginDto> req.body;
    const userService: UserService = req.userService;
    const groupService: GroupService = req.groupService;
    if (!logReq||logReq.password == undefined || logReq.username== undefined) {
        res.status(400).send({err: "Missing fields"})
        return;
    }
    try {
        const user = await userService.getUserByUsername(logReq.username);
        if (! await groupService.userHasPermission(user,[["CENGINE_LOGINABLE"],["CENGINE_ADMIN"]])) {
            res.status(401).send({err: "Invalid Permissions"});
            return; 
        }
        if (await userService.verifyPassword(user, logReq.password)) {
            const permissions = await groupService.getPermissionsByUser(user);
            const token = Jwt.sign({username:user.username, userId:user.id,permissions:permissions},CONFIG.jwtSecret,{expiresIn:"7d"});
            await userService.setLastLogin(user,Date.now().toString())
            res.status(200).send({token: token})

        } else {
            res.status(401).send({err: "Unauthorized"})
        }

    } catch (e) {
        console.log(e)
        res.status(401).send({err: "Unauthorized"});
        return;
    }

});


authRouter.get("/isValid",LoginValidator,async (req,res)=>{
    const userService = (<any>req).userService as UserService;
    const groupService = (<any> req).groupService as GroupService;
    try {
        const user = await userService.getUserById((<any>req).userData.userId)
        const permissions = await groupService.getPermissionsByUser(user);
        const token = Jwt.sign({username:user.username, userId:user.id,permissions:permissions},CONFIG.jwtSecret,{expiresIn:"1d"});
        res.status(200).send({token: token})
    } catch (e: unknown) {
        if (e instanceof UserNotFoundError) {
            res.status(404).send({err: "User not found"});
        } else {
            res.status(500).send({err: "Internal Server Error"});
        }
    }
});

