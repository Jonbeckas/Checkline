import {DB} from "../db/DB";
import {InvalidMysqlData} from "../exception/invalid-mysql-data";
import {NoUserFoundException} from "../exception/no-user-found.exception";
import {User} from "../model/User";

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
}


