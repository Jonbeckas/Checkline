import {Database} from "./db/Database";
import {UserService} from "./services/UserService";
import {Connection} from "typeorm";
import {User} from "./model/User";
import {Group} from "./model/Group";
import {GroupService} from "./services/GroupService";
import {Permission} from "./model/Permission";
import {Server} from "./server/server";
import { CONFIG } from "./config/Config";


class Main {
    constructor() {
        this.initDb().then((connection) => {
            let userRepository = connection.getRepository(User)
            let groupRepository = connection.getRepository(Group)
            let permissionRepository = connection.getRepository(Permission)
            let userService = new UserService(userRepository,groupRepository);
            let groupService = new GroupService(userRepository,groupRepository,permissionRepository)
            this.testForAdmin(userService,groupService).then((then) => {
                new Server(userService,groupService,connection)
            })
        })
    }

    private static random (length: number) {
        return Math.random().toString(16).substr(2, length);
    };

    async testForAdmin(userService: UserService, groupService:GroupService) {
        let group;
        try {
            group = await groupService.getGroupByName(CONFIG.adminGroup.name)
            if (!groupService.hasPermission(group, "CENGINE_ADMIN")) {
                console.log("Give group " + CONFIG.adminGroup.name + " the permission CENGIN_ADMIN")
                await groupService.addPermissionToGroup(group, "CENGINE_ADMIN")
            }
        }
         catch (e) {
            group = await groupService.addGroup(CONFIG.adminGroup.name,["CENGINE_ADMIN"])
            console.log("Created new Group "+CONFIG.adminGroup.name)
        }

        try {
            let user = await userService.getUserByUsername(CONFIG.admin.username)
            if (!user.groups.some((group) => group.name == CONFIG.adminGroup.name)) {
                await groupService.addUserToGroup(user, group)
            }
        } catch (e) {
            let password = Main.random(14)
            console.log("Created new admin account")
            console.log("--------------------------------------")
            console.log("New admin password: "+password)
            console.log("--------------------------------------")
            let user = await userService.addUser(CONFIG.admin.username,CONFIG.admin.firstname,CONFIG.admin.name, password)
            await groupService.addUserToGroup(user, group)
        }
    }

    async initDb(): Promise<Connection> {
        let db = new Database();
        db.loadFromConfig()
        await db.connect();
        return db.getConnection();
    }
}

new Main();
