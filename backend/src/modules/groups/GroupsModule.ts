import express from "express";
import { AddGroupDto } from "./dtos/AddGroupDto";
import { Permission } from "./dtos/permission";
import { UserService } from "../../services/UserService";
import bodyParser from "body-parser";
import { CsvGroupImportExportDto } from "./dtos/CsvGroupImportExport";
import Papa from "papaparse";
import { ImportGroupDto } from "./dtos/ImportGroupDto";
import { PermissionLoginValidator } from "../../server/PermissionLoginValidator";
import { GroupService } from "../../services/GroupService";
import { GroupExistsError } from "../../exception/GroupExistsError";
import { InternalServerError } from "../../exception/InternalServerError";
import { GroupNotFoundError } from "../../exception/GroupNotFoundError";
import { UserGroupDto } from "./dtos/UserGroupDto";
import { UserNotFoundError } from "../../exception/UserNotFoundError";
import { GroupHasPermissionError } from "../../exception/GroupHasPermissionError";


export const groupsRouter = express.Router({ caseSensitive: false });

groupsRouter.use(bodyParser.json());
groupsRouter.use(bodyParser.urlencoded({ extended: true }))

groupsRouter.put('/group', PermissionLoginValidator([["CENGINE_MODIFYGROUPS"]]), async (req, res, next) => {
    const groupService = (<any> res).groupService as GroupService

    const gReq = <AddGroupDto>req.body;
    if (!gReq || !gReq.name) {
        res.status(400).send({ err: "Missing Fields" });
        return;
    }

    try {
        await groupService.addGroup(gReq.name);
        res.status(200).send();
    } catch(e) {
        if (e instanceof GroupExistsError) {
            res.status(400).send({err: "GroupExists"});
        } else {
            throw new InternalServerError();
        }
    }
});

groupsRouter.delete('/group', PermissionLoginValidator([["CENGINE_MODIFYGROUPS"]]), async (req, res, next) => {
    const groupService = (<any> res).groupService as GroupService

    const gReq = <AddGroupDto>req.body;
    if (!gReq || !gReq.name) {
        res.status(400).send({ err: "Missing Fields" });
        return;
    }

    try {
        let group = await groupService.getGroupByName(gReq.name);
        await groupService.deleteGroup(group);
        res.status(200).send();
    } catch(e) {
        if (e instanceof GroupNotFoundError) {
            res.status(400).send({err: "GroupNotFound"})
        } else {
            throw new InternalServerError();
        }
    }
});


groupsRouter.post('/groups/addUserToGroup', PermissionLoginValidator([["CENGINE_MODIFYUSERS"]]), async (req, res, next) => {
    const userService = (<any> req).userService as UserService;
    const groupService = (<any> res).groupService as GroupService

    const gReq = <UserGroupDto>req.body;
    if (!gReq || !gReq.groupname || !gReq.username) {
        res.status(400).send({ err: "Missing Fields" });
        return;
    }

    try {
        let user = await userService.getUserByUsername(gReq.username);
        let group = await groupService.getGroupByName(gReq.groupname);

        await groupService.addUserToGroup(user, group);

        res.status(200).send()

    } catch(e) {
        if (e instanceof UserNotFoundError) {
            res.status(404).send({err: "UserNotFound"});
        } else if (e instanceof GroupNotFoundError) {
            res.status(404).send({err: "GroupNotFound"});
        } else {
            throw new InternalServerError();
        }
    }
});

groupsRouter.post('/groups/removeUserFromGroup', PermissionLoginValidator([["CENGINE_MODIFYUSERS"]]), async (req, res, next) => {
    const userService = (<any> req).userService as UserService;
    const groupService = (<any> res).groupService as GroupService

    const gReq = <UserGroupDto>req.body;
    if (!gReq || !gReq.groupname || !gReq.username) {
        res.status(400).send({ err: "Missing Fields" });
        return;
    }

    try {
        let user = await userService.getUserByUsername(gReq.username);
        let group = await groupService.getGroupByName(gReq.groupname);

        await groupService.addUserToGroup(user, group);

        res.status(200).send();
    } catch(e) {
        if (e instanceof UserNotFoundError) {
            res.status(404).send({err: "UserNotFound"});
        } else if (e instanceof GroupNotFoundError) {
            res.status(404).send({err: "GroupNotFound"});
        } else {
            throw new InternalServerError();
        }
    }
});

groupsRouter.post('/groups/changeName', PermissionLoginValidator([["CENGINE_MODIFYGROUPS"]]), async (req, res, next) => {
    const groupService = (<any> res).groupService as GroupService

    const gReq = req.body;
    if (!gReq || !gReq.groupname || !gReq.newgroupname) {
        res.status(400).send({ err: "Missing Fields" });
        return;
    }

    try {
        let group = await groupService.getGroupByName(gReq.groupname);
        await groupService.changeGroupName(group, gReq.newgroupname);
        res.status(200).send()
    } catch(e) {
        if (e instanceof GroupNotFoundError) {
            res.status(404).send({err: "GroupNotFound"});
        } else {
            throw new InternalServerError();
        }
    }
});

groupsRouter.put('/groups/permission', PermissionLoginValidator([["CENGINE_MODIFYGROUPS"]]), async (req, res, next) => {
    const userService = (<any> req).userService as UserService;
    const groupService = (<any> res).groupService as GroupService

    const gReq = <Permission>req.body;
    if (!gReq || !gReq.groupname || !gReq.permission) {
        res.status(400).send({ err: "Missing Fields" });
        return;
    }

    try {
        let group = await groupService.getGroupByName(gReq.groupname);
        if (gReq.permission == "CENGINE_ADMIN") {
            let user = await userService.getUserById((<any>req).userData.userId);
            if (!await groupService.userHasPermission(user,[["CENGINE_ADMIN"]])) {
                res.status(400).send({ err: "NoAdmin" });
                return;
            }
        }
        await groupService.addPermissionToGroup(group,gReq.permission);
        res.status(200).send()
    } catch(e) {
        if (e instanceof GroupNotFoundError) {
            res.status(404).send({err: "GroupNotFound"});
        } else if (e instanceof GroupHasPermissionError) {
            res.status(400).send({err: "GroupHasPermission"})
        } else {
            throw new InternalServerError();
        }

    }
});

groupsRouter.delete('/groups/permission', PermissionLoginValidator([["CENGINE_MODIFYGROUPS"]]), async (req, res, next) => {
    const userService = (<any> req).userService as UserService;
    const groupService = (<any> res).groupService as GroupService

    const gReq = <Permission>req.body;
    if (!gReq || !gReq.groupname || !gReq.permission) {
        res.status(400).send({ err: "Missing Fields" });
        return;
    }


    try {
        let group = await groupService.getGroupByName(gReq.groupname);
        if (gReq.permission == "CENGINE_ADMIN") {
            let user = await userService.getUserById((<any>req).userData.userId);
            if (!await groupService.userHasPermission(user,[["CENGINE_ADMIN"]])) {
                res.status(400).send({ err: "NoAdmin" });
                return;
            }
        }

        await groupService.deletePermissionFromGroup(group,gReq.permission);
        res.status(200).send();
    } catch(e) {
        if (e instanceof GroupNotFoundError) {
            res.status(404).send({err: "GroupNotFound"});
        } else if (e instanceof GroupHasPermissionError) {
            res.status(400).send({err: "GroupHasPermission"})
        } else {
            throw new InternalServerError();
        }
    }
});

groupsRouter.get('/groups/permissions', PermissionLoginValidator([["CENGINE_MODIFYGROUPS"]]), async (req, res, next) => {
    const groupService = (<any> res).groupService as GroupService

    const gReq = <Permission>req.body;
    if (!gReq || !gReq.groupname) {
        res.status(400).send({ err: "Missing Fields" });
        return;
    }

    try {
        let group = await groupService.getGroupByName(gReq.groupname);
        let permissions = await groupService.getPermissionsByGroup(group);
        res.status(200).send(permissions);
    } catch(e) {
        if (e instanceof GroupNotFoundError) {
            res.status(404).send({err: "GroupNotFound"});
        } else {
            throw new InternalServerError();
        }
    }
});

groupsRouter.get('/groups', PermissionLoginValidator([["CENGINE_LISTGROUPS"]]), async (req, res, next) => {
    const groupService = (<any> res).groupService as GroupService

    let group = await groupService.getGroups()
    res.status(200).send(group);
});

groupsRouter.post('/group', PermissionLoginValidator([["CENGINE_LISTGROUPS"], ["CENGINE_MODIFYGROUPS"]]), async (req, res, next) => {
    const userService = (<any> req).userService as UserService;
    const groupService = (<any> res).groupService as GroupService

    const gReq = req.body;
    if (!gReq || !gReq.groupname) {
        res.status(400).send({ err: "Missing Fields" });
        return;
    }
    try {
        let group = groupService.getGroupByName(gReq.groupname)
        res.status(200).send(group);
    } catch(e) {
        if (e instanceof GroupNotFoundError) {
            res.status(404).send({err: "GroupNotFound"});
        } else {
            throw new InternalServerError();
        }
    }
});

groupsRouter.get('/groups/export', PermissionLoginValidator([["CENGINE_EXPORTGROUPS"]]), async (req, res, next) => {
    const groupService = (<any> res).groupService as GroupService

    let groups = await groupService.getGroups();

    let csvGroups: CsvGroupImportExportDto[] = groups.map((group) => {
        let permissions = ""

        group.permissions.forEach((value, index) => {
            permissions += value
            if (index < group.permissions.length - 1) {
                permissions += ";"
            }
        });

        return { name: group.name, permissions: permissions }
    })

    let result = Papa.unparse(csvGroups);
    res.contentType("text/csv").status(200).send(result)
});

groupsRouter.post('/groups/import', PermissionLoginValidator([["CENGINE_IMPORTGROUPS"]]), async (req, res, next) => {
    const userService = (<any> req).userService as UserService;
    const groupService = (<any> res).groupService as GroupService

    const importPost = <ImportGroupDto>req.body;

    const parsedContent = Papa.parse(importPost.fileContent, { header: true, delimiter: "," })

    for (let group of <CsvGroupImportExportDto[]>parsedContent.data) {
        if (group.name != "" && group.permissions != "") {
            try {
                let permissions = group.permissions.split(";");
                let groupObj = await groupService.addGroup(group.name);

                for (let pem of permissions) {
                    if (await groupService.hasPermission(groupObj,pem)) {
                        await groupService.addPermissionToGroup(groupObj,pem);
                    }
                }

                await groupService.addGroup(group.name, permissions)
            } catch(e) {
                if(e instanceof GroupExistsError) {
                    res.status(400).send({err:"GroupExists"})
                } else {
                    throw new InternalServerError()
                }
            }
        }
    }
    res.status(200).send()
});
