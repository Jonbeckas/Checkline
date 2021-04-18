import express from "express";
import {DB} from "../../db/DB";
import {LoginDto} from "./dtos/loginDto";
import {NoUserFoundException} from "../../exception/no-user-found.exception";
import * as Argon2 from "argon2";
import * as Jwt from "jsonwebtoken"
import {CONFIG} from "../../config";
import {UserService} from "../../services/UserService";
import bodyParser from "body-parser";
import {LoginValidator} from "./login-validator";

export const authRouter = express.Router();
authRouter.use(bodyParser.json());
authRouter.use(bodyParser.urlencoded({ extended: true }))

authRouter.post('/login', async (req, res, next) => {
    const db =  await new DB();
    await db.connect()
    const logReq = <LoginDto> req.body;
    console.log(req.body);
    if (!logReq||logReq.password == undefined || logReq.username== undefined) {
        res.status(400).send({err: "Missing fields"})
        return;
    }
    const user = await UserService.getUserByLoginName(logReq.username);
    if (!user) {
        res.status(401).send({err: "Unauthorized"});
        return;
    }
    if (await Argon2.verify(user.password, logReq.password)) {
        const permissions = await UserService.getUserPermissions(user.userId);
        const token = Jwt.sign({username:user.loginName, userId:user.userId,permissions:permissions},CONFIG.jwtSecret,{expiresIn:"7d"});
        const db = new DB();
        await db.connect();
        await db.editObject("users",["userId"],{userId:user.userId,lastLogin:Date.now()})
        res.status(200).send({token: token})

    } else {
        res.status(401).send({err: "Unauthorized"})
    }

});


authRouter.get("/isValid",LoginValidator, (req,res)=>{
    res.status(200).send();
});

