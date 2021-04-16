import {DB} from "../db/DB";
import {InvalidMysqlData} from "../exception/invalid-mysql-data";
import {NoUserFoundException} from "../exception/no-user-found.exception";
import {User} from "../model/User";
import {Group} from "../model/Group";
import {UserGroup} from "../model/UserGroup";
import {GroupPermission} from "../model/GroupPermission";

export class GroupService {
    static async addGroup(name:string):Promise<Group[]> {
        const db = new DB();
        await db.connect();
        return <Group[]>await db.getObject("groups",{name:name});
    }

    static async getUsersInGroup(groupId:string):Promise<string[]> {
        const db = new DB();
        await db.connect();
        const result =  <UserGroup[]>await db.getObject("user-groups",{groupId:groupId});
        return result.map(obj => obj.userId)
    }

    static async getGroupById(groupId:string):Promise<Group|undefined> {
        const db = new DB();
        await db.connect();
        const result =  <Group[]>await db.getObject("groups",{groupId:groupId});
        if (result.length >1){
            throw new InvalidMysqlData("No unique Group "+groupId+"!");
        } else if (result.length == 0) {
            return undefined;
        } else  {
            return result[0];
        }
    }

    static async getGroupByName(groupname:string):Promise<Group|undefined> {
        const db = new DB();
        await db.connect();
        const result =  <Group[]>await db.getObject("groups",{name:groupname});
        if (result.length >1){
            throw new InvalidMysqlData("No unique Group "+groupname+"!");
        } else if (result.length == 0) {
            return undefined;
        } else  {
            return result[0];
        }
    }

    static async getPermissionsByGroup(groupId:string):Promise<string[]> {
        const db = new DB();
        await db.connect();
        const result =  <GroupPermission[]>await db.getObject("group-permissions",{groupId:groupId});
        return result.map(obj => obj.permission);
    }

    static async getGroups():Promise<Group[]> {
        const db = new DB();
        await db.connect();
        const result =  <Group[]>await db.getObject("groups",{});
        return result;
    }
}
