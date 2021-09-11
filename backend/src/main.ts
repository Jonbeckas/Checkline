import {Server} from "./server/server";
import {UserService} from "./services/UserService";
import {CONFIG} from "./config";
import {GroupService} from "./services/group-service";

class Main {
    constructor() {
        this.checkForAdminUser().then((next) => {
            new Server()
        })
    }
    private static random (length: number) {
        return Math.random().toString(16).substr(2, length);
    };

    private async checkForAdminUser(): Promise<void> {
        let group:any = await GroupService.getGroupByName(CONFIG.adminGroup.name);
        if (!group) {
            await GroupService.addGroup(CONFIG.adminGroup.name)
            group = await GroupService.getGroupByName(CONFIG.adminGroup.name)
            console.log("Created new Group "+CONFIG.adminGroup.name)
        }
        if (!await GroupService.hasPermission(group.groupId,"CENGINE_ADMIN")) {
            console.log("Give group "+CONFIG.adminGroup.name+" the permisssion CENGIN_ADMIN")
            await GroupService.addPermissionToGroup(group.groupId,"CENGINE_ADMIN")
        }

        let user = await UserService.getUserWithGroups(CONFIG.admin.username)
        if (user) {
            if (!user.groups.includes(CONFIG.adminGroup.name)) {
                await GroupService.addUserToGroup(CONFIG.admin.username,CONFIG.adminGroup.name)
            }
        } else {
            let password = Main.random(14)
            console.log("Created new admin account")
            console.log("--------------------------------------")
            console.log("New admin password: "+password)
            console.log("--------------------------------------")
            await UserService.addUser(CONFIG.admin.username,password,CONFIG.admin.firstname,CONFIG.admin.name)
            await GroupService.addUserToGroup(CONFIG.admin.username,CONFIG.adminGroup.name)
        }
    }
}

new Main();
