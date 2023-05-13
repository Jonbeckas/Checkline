import {User} from "../model/User";
import {Repository} from "typeorm";
import {Group} from "../model/Group";
import {UserNotFoundError} from "../exception/UserNotFoundError";
import * as Argon2 from "argon2";
import {use} from "chai";
import {UserExistsError} from "../exception/UserExistsError";
import { SqlLogger } from "../logger/SqlLogger";

export class UserService {

    constructor(private userRepository: Repository<User>,private groupRepository: Repository<Group>) {}

    /**
     * @throws {UserNotFoundError}
     * @param username
     */
    async getUserByUsername(username:string) : Promise<User> {
        let user = await this.userRepository.findOne({where: {username: username},relations:["groups"]})

        if (user) {
            return user
        } else {
            throw new UserNotFoundError()
        }
    }


    async getUsers() : Promise<User[]> {
        return await this.userRepository.find({relations:["groups"]});
    }

    async changePassword(user: User,newPassword:string) {
        user.password = await Argon2.hash(newPassword);
        await this.userRepository.save(user);
    }

    /**
     * @throws{UserNotFoundError}
     * @param username
     * @param firstname
     * @param name
     * @param password
     */
    async addUser(username: string, firstname: string, name: string, password: string, byUserId: string):Promise<User> {
        const user = await this.userRepository.findOne({where:{username:username}})
        if (user) {
            throw new UserExistsError()
        }
        const hash = await Argon2.hash(password);
        let newUser = User.newUser(name,firstname,username,hash);
        SqlLogger.logI(`Added user ${username}`,'user', byUserId)
        return await this.userRepository.save(newUser)
    }

    async deleteUser(user: User, byUserId: string): Promise<void> {
        await this.userRepository.remove(user)
        SqlLogger.logI(`Deleted user ${user.username}`, 'user', byUserId)
    }

    /**
     * @throws{UserNotFoundError}
     * @param id
     */
    async getUserById(id:string): Promise<User> {
        let user = await this.userRepository.findOne({where: {id:id},relations:["groups"]})
        if (user) {
            return user
        } else {
            throw new UserNotFoundError();
        }
    }

    async setLastLogin(user:User,lastLogin: Date): Promise<void> {
        user.lastLogin = lastLogin;
        await this.userRepository.save(user);
    }

    async verifyPassword(user: User,newPassword: string): Promise<boolean> {
        return await Argon2.verify(user.password,newPassword)
    }

}


