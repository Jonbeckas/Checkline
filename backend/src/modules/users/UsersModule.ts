import express, {response} from "express";
import {UserService} from "../../services/UserService";
import {NewUserDto} from "./dtos/NewUserDto";
import {SingleUserDto} from "./dtos/SingleUserDto";
import bodyParser from "body-parser";
import Papa from "papaparse";
import {CsvExportStructureDto, CsvImportStructureDto} from "./dtos/CsvStructure";
import { PermissionLoginValidator } from "../../server/PermissionLoginValidator";
import { UserExistsError } from "../../exception/UserExistsError";
import { UserNotFoundError } from "../../exception/UserNotFoundError";
import { InternalServerError } from "../../exception/InternalServerError";
import { ChangePasswordDto } from "../authentification/dtos/ChangePasswordDto";
import { ImportUserDto } from "./dtos/ImportUserDto";
import { GroupService } from "../../services/GroupService";
import { GroupNotFoundError } from "../../exception/GroupNotFoundError";


export const userRouter = express.Router({caseSensitive: false});

userRouter.use(bodyParser.json());
userRouter.use(bodyParser.urlencoded({extended: true}))


userRouter.get('/users', PermissionLoginValidator([["CENGINE_LISTUSERS"]]), async (req, res, next) => {
    const userService = (<any>req).userService as UserService;
    let group = await userService.getUsers();
    res.status(200).send(group);

});


userRouter.put('/user', PermissionLoginValidator([["CENGINE_MODIFYUSERS"]]), async (req, res, next) => {
    const userService = (<any>req).userService as UserService;
    const uReq = <NewUserDto>req.body;
    if (!uReq || !uReq.username || !uReq.password || !uReq.name || !uReq.firstname) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    try {
        await userService.addUser(uReq.username, uReq.password, uReq.firstname, uReq.name);
    } catch(e) {
        if (e instanceof UserExistsError) {
            res.status(400).send({err: "UserExists"});
            return
        } else {
            throw new InternalServerError()
        }
    }

});


userRouter.delete('/user', PermissionLoginValidator([["CENGINE_MODIFYUSERS"]]), async (req, res, next) => {
    const userService = (<any>req).userService as UserService;
    const uReq = <SingleUserDto>req.body;
    if (!uReq || !uReq.username) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }

    try {
        let user = await userService.getUserByUsername(uReq.username);
        let result = await userService.deleteUser(user)
        res.status(200).send();
        return;
    } catch(e) {
        if (e instanceof UserNotFoundError) {
            res.status(400).send({err: "UserNotFound"});
            return
        } else {
            throw new InternalServerError()
        }
    }
});

userRouter.post('/user', PermissionLoginValidator([["CENGINE_LISTUSERS"]]), async (req, res, next) => {
    const userService = (<any> req).userService as UserService;
    const uReq = <SingleUserDto>req.body;
    if (!uReq || !uReq.username) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    try {
        let result = userService.getUserByUsername(uReq.username);
        res.status(200).send(result)
    } catch(e) {
        if (e instanceof UserNotFoundError) {
            res.status(400).send({err: "UserNotFound"});
            return
        } else {
            throw new InternalServerError()
        }
    }
});


userRouter.post('/users/changePassword', PermissionLoginValidator([["CENGINE_LOGINABLE"],["CENGINE_MODIFYUSERS"]]), async (req, res, next) => {
    const uReq = <ChangePasswordDto>req.body;
    const userService = (<any>req).userService as UserService;
    if (!uReq || !uReq.newPassword || !uReq.oldPassword || !uReq.username) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }

    try {
        let user = await userService.getUserByUsername(uReq.username);
        if (await userService.verifyPassword(user,uReq.newPassword)) {
            res.status(401).send({err: "Unauthorized"})
        }
        await userService.changePassword(user, uReq.newPassword)
        res.status(200).send()
    } catch (e) {
        if (e instanceof UserNotFoundError) {
            res.send(400).send({err: "UserNotFound"})
        } else {
            throw new InternalServerError()
        }
    }
});

userRouter.post("/users/import", PermissionLoginValidator([["CENGINE_IMPORTUSERS"]]), async (req, res) => {
    const importPost = <ImportUserDto>req.body;
    const userService = (<any> req).userService as UserService;
    const groupService = (<any> req).GroupService as GroupService;

    const parsedContent = Papa.parse(importPost.fileContent, {header: true, delimiter: ","})

    for (let runner of <CsvImportStructureDto[]>parsedContent.data) {
        if (runner.name && runner.username && runner.password && runner.groups && runner.firstname && runner.name != "" && runner.username != "" && runner.password != "" && runner.groups != "" && runner.firstname != "") {
            try {
                let user = await userService.addUser(runner.username,runner.firstname,runner.name, runner.password);
                let groups = runner.groups.split(";")
                for (let group of groups) {
                    let groupObject = await groupService.getGroupByName(group);
                    await groupService.addUserToGroup(user, groupObject);
                }
                res.status(200).send()
            }catch (e){
                if (e instanceof UserExistsError) {
                    res.status(400).send({err: "UserNotFound"})
                } else if (e instanceof GroupNotFoundError) {
                    res.status(400).send({err: "GroupNotFound"})
                } else {
                    throw new InternalServerError()
                }
            }
        } else {
            res.status(401).send({err: "InvalidCsv"})
        }
    }

})

userRouter.get("/users/export", PermissionLoginValidator([["CENGINE_EXPORTUSERS"]]), async (req, res) => {
    const userService = (<any> req).userService as UserService;
    const groupService = (<any> req).groupService as GroupService;

    let users = await userService.getUsers();
    let userCsvArray: CsvExportStructureDto[] = users.map((user) => {
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
            username: user.username,
            password: '**********',
            groups: groups,
            lastLogin: user.lastLogin
        }
    })

    let response = Papa.unparse(userCsvArray)
    res.contentType("text/csv").status(200).send(response)

})
