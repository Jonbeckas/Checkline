import express from "express";
import {DB} from "../../db/DB";
import {LoginValidator} from "../authentification/login-validator";
import {GroupService} from "../../services/group-service";
import {groupsRouter} from "../groups/groups.module";
import {UserService} from "../../services/UserService";



export const userRouter = express.Router({caseSensitive:false});

userRouter.use(express.urlencoded({ extended: true }));

const db = new DB();
db.connect().catch(e => console.error(e));

userRouter.get('/users',LoginValidator, async (req, res, next) => {
    let group = await UserService.getUsers();
    res.status(200).send(group);
});


userRouter.put('/users',LoginValidator, async (req, res, next) => {
    let group = await UserService.get();
    res.status(200).send(group);
});


