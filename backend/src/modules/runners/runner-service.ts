import { DB } from "../../db/DB";
import {GroupService} from "../../services/group-service";
import {UserService} from "../../services/UserService";
import {ArrayUtils} from "../../utils/array-utils";
import {CONFIG} from "../../config";
import {Runner} from "../../model/Runner";

export class RunnerService {
    static async getRunners() {
        const db = new DB();
        await db.connect();
        let runnerGroups: any[] = await GroupService.getGroupsWithPermission("RUNNER_RUN");
        let runnerGroupsName = runnerGroups.map(obj => obj.name);
        let users = await UserService.getUsers();
        let runnersIds:string[] = [];
        if (runnersIds)
        for (let user of users) {
            if (ArrayUtils.getCommonElements(user.groups,runnerGroupsName).length > 0) {
                runnersIds.push(user.loginName)
            }
        }
        if (runnersIds.length == 0) {
            await db.close();
            return [];
        }
        let sqlIf = "WHERE ";
        for (let index in runnersIds) {
            sqlIf += `users.loginName=${await db.escapeValue(runnersIds[index])}`
            // @ts-ignore
            if (index != (runnersIds.length -1)) {
                sqlIf += " OR ";
            }
        }
        let result = db.customQuery("SELECT loginName,state,`lastStateChange`,timestamp, round FROM `users` LEFT JOIN `runners` ON users.userId = runners.userId "+sqlIf+";");
        await db.close();
        return result;
    }

    static async getRunnerByName(userId:string) {
        const db = new DB();
        await db.connect();
        let runnerGroups: any[] = await GroupService.getGroupsWithPermission("RUNNER_RUN");
        let runnerGroupsName = runnerGroups.map(obj => obj.name);
        let user = await UserService.getUserWithGroupsById(userId);
        let runnersIds:string[] = [];
        if (ArrayUtils.getCommonElements(user.groups,runnerGroupsName).length > 0) {
            runnersIds.push(user.loginName)
        }
        if (runnersIds.length == 0) {
            await db.close();
            return [];
        }
        let sqlIf = "WHERE ";
        for (let index in runnersIds) {
            sqlIf += `users.loginName=${await db.escapeValue(runnersIds[index])}`
        }
        let result = db.customQuery("SELECT loginName,state,`check-in`,`check-out`,timestamp, round FROM `users` LEFT JOIN `runners` ON users.userId = runners.userId "+sqlIf+";");
        await db.close();
        return result;
    }

    static async setRunneState(username:string,state:string):Promise<{ success:boolean,err:string }> {
        let db = new DB();
        await db.connect();
        if (!CONFIG.runners.states.includes(state)) {
            await db.close();
            return {success:false,err:"State not found"};
        }
        let user = await UserService.getUserByLoginName(username)
        if (!user) {
            await db.close();
            return {success:false,err:"User not found"};
        }
        let timestamp = Math.round((new Date()).getTime() / 1000);
        let runner = await db.getObject("runners",{userId:user.userId})
        if (runner.length >0) {
            await db.editObject("runners",["userId"],{state:state,lastStateChange:timestamp,userId:user.userId})
        } else {
            await db.insertObject("runners",{state:state,lastStateChange:timestamp,userId:user.userId})
        }
        return {success:true,err:""};
    }

    static async addRound(username:string):Promise<{ success:boolean,err:string }> {
        let db = new DB();
        await db.connect();
        let user = await UserService.getUserByLoginName(username)
        if (!user) {
            await db.close();
            return {success:false,err:"User not found"};
        }
        let timestamp = Math.round((new Date()).getTime() / 1000);
        let runner = <Runner[]>await db.getObject("runners",{userId:user.userId})
        if (runner.length >0 && runner[0].state != undefined) {
            if (runner[0].round == undefined) {
                await db.editObject("runners",["userId"],{timestamp:timestamp,round:1,userId:user.userId})
            } else {
                await db.editObject("runners",["userId"],{timestamp:timestamp,round:runner[0].round+1,userId:user.userId});
            }
            return {success:true,err:""};
        } else {
            return {success:false,err:"User has no defined state"};
        }

    }

    static async decreaseRound(username:string):Promise<{ success:boolean,err:string }> {
        let db = new DB();
        await db.connect();
        let user = await UserService.getUserByLoginName(username)
        if (!user) {
            await db.close();
            return {success: false, err: "User not found"};
        }
        let timestamp = Math.round((new Date()).getTime() / 1000);
        let runner = <Runner[]>await db.getObject("runners", {userId: user.userId})
        if (runner.length > 0 && runner[0].state != undefined) {
            if (runner[0].round == undefined) {
                return {success: false, err: "User has no round"};
            } else if (runner[0].round == 0) {
                return {success: false, err: "User has no round"};
            } else {
                await db.editObject("runners", ["userId"], {
                    timestamp: timestamp,
                    round: runner[0].round - 1,
                    userId: user.userId
                });
                return {success:true,err:""}
            }
        } else {
            return {success:false,err:"User has no defined state"};
        }

    }


}
