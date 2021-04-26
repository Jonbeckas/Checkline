import {DB} from "../db/DB";
import {InvalidMysqlData} from "../exception/invalid-mysql-data";
import {NoUserFoundException} from "../exception/no-user-found.exception";
import {User} from "../model/User";
import {GroupService} from "./group-service";
import * as Argon2 from "argon2";
import  * as Uuid from "uuid";
import {UserWithGroups} from "../modules/users/dtos/group-user";
import {Group} from "../model/Group";
import {UserGroup} from "../model/UserGroup";
import {Permission} from "../modules/groups/dtos/permission";
import {GroupPermission} from "../model/GroupPermission";

export class UserService {

    static async getUserByLoginNameExceptional(name:string):Promise<User> {
        const db = new DB();
        await db.connect();
        const result = await db.getObject("users",{loginName:name});
        if (result.length >1){
            throw new InvalidMysqlData("No unique username "+name+"!");
        } else if (result.length ==0) {
            throw new NoUserFoundException();
        }
        await db.close();
        return <User> result[0];
    }

    static async getUserByLoginName(name:string):Promise<User|undefined> {
        const db = new DB();
        await db.connect();
        const result = await db.getObject("users",{loginName:name});
        if (result.length >1){
            throw new InvalidMysqlData("No unique username "+name+"!");
        } else if (result.length ==0) {
            return undefined;
        }
        await db.close();
        return <User> result[0];
    }

    static async getUserById(userId:string):Promise<User|undefined> {
        const db = new DB();
        await db.connect();
        const result = await db.getObject("users",{userId:userId});
        if (result.length >1){
            throw new InvalidMysqlData("No unique userId "+userId+"!");
        } else if (result.length ==0) {
            return undefined;
        }
        await db.close();
        return <User> result[0];
    }

    static async getUsers():Promise<UserWithGroups[]> {
        const db = new DB();
        await db.connect();
        const result =  <UserWithGroups[]>await db.getObject("users",{});
        for (let index in result) {
            let groups = await db.innerJoin("user-groups","groups","groupId",{userId:result[index].userId})
            let strGroup = groups.map((obj: unknown) => (<any>obj).name);
            result[index].groups = strGroup;
        }
        await db.close();
        return result;
    }

    static async getUserWithGroups(username:string):Promise<UserWithGroups> {
        const db = new DB();
        await db.connect();
        const result =  <UserWithGroups>await this.getUserByLoginName(username);
        let groups = await db.innerJoin("user-groups","groups","groupId",{userId:result.userId});
        let strGroup = groups.map((obj: unknown) => (<any>obj).name);
        result.groups = strGroup;
        await db.close()
        return result;
    }

    static async getUserWithGroupsById(username:string):Promise<UserWithGroups> {
        const db = new DB();
        await db.connect();
        const result =  <UserWithGroups>await this.getUserWithGroups(username);
        let groups = await db.innerJoin("user-groups","groups","groupId",{userId:result.userId});
        let strGroup = groups.map((obj: unknown) => (<any>obj).name);
        result.groups = strGroup;
        await db.close()
        return result;
    }



    static async getUserPermissions(userId:string):Promise<string[]> {
        const db = new DB();
        await db.connect();
        const groups = await GroupService.getGroupsByUser(userId);
        if (!groups) return [];
        let userPermission: string[] = [];
        for (let group of groups) {
            const permissions = await GroupService.getPermissionsByGroup(group.groupId);
            for (const permission of permissions) {
                if (!userPermission.includes(permission)) {
                    userPermission.push(permission);
                }
            }
        }
        await db.close();
        return userPermission;
    }

    static async changeUserPasswort(userId:string,newPassword:string) {
        const db = new DB();
        await db.connect();
        const hash = await Argon2.hash(newPassword);
        await db.editObject("users",["userId"],{password:hash,userId:userId});
        await db.close();
    }

    static async addUser(username:string,password:string, firstname:string,name:string):Promise<{ success:boolean,err:string }> {
        const user = await this.getUserByLoginName(username);
        if (user) {
            return {success:false,err: "Username exists"};
        } else {
            const db = new DB();
            await db.connect();
            const hash = await Argon2.hash(password);
            const id = Uuid.v4();
            await db.insertObject("users",<User>{userId:id,loginName:username,firstName:firstname,name:name,password:hash})
            await db.close();
            return {success:true,err: ""};
        }
    }

    static async deleteUser(username:string):Promise<{ success:boolean,err:string }> {
        const user = await this.getUserByLoginName(username);
        if (!user) {
            return {success:false,err: "Username does not exists"};
        } else {
            const db = new DB();
            await db.connect();
            await db.deleteObject("users",{userId:user.userId})
            await db.close();
            return {success:true,err: ""};
        }
    }

    static async hasUserPermissions(userId:string,permissions:string[][]):Promise<boolean> {
        const db = new DB();
        await db.connect();
        let groups = await GroupService.getGroupsByUser(userId)
        if (!groups) return false;
        let perms = <GroupPermission[]> await db.innerJoin("groups","group-permissions","groupId",{})
        let pemStr = perms.filter(obj => groups.map(obj2 => obj2.groupId).includes(obj.groupId)).map(obj3 => obj3.permission);
        let bool:boolean = false;
        for (let orPem of permissions) {
            if (!bool) {
                let founds = 0;
                for (let andPem of orPem) {
                    if (pemStr.includes(andPem)) founds++;
                }
                if (founds == orPem.length) bool = true;
            }
        }
        await db.close();
        return bool;
    }
}


