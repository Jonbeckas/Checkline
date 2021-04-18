import {DB} from "../db/DB";
import {InvalidMysqlData} from "../exception/invalid-mysql-data";
import {NoUserFoundException} from "../exception/no-user-found.exception";
import {User} from "../model/User";
import {GroupService} from "./group-service";
import * as Argon2 from "argon2";

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
        return <User> result[0];
    }

    static async getUsers():Promise<User[]> {
        const db = new DB();
        await db.connect();
        const result =  <User[]>await db.getObject("users",{});
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
        return userPermission;
    }

    static async changeUserPasswort(userId:string,newPassword:string) {
        const db = new DB();
        await db.connect();
        const hash = await Argon2.hash(newPassword);
        await db.editObject("users",["userId"],{password:hash,userId:userId});
    }
}


