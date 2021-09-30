import {Repository} from "typeorm";
import {Group} from "../model/Group";
import {User} from "../model/User";
import {Permission} from "../model/Permission";
import {GroupExistsError} from "../exception/GroupExistsError";
import {GroupNotFoundError} from "../exception/GroupNotFoundError";
import { GroupHasPermissionError } from "../exception/GroupHasPermissionError";
import { GroupHasNotPermissionError } from "../exception/GroupNotHasPermissionError";

export class GroupService {
    constructor(private userRepository: Repository<User>, private groupRepository: Repository<Group>, private permissionReposity: Repository<Permission>) {
    }

    async addGroup(name: string, permissions: string[] = []): Promise<Group> {
        let existUser = await this.groupRepository.findOne({where:{name:name}})

        if (existUser) {
            throw new GroupExistsError();
        }

        let group = new Group();
        group.name = name
        group.permissions = []
        group.users = []
        group = await this.groupRepository.save(group)

        for (let permission of permissions) {
            let permissionObject = new Permission();
            permissionObject.name = permission;
            permissionObject.group = group;
            permissionObject = await this.permissionReposity.save(permissionObject)
            group.permissions.push(permissionObject)
        }

        return await this.groupRepository.save(group)
    }

    /**
     * @throws{GroupNotFound}
     * @param id
     */
    async getGroupById(id:string): Promise<Group> {
        let group = await this.groupRepository.findOne({where:{id:id},relations:["permissions"]});
        if (group) {
            return group;
        } else {
            throw new GroupNotFoundError();
        }
    }

    async userHasPermission(user: User, permission:string[][]): Promise<boolean>{
        let result = false;
        for( let permissionOr of permission) {
            let andFound = 0;
            for (let permissionAnd of permissionOr) {
                for (let group of user.groups) {
                    let realGroup = await this.getGroupById(group.id);
                        let pems = realGroup.permissions.map((pem) => pem.name)
                    if (pems.includes(permissionAnd)) {
                        andFound++;
                    }
                }
            }
            if (andFound == permissionOr.length) {
                result = true;
            }
        }
        return result;
    }

    async getPermissionsByUser(user: User):Promise<string[]> {
        let pems = []
        for (const group of user.groups) {
            let groupObj = await this.getGroupById(group.id)
            for (const permission of groupObj.permissions) {
                pems.push(permission.name)
            }
        }
        return pems
    }


    getUsersInGroup(group:Group): User[] {
        return group.users
    }

    getGroupsByUser(user:User): Group[] {
        return user.groups
    }

    /**
     * @throws{GroupNotFoundError}
     * @param name
     */
    async getGroupByName(name:string): Promise<Group> {
        let group = await this.groupRepository.findOne({where:{name:name},relations:["permissions","users"]})
        if (group) {
            return group
        } else {
            throw new GroupNotFoundError()
        }
    }

    getPermissionsByGroup(group:Group): string[] {
        return group.permissions.map((pem) => pem.name)
    }

    async getGroups() :Promise<Group[]> {
        return await this.groupRepository.find({relations:["permissions","users"]})
    }

    async getGroupsWithPermission(permission: string): Promise<Group[]> {
        let groups = await this.getGroups();
        let all: Group[]= [];

        if (groups) {
            for (let group of groups) {
                for (let pem of group.permissions) {
                    if (pem.name == permission) {
                        all.push(group)
                    }
                }
            }   
        }
        return all;
    }

    async changeGroupName(group:Group, newName:string):Promise<Group> {
        group.name = newName;
        return await this.groupRepository.save(group)
    }

    async addUserToGroup(user:User, group:Group): Promise<void> {
        group.users.push(user)
        user.groups.push(group)
        await this.groupRepository.save(group)
        await this.userRepository.save(user)
    }

    async deleteUserFromGroup(user: User, group:Group): Promise<void> {
        user.groups = user.groups.filter((grp) => grp.id != group.id);
        await this.userRepository.save(user); 
    }

    /**
     * 
     * @throws{GroupHasPermissionError}
     * @param group 
     * @param permission 
     */
    async addPermissionToGroup(group:Group, permission:string): Promise<void> {
        if (await this.hasPermission(group,permission)) {
            throw new GroupHasPermissionError();
        }
        let permissionObject = new Permission();
        permissionObject.name = permission;
        permissionObject.group = group;
        permissionObject = await this.permissionReposity.save(permissionObject)
        group.permissions.push(permissionObject)
        await this.groupRepository.save(group)
    }

    hasPermission(group:Group, permission:string) {
        let isIn = false;
        for (let pem of group.permissions) {
            if (pem.name == permission) {
                isIn = true;
            }
        }

        return isIn;
    }


    /**
     * @throws{GroupNotHasPermissionError}
     * @param group
     */
    async deletePermissionFromGroup(group: Group, permission: string): Promise<void> {
        let permissions: Permission[] = group.permissions.filter((pem) => pem.name == permission)
            this.groupRepository.save(group);
            this.permissionReposity.remove(permissions[0])
    }

    /**
     * @param group 
     */
    async deleteGroup(group: Group): Promise<void> {
        for (let permission of group.permissions) {
            this.permissionReposity.remove(permission)
        }
        this.groupRepository.remove(group);
    }

    /**
     * @param permission 
     */
    async getUsersWithPermission(permission: string): Promise<User[]> {
        let users: User[] = [];
        let groups = await this.getGroupsWithPermission(permission);
        if (groups) {
            for (let group of groups) {
                for (let user of group.users) {
                    if (!users.some((usr) => {usr.id == user.id})) {
                        users.push(user);
                    }
                }
            }
        }
        return users;
    }

}