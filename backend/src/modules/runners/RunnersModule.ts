import express, { Router } from "express";
import {RunnerService} from "./RunnerService";
import {UsernameDto} from "./dtos/UsernameDto";
import {warnEnvConflicts} from "prisma/prisma-client/runtime";
import {RunnerCard} from "./RunnerCard";
import bodyParser from "body-parser";
import { UserService } from "../../services/UserService";
import { GroupService } from "../../services/GroupService";
import { Connection } from "typeorm";
import { Runner } from "../../model/Runner";
import { PermissionLoginValidator } from "../../server/PermissionLoginValidator";
import { RunnerNotFoundError } from "../../exception/RunnerNotFoundError";
import { InternalServerError } from "../../exception/InternalServerError";
import { RunnerStateNotFoundError } from "../../exception/RunnerStateNotFound";
import { RunnerStateNotSetError } from "../../exception/RunnerStateNotSetError";
import { CONFIG } from "../../config/Config";


export class RunnersModule  {
    static init(userService:UserService, groupService: GroupService, connection:Connection): Router {
        const runnersRouter = express.Router({caseSensitive:false});

        runnersRouter.use(bodyParser.json());
        runnersRouter.use(bodyParser.urlencoded({ extended: true }))

        runnersRouter.use((req:any,res,next) => {
            req.userService = userService;
            req.groupService = groupService;
            req.runnerService = new RunnerService(userService,groupService,connection.getRepository(Runner))
        })

        runnersRouter.get("/runners",PermissionLoginValidator([["RUNNER_LIST"]]), async (req, res, next) => {
            let runnerService = (<any> req).runnerService as RunnerService
            res.status(200).send(await runnerService.getRunners())
        });
        
        runnersRouter.post("/runner",PermissionLoginValidator([["RUNNER_LIST"],["RUNNER_MODIFY"]]), async (req, res, next) => {
            let runnerService = (<any> req).runnerService as RunnerService
            if (!req.body || !req.body.username) {
                res.status(400).send({err: "Missing Fields"});
            }
            try {
                res.status(200).send(await runnerService.getRunnerByName(req.body.username));
            } catch (e) {
                if (e instanceof RunnerNotFoundError) {
                    res.status(404).send("RunnerNotFound")
                } else {
                    throw new InternalServerError()
                }
            }
        });
        
        runnersRouter.post("/runner/state",PermissionLoginValidator([["RUNNER_MODIFY"]]), async (req, res, next) => {
            let runnerService = (<any> req).runnerService as RunnerService
            if (!req.body || !req.body.username || !req.body.state) {
                res.status(400).send({err: "Missing Fields"});
                return;
            }
            try {
                let runner = await runnerService.getRunnerByName(req.body.username);
                let result = await runnerService.setRunneState(runner,req.body.state);
                res.status(200).send()
            } catch (e) {
                if (e instanceof RunnerNotFoundError) {
                    res.status(404).send({err:"RunnerNotFound"})
                } else if (e instanceof RunnerStateNotFoundError) {
                    res.status(404).send({err: "RunnerStateNotFound"})
                } else {
                    throw new InternalServerError()                    
                }
            }
        });
        
        runnersRouter.get("/runners/states",PermissionLoginValidator([["RUNNER_MODIFY"]]), async (req, res, next) => {
            res.status(200).send(CONFIG.runners.states)
        });
        
        
        runnersRouter.post("/runners/addRound",PermissionLoginValidator([["RUNNER_MODIFY"]]), async (req, res, next) => {
            let runnerService = (<any> req).runnerService as RunnerService

            let rReq = <UsernameDto> req.body;
            if (!req.body || !rReq.username) {
                res.status(400).send({err: "Missing Fields"});
                return;
            }
            try {
                let runner = await runnerService.getRunnerByName(req.body.username);
                await runnerService.addRound(runner)
                res.status(200).send()
            } catch(e) {
                if (e instanceof RunnerNotFoundError) {
                    res.status(404).send({err:"RunnerNotFound"})
                } else {
                    throw new InternalServerError()
                }
            }
        });
        
        runnersRouter.post("/runners/decreaseRound",PermissionLoginValidator([["RUNNER_MODIFY"]]), async (req, res, next) => {
            let runnerService = (<any> req).runnerService as RunnerService

            let rReq = <UsernameDto> req.body;
            if (!req.body || !rReq.username) {
                res.status(400).send({err: "Missing Fields"});
                return;
            }

            try {
                let runner = await runnerService.getRunnerByName(req.body.username);
                let state = await runnerService.getRunnerState(runner);
                await runnerService.decreaseRound(runner)
                res.status(200).send()
            } catch(e) {
                if (e instanceof RunnerNotFoundError) {
                    res.status(404).send({err:"RunnerNotFound"})
                } else if (e instanceof RunnerStateNotSetError) {
                    res.status(400).send({err: "RunnerStateNotSet"})
                } else {
                    throw new InternalServerError()
                }
            }
        });
        
        runnersRouter.post("/runners/qr",PermissionLoginValidator([["RUNNER_LIST"]]), async (req, res, next) => {
        
            let rReq = <UsernameDto> req.body;
            if (!req.body || !rReq.username) {
                res.status(400).send({err: "Missing Fields"});
                return;
            }
            try {
                let data = await RunnerCard.getRunnerCard(rReq.username);
                res.status(200).send({data: data})
            } catch (e) {
                throw new InternalServerError();
                
            }
        });
        

        return runnersRouter;
    }
}
