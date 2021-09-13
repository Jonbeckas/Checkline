import {UserService} from "../../services/UserService";
import {Runner} from "../../model/Runner";
import { GroupService } from "../../services/GroupService";
import { Group } from "../../model/Group";
import { ArrayUtils } from "../../utils/ArrayUtils";
import { Repository } from "typeorm";

export class RunnerService {
    constructor (private userService: UserService, private groupService: GroupService, private runnerRepository: Repository<Runner>) {}

    async getRunners():Promise<Runner[]> {
        throw new Error("Not implemented")
    }

    /**
     * @throws{RunnerNotFoundError}
     * @param username
     */
    async getRunnerByName(username:string):Promise<Runner> {
        throw new Error("Not implemented")
    }

    /**
     * @throws{RunnerStateNotFoundError}
     * @param username
     * @param state 
     */
    async setRunneState(runner: Runner,state:string):Promise<void> {
        throw new Error("Not implemented")
    }

    /**
     * @throws{RunnerStateNotSetError}
     * @param runner
     */
    async getRunnerState(runner:Runner):Promise<string> {
        throw new Error("Not implemented")
    }

    async addRound(runner: Runner):Promise<void> {
        throw new Error("Not implemented")
    }

    /**
     * Only decrease if round >0
     * @param runner
     */
    async decreaseRound(runner:Runner):Promise<void> {
        throw new Error("Not implemented")
    }
}
