import express from "express";
import {DB} from "../../db/DB";
import {LoginValidator} from "../authentification/login-validator";
import {UserService} from "../../services/UserService";
import {ChangePasswordDto} from "../authentification/dtos/change-password";
import * as Argon2 from "argon2";
import {NewUserDto} from "./dtos/new-user";
import {SingleUserDto} from "./dtos/single-user";
import bodyParser from "body-parser";
import {authRouter} from "../authentification/authentification.module";



export const userRouter = express.Router({caseSensitive:false});

userRouter.use(bodyParser.json());
userRouter.use(bodyParser.urlencoded({ extended: true }))

const db = new DB();
db.connect().catch(e => console.error(e));

userRouter.get('/users',LoginValidator, async (req, res, next) => {
    let group = await UserService.getUsers();
    res.status(200).send(group);

});


userRouter.put('/user',LoginValidator, async (req, res, next) => {
    const uReq = <NewUserDto> req.body;
    if (!uReq||!uReq.username||!uReq.password||!uReq.name||!uReq.firstname) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    let result = await UserService.addUser(uReq.username,uReq.password,uReq.firstname,uReq.name);
    if (result.success) {
        res.status(200).send();
        return;
    } else {
        res.status(400).send({err: result.err});
        return
    }

});


userRouter.delete('/user',LoginValidator, async (req, res, next) => {
    const uReq = <SingleUserDto> req.body;
    if (!uReq||!uReq.username) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    let result = await UserService.deleteUser(uReq.username);
    if (result.success) {
        res.status(200).send();
        return;
    } else {
        res.status(400).send({err: result.err});
        return
    }

});

userRouter.post('/user',LoginValidator, async (req, res, next) => {
    const uReq = <SingleUserDto> req.body;
    console.log(req.body)
    if (!uReq||!uReq.username) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    let result = await UserService.getUserWithGroups(uReq.username);
    if (result) {
        res.status(200).send(result);
        return;
    } else {
        res.status(404).send({err: "User not found"});
        return
    }

});


userRouter.post('/users/changePassword',LoginValidator, async (req, res, next) => {
    const uReq = <ChangePasswordDto> req.body;
    if (!uReq||!uReq.newPassword||!uReq.oldPassword||!uReq.username) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
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

userRouter.post('/users/changePasswordByAdmin',LoginValidator, async (req, res, next) => {
    const uReq = <ChangePasswordDto> req.body;
    if (!uReq||!uReq.newPassword||!uReq.username) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    let user = await UserService.getUserByLoginName(uReq.username);
    if (!user) {
        res.status(404).send({err:"User not found"});
        return;
    }
    await UserService.changeUserPasswort(user.userId,uReq.newPassword);
    res.status(200).send();

});