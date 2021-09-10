import express, {response} from "express";
import {DB} from "../../db/DB";
import {LoginValidator} from "../../server/login-validator";
import {UserService} from "../../services/UserService";
import {ChangePasswordDto} from "../authentification/dtos/change-password";
import * as Argon2 from "argon2";
import {NewUserDto} from "./dtos/new-user";
import {SingleUserDto} from "./dtos/single-user";
import bodyParser from "body-parser";
import {authRouter} from "../authentification/authentification.module";
import {PermissionLoginValidator} from "../../server/permission-login-validator";
import {ImportUserDto} from "./dtos/import-user.dto";
import Papa from "papaparse";
import {CsvExportStructureDto, CsvImportStructureDto} from "./dtos/csv-import-structure.dto";
import {GroupService} from "../../services/group-service";
import {use} from "chai";


export const userRouter = express.Router({caseSensitive: false});

userRouter.use(bodyParser.json());
userRouter.use(bodyParser.urlencoded({extended: true}))

const db = new DB();
db.connect().catch(e => console.error(e));

userRouter.get('/users', PermissionLoginValidator([["CENGINE_LISTUSERS"]]), async (req, res, next) => {
    let group = await UserService.getUsers();
    res.status(200).send(group);

});


userRouter.put('/user', PermissionLoginValidator([["CENGINE_MODIFYUSERS"]]), async (req, res, next) => {
    const uReq = <NewUserDto>req.body;
    if (!uReq || !uReq.username || !uReq.password || !uReq.name || !uReq.firstname) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    let result = await UserService.addUser(uReq.username, uReq.password, uReq.firstname, uReq.name);
    if (result.success) {
        res.status(200).send();
        return;
    } else {
        res.status(400).send({err: result.err});
        return
    }

});


userRouter.delete('/user', PermissionLoginValidator([["CENGINE_MODIFYUSERS"]]), async (req, res, next) => {
    const uReq = <SingleUserDto>req.body;
    if (!uReq || !uReq.username) {
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

userRouter.post('/user', PermissionLoginValidator([["CENGINE_LISTUSERS"]]), async (req, res, next) => {
    const uReq = <SingleUserDto>req.body;
    console.log(req.body)
    if (!uReq || !uReq.username) {
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


userRouter.post('/users/changePassword', PermissionLoginValidator([["CENGINE_LOGINABLE"]]), async (req, res, next) => {
    const uReq = <ChangePasswordDto>req.body;
    if (!uReq || !uReq.newPassword || !uReq.oldPassword || !uReq.username) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    let user = await UserService.getUserByLoginName(uReq.username);
    if (!user) {
        res.status(404).send({err: "User not found"});
        return;
    }
    if (await Argon2.verify(user.password, uReq.oldPassword)) {
        await UserService.changeUserPasswort(user.userId, uReq.newPassword);
        res.status(200).send();
    } else {
        res.status(400).send({err: "oldPassword is invalid"})
    }
});

userRouter.post('/users/changePasswordByAdmin', PermissionLoginValidator([["CENGINE_MODIFYUSERS"]]), async (req, res, next) => {
    const uReq = <ChangePasswordDto>req.body;
    if (!uReq || !uReq.newPassword || !uReq.username) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    let user = await UserService.getUserByLoginName(uReq.username);
    if (!user) {
        res.status(404).send({err: "User not found"});
        return;
    }
    await UserService.changeUserPasswort(user.userId, uReq.newPassword);
    res.status(200).send();
});

userRouter.post("/users/import", PermissionLoginValidator([["CENGINE_IMPORTUSERS"]]), async (req, res) => {
    const importPost = <ImportUserDto>req.body;

    const parsedContent = Papa.parse(importPost.fileContent, {header: true, delimiter: ","})

    for (let runner of <CsvImportStructureDto[]>parsedContent.data) {
        if (runner.name && runner.loginName && runner.password && runner.groups && runner.firstname && runner.name != "" && runner.loginName != "" && runner.password != "" && runner.groups != "" && runner.firstname != "") {
            await UserService.addUser(runner.loginName, runner.password, runner.firstname, runner.name)
            let groups = runner.groups.split(";")
            for (let group of groups) {
                await GroupService.addUserToGroup(runner.loginName, group)
            }
        }
    }
    res.status(200).send()

})

userRouter.get("/users/export", PermissionLoginValidator([["CENGINE_EXPORTUSERS"]]), async (req, res) => {

    let users = await UserService.getUsers()
    let userCsvArray: CsvExportStructureDto[] = users.map((user) => {
        console.log(user)
        let groups = ""
        user.groups.forEach((value, index) => {
            groups += value
            if (index < user.groups.length - 1) {
                groups += ";"
            }
        })
        return {
            name: user.name,
            firstname: (<any>user).firstname,
            loginName: user.loginName,
            password: '**********',
            groups: groups,
            lastLogin: user.lastLogin
        }
    })

    let response = Papa.unparse(userCsvArray)
    res.contentType("text/csv").status(200).send(response)

})
