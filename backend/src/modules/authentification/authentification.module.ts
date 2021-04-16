import express from "express";
import {DB} from "../../db/DB";
import {LoginDto} from "./dtos/loginDto";
import {NoUserFoundException} from "../../exception/no-user-found.exception";
import * as Argon2 from "argon2";
import * as Jwt from "jsonwebtoken"
import {CONFIG} from "../../config";
import {UserService} from "../../services/UserService";

export const authRouter = express.Router();

authRouter.use(express.urlencoded({ extended: true }));

authRouter.post('/login', async (req, res, next) => {
    const db =  await new DB();
    await db.connect()
    const logReq = <LoginDto> req.body;
    if (!logReq||logReq.password == undefined || logReq.username== undefined) {
        res.status(400).send({err: "Missing fields"})
        return;
    }
    try {
        const user = await UserService.getUserByLoginNameExceptional(logReq.username);
        if (await Argon2.verify(user.password, logReq.password)) {
            const token = Jwt.sign({username:user.name, userId:user.userId},CONFIG.jwtSecret,{expiresIn:"7d"});
            const db = new DB();
            await db.connect();
            await db.editObject("users",["userId"],{userId:user.userId,lastLogin:Date.now()})
            res.status(200).send({token: token})

        } else {
            res.status(401).send({err: "Unauthorized"})
        }
    } catch (e:any) {
        if (e instanceof NoUserFoundException) {
            res.status(401).send({err: "Unauthorized"})
        } else{
            res.status(500).send({err: "FU"})
            throw e;
        }
    }
});

