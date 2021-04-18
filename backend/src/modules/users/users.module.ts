import express from "express";
import {DB} from "../../db/DB";
import {LoginValidator} from "../authentification/login-validator";
import {UserService} from "../../services/UserService";
import {ChangePasswordDto} from "../authentification/dtos/change-password";
import * as Argon2 from "argon2";



export const userRouter = express.Router({caseSensitive:false});

userRouter.use(express.urlencoded({ extended: true }));

const db = new DB();
db.connect().catch(e => console.error(e));

userRouter.get('/users',LoginValidator, async (req, res, next) => {
    let group = await UserService.getUsers();
    res.status(200).send(group);
});


userRouter.put('/users',LoginValidator, async (req, res, next) => {
    let group = await UserService.getUsers();
    res.status(200).send(group);
});


userRouter.post('/users/changePassword',LoginValidator, async (req, res, next) => {
    const uReq = <ChangePasswordDto> req.body;
    if (!uReq||!uReq.newPassword||!uReq.oldPassword||!uReq.username) {
        res.status(400).send({err: "Missing Fields"});
    }
    console.log(uReq)
    let user = await UserService.getUserByLoginName(uReq.username);
    if (!user) {
        res.status(404).send({err:"User not found"});
        return;
    }
    if (await Argon2.verify(user.password, uReq.oldPassword)) {
        await UserService.changeUserPasswort(user.userId,uReq.newPassword);
        res.status(200).send();
    } else {
        res.status(400).send({err:"oldPassword is invalid"})
    }
});


