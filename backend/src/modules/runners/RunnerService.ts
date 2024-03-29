﻿import {UserService} from "../../services/UserService";
import {Runner} from "../../model/Runner";
import { GroupService } from "../../services/GroupService";
import { Repository } from "typeorm";
import { RunnerNotFoundError } from "../../exception/RunnerNotFoundError";
import { CONFIG } from "../../config/Config";
import { RunnerStateNotFoundError } from "../../exception/RunnerStateNotFound";
import { UserNotFoundError } from "../../exception/UserNotFoundError";
import { RunnerStateNotSetError } from "../../exception/RunnerStateNotSetError";
import { RunnerDto } from "./dtos/RunnerDto";
import { SqlLogger } from "../../logger/SqlLogger";

export class RunnerService {
    constructor (private userService: UserService, private groupService: GroupService, private runnerRepository: Repository<Runner>) {}

    async getRunners():Promise<RunnerDto[]> {
        let runners:RunnerDto[] = [];
        let potentialRunners = await this.groupService.getUsersWithPermission("RUNNER_RUN");
        for (let potentialRunner of potentialRunners) {
            let runner = await this.runnerRepository.findOne({where:{id:potentialRunner.id}});
            if (runner) {
                let runnerDto = runner as RunnerDto;
                runnerDto.username = potentialRunner.username;
                runners.push(runnerDto);
            } else {
                let runnerObject = Runner.newRunner(potentialRunner.id) as RunnerDto;
                runnerObject.username = potentialRunner.username;
                runners.push(runnerObject)
            }
        }
        return runners;
    }

    /**
     * @throws{RunnerNotFoundError}
     * @param id
     */
    async getRunnerById(id:string):Promise<RunnerDto> {
        let runner = await this.runnerRepository.findOne({where:{id:id}});
        let user = await this.userService.getUserById(id);
        if (runner) {
            let runnerDto = runner as RunnerDto;
            runnerDto.username = user.username;
            return runnerDto;
        } else {
            throw new RunnerNotFoundError;
        }
    }

    /**
     * @throws{RunnerNotFoundError}
     * @param id
     * @returns 
     */
    async getOrTemporaryGenerateRunnerById(id: string):Promise<RunnerDto> {
        try {
            let runner = await this.getRunnerById(id);
            return runner;
        } catch(e) {
            if (e instanceof RunnerNotFoundError) {
                try {
                    let user = await this.userService.getUserById(id);
                    let runner = Runner.newRunner(id) as RunnerDto;
                    runner.username = user.username;
                    return runner;
                } catch(f) {
                    if (f instanceof UserNotFoundError) {
                        throw new RunnerNotFoundError();
                    } else {
                        throw f;
                    }
                }
            } else {
                throw e;
            }
        }
    }

    /**
     * @throws{RunnerStateNotFoundError}
     * @param username
     * @param state 
     */
    async setRunneState(runner: Runner,state:string, userId: string):Promise<void> {
        if (CONFIG.runners.states.includes(state)) {
            runner.state = state;
    runner.lastStateChange = new Date();
            this.runnerRepository.save(runner);
            SqlLogger.logI(`Runner ${runner.id} state change to ${state}`,"runner",userId)
        } else {
            throw new RunnerStateNotFoundError();
        }
    }

    /**
     * @throws{RunnerStateNotSetError}
     * @param runner
     */
    async getRunnerState(runner:Runner):Promise<string> {
        if (runner.state) {
            return runner.state;
        } else {
            throw new RunnerStateNotSetError;
        }
    }

    async addRound(runner: Runner, userId: string):Promise<void> {
        if (await this.getRunnerState(runner)) {
            runner.round += 1;
            this.runnerRepository.save(runner);
            SqlLogger.logI(`Runner ${runner.id} add round, new value ${runner.round}`,"runner",userId)
        }
    }

    /**
     * Only decrease if round > 0
     * @param runner
     */
    async decreaseRound(runner:Runner, userId: string):Promise<void> {
        if (await this.getRunnerState(runner)) {
            if (runner.round > 0) {
                runner.round -= 1;
                this.runnerRepository.save(runner);
            SqlLogger.logI(`Runner ${runner.id} descrease round, new value ${runner.round}`,"runner",userId)
            }
        }

    }

    /* 
     * Set timestamp to current time
     */
    async changeTimestampToNow(runner:Runner) {
        runner.timestamp = new Date();
        this.runnerRepository.save(runner);
    }

    /**
     * Set round
     * @param round
     */
    async setStation(runner:Runner,station: string, userId: string) {
        if (CONFIG.runners.stations.includes(station)) {
            runner.station = station;
            this.runnerRepository.save(runner);
            SqlLogger.logI(`Runner ${runner.id} station change to ${station}`,"runner",userId)
        } else {

        }
    }

    /**
     * Get Station 
     * @throws{StationNotFoundError}
     */
    async getStation(runner:Runner): Promise<string|null> {
        return runner.station;
    }

    /**
     * Get conspicous users
     */
    async getConspicousUsers(): Promise<Runner[]> {
        let date = new Date();
        return (await this.runnerRepository.createQueryBuilder("runner")
        .where(`(runner.timestamp + INTERVAL ${CONFIG.runners.conspicousAfterSeconds} SECOND) < '${new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()}'`)
        .innerJoinAndSelect("user", "u", "runner.id = u.id")
        .getRawMany()).map((it) => {
            let runner = new RunnerDto()
            runner.username = it.u_username
            runner.id = it.runner_id
            runner.lastStateChange = it.runner_lastStateChange
            runner.round = it.runner_round
            runner.state = it.runner_state
            runner.station = it.runner_station
            runner.timestamp = it.runner_timestamp
            return runner
        })
    }
}