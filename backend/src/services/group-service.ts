import {DB} from "../db/DB";
import {InvalidMysqlData} from "../exception/invalid-mysql-data";
import {NoUserFoundException} from "../exception/no-user-found.exception";
import {User} from "../model/User";
import {Group} from "../model/Group";
import {UserGroup} from "../model/UserGroup";
import {GroupPermission} from "../model/GroupPermission";
import {UserWithGroups} from "../modules/users/dtos/group-user";
import {PermissionGroupDto} from "../modules/groups/dtos/permission-group.dto";

export class GroupService {
    static async addGroup(name:string):Promise<Group[]> {
        const db = new DB();
        await db.connect();
        const result = <Group[]>await db.getObject("groups",{name:name});
        await db.close();
        return result;
    }

    static async getUsersInGroup(groupId:string):Promise<string[]> {
        const db = new DB();
        await db.connect();
        const result =  <UserGroup[]>await db.getObject("user-groups",{groupId:groupId});
        await db.close();
        return result.map(obj => obj.userId)
    }


    static async getGroupsByUser(userId:string):Promise<Group[]> {
        const db = new DB();
        await db.connect();
        const result =  <Group[]>await db.getObject("user-groups",<UserGroup>{userId:userId});
        await db.close()
        return result;
    }

    static async getGroupById(groupId:string):Promise<Group|undefined> {
        const db = new DB();
        await db.connect();
        const result =  <Group[]>await db.getObject("groups",{groupId:groupId});
        await db.close();
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
        await db.close();
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
        await db.close();
        return result.map(obj => obj.permission);
    }

    static async getGroups():Promise<PermissionGroupDto[]> {
        const db = new DB();
        await db.connect();
        const result =  <PermissionGroupDto[]>await db.getObject("groups",{});
        for (let index in result) {
            let groups = await db.innerJoin("groups","group-permissions","groupId",{groupId:result[index].groupId})
            let strGroup = groups.map((obj: unknown) => (<any>obj).permission);
            result[index].permissions = strGroup;
        }
        await db.close();
        return result;
    }

    static async getGroupWithPermissions(groupname:string):Promise<PermissionGroupDto|undefined> {
        const db = new DB();
        await db.connect();
        let res = <PermissionGroupDto>await this.getGroupByName(groupname);
        if (!res) return undefined;
        let groups = await db.innerJoin("group-permissions","groups","groupId",{groupId:res.groupId});
        let strGroup = groups.map((obj: unknown) => (<any>obj).permission);
        res.permissions = strGroup;
        await db.close()
        return res;
    }

    static  async getGroupsWithPermission(permission:string) {
        const db = new DB();
        await db.connect();
        let groups = await db.innerJoin("group-permissions","groups","groupId",{permission:permission});
        await db.close()
        return groups;
    }

    static async changeGroupName(groupname:string,newname:string):Promise<boolean> {
        const db = new DB();
        await db.connect();
        let res = await this.getGroupByName(groupname);
        if (!res) return false;
        res.name = newname;
        await db.editObject("groups",["groupId"],res);
        await db.close()
        return true;
    }
}
