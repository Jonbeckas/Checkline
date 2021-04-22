import express from "express";
import {LoginValidator} from "../../server/login-validator";
import {AddGroupDto} from "./dtos/add-group";
import {DB} from "../../db/DB";
import {Group} from "../../model/Group";
import * as Uuid from "uuid"
import {InvalidMysqlData} from "../../exception/invalid-mysql-data";
import {GroupService} from "../../services/group-service";
import {UserGroupDto} from "./dtos/user-group";
import {UserGroup} from "../../model/UserGroup";
import {Permission} from "./dtos/permission";
import {GroupPermission} from "../../model/GroupPermission";
import {UserService} from "../../services/UserService";
import bodyParser from "body-parser";
import {authRouter} from "../authentification/authentification.module";
import {PermissionLoginValidator} from "../../server/permission-login-validator";


export const groupsRouter = express.Router({caseSensitive:false});

authRouter.use(bodyParser.json());
authRouter.use(bodyParser.urlencoded({ extended: true }))

const db = new DB();
db.connect().catch(e => console.error(e));

groupsRouter.put('/group',PermissionLoginValidator([["CENGINE_MODIFYGROUPS"]]), async (req, res, next) => {
    const gReq = <AddGroupDto> req.body;
    if (!gReq || !gReq.name) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }

    let sql = await db.getObject("groups",{name:gReq.name});
    if(sql.length >0) {
        res.status(400).send({err: "Group exists"});
    } else {
        await db.insertObject("groups",<Group>{groupId:Uuid.v4(),name:gReq.name});
        res.status(200).send();
    }
});

groupsRouter.delete('/group',PermissionLoginValidator([["CENGINE_MODIFYGROUPS"]]), async (req, res, next) => {
    const gReq = <AddGroupDto> req.body;
    if (!gReq || !gReq.name) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }

    let sql = await db.getObject("groups",{name:gReq.name});
    if(sql.length ==0) {
        res.status(400).send({err: "Group does not exist"});
    } else if(sql.length > 1) {
        res.status(500).send({err: "Internal server error"});
        throw new InvalidMysqlData("Doubled group with name "+gReq.name)
    } else {
        await db.deleteObject("groups",<Group>sql[0]);
        res.status(200).send();
    }
});


groupsRouter.post('/groups/addUserToGroup',PermissionLoginValidator([["CENGINE_MODIFYUSERS"]]), async (req, res, next) => {
    const gReq = <UserGroupDto> req.body;
    if (!gReq || !gReq.groupname || !gReq.username ) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    let group = await GroupService.getGroupByName(gReq.groupname);
    let user = await UserService.getUserByLoginName(gReq.username);
    if (!group) {
        res.status(404).send({err: "Group does not exists"});
        return;
    }

    if (!user) {
        res.status(404).send({err: "User does not exists"});
        return;
    }
    let sql = await GroupService.getUsersInGroup(group.groupId);
    if (sql.includes(user.userId)) {
        res.status(400).send({err: "User is already in group"});
    } else {
        await db.insertObject("user-groups",<UserGroup>{userId:user.userId, groupId:group.groupId});
        res.status(200).send()
    }
});

groupsRouter.post('/groups/removeUserFromGroup',PermissionLoginValidator([["CENGINE_MODIFYUSERS"]]), async (req, res, next) => {
    const gReq = <UserGroupDto> req.body;
    if (!gReq || !gReq.groupname || !gReq.username ) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    let group = await GroupService.getGroupByName(gReq.groupname);
    let user = await UserService.getUserByLoginName(gReq.username);
    if (!group) {
        res.status(404).send({err: "Group does not exists"});
        return;
    }

    if (!user) {
        res.status(404).send({err: "User does not exists"});
        return;
    }
    let sql = await GroupService.getUsersInGroup(group.groupId);
    if (!sql.includes(user.userId)) {
        res.status(404).send({err: "User is not in group"});
    } else {
        await db.deleteObject("user-groups",<UserGroup>{userId:user.userId, groupId:group.groupId});
        res.status(200).send()
    }
});

groupsRouter.post('/groups/changeName',PermissionLoginValidator([["CENGINE_MODIFYGROUPS"]]), async (req, res, next) => {
    const gReq = req.body;
    if (!gReq || !gReq.groupname || !gReq.newgroupname ) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    let group = await GroupService.changeGroupName(gReq.groupname,gReq.newgroupname);
    if (group) {
        res.status(200).send();
    } else {
        res.status(404).send({err: "Group not found"});
    }

});

groupsRouter.put('/groups/permission',PermissionLoginValidator([["CENGINE_MODIFYGROUPS"]]), async (req, res, next) => {
    const gReq = <Permission> req.body;
    if (!gReq || !gReq.groupname || !gReq.permission ) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    let group = await GroupService.getGroupByName(gReq.groupname)
    if (!group) {
        res.status(404).send({err: "Group does not exists"});
        return;
    }
    let permissions = await GroupService.getPermissionsByGroup(group.groupId);


    if (permissions.includes(gReq.permission)) {
        res.status(400).send({err: "The group already has the permission"});
    } else {
        await db.insertObject("group-permissions",<GroupPermission>{groupId:group.groupId,permission:gReq.permission});
        res.status(200).send();
    }
});

groupsRouter.delete('/groups/permission',PermissionLoginValidator([["CENGINE_MODIFYGROUPS"]]), async (req, res, next) => {
    const gReq = <Permission> req.body;
    console.log(gReq)
    if (!gReq || !gReq.groupname || !gReq.permission ) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    let group = await GroupService.getGroupByName(gReq.groupname);
    if (!group) {
        res.status(404).send({err: "Group does not exists"});
        return;
    }
    let permissions = await GroupService.getPermissionsByGroup(group.groupId);

    if (!permissions.includes(gReq.permission)) {
        res.status(400).send({err: "The group does not have the permission"});
    } else {
        await db.deleteObject("group-permissions",<GroupPermission>{groupId:group.groupId,permission:gReq.permission});
        res.status(200).send();
    }
});

groupsRouter.get('/groups/permissions',PermissionLoginValidator([["CENGINE_MODIFYGROUPS"]]), async (req, res, next) => {
    const gReq = <Permission>req.body;
    if (!gReq || !gReq.groupname) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    let group = await GroupService.getGroupByName(gReq.groupname);
    if (!group) {
        res.status(404).send({err: "Group does not exists"});
        return;
    }
    let permissions = await GroupService.getPermissionsByGroup(group.groupId);

    await db.deleteObject("group-permissions", <GroupPermission>{groupId: group.groupId, permission: gReq.permission});
    res.status(200).send(permissions);
});

groupsRouter.get('/groups',PermissionLoginValidator([["CENGINE_MODIFYGROUPS"]]), async (req, res, next) => {
    let group = await GroupService.getGroups();
    res.status(200).send(group);
});

groupsRouter.post('/group', async (req, res, next) => {
    const gReq = req.body;
    if (!gReq || !gReq.groupname) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    let group = await GroupService.getGroupWithPermissions(gReq.groupname);
    if (group) {
        console.log(group)
        res.status(200).send(group);
    } else {
        res.status(404).send({err:"Group not found"});
    }
});



