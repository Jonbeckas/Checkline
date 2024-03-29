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
import { UserNotFoundError } from "../../exception/UserNotFoundError";
import Papa from "papaparse";


export const runnersRouter = express.Router({caseSensitive:false});

runnersRouter.use(bodyParser.json());
runnersRouter.use(bodyParser.urlencoded({ extended: true }))

runnersRouter.get("/runners",PermissionLoginValidator([["RUNNER_LIST"]]), async (req, res, next) => {
    try {
        let runnerService = (<any> req).runnerService as RunnerService
        res.status(200).send(await runnerService.getRunners())
    } catch (e) {
        next(e);
    }
});

runnersRouter.post("/runner",PermissionLoginValidator([["RUNNER_LIST"],["RUNNER_MODIFY"], ["RUNNER_SELF_OVERVIEW"]]), async (req, res, next) => {
    let runnerService = (<any> req).runnerService as RunnerService
    if (!req.body || !req.body.id) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }

    try {
        res.status(200).send(await runnerService.getRunnerById(req.body.id));
    } catch (e) {
        if (e instanceof RunnerNotFoundError) {
            res.status(404).send("RunnerNotFound")
        } else {
            next(new InternalServerError());
        }
    }
});

runnersRouter.post("/selfrunner",PermissionLoginValidator([["RUNNER_SELF_OVERVIEW"]]), async (req, res, next) => {
    let runnerService = (<any> req).runnerService as RunnerService

    try {
        res.status(200).send(await runnerService.getRunnerById((req as any).userData.userId));
    } catch (e) {
        if (e instanceof RunnerNotFoundError) {
            res.status(404).send("RunnerNotFound")
        } else {
            next(new InternalServerError());
        }
    }
});
runnersRouter.post("/runner/state",PermissionLoginValidator([["RUNNER_MODIFY"]]), async (req, res, next) => {
    let runnerService = (<any> req).runnerService as RunnerService
    if (!req.body || !req.body.id || !req.body.state) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    try {
        let runner = await runnerService.getOrTemporaryGenerateRunnerById(req.body.id);
        let result = await runnerService.setRunneState(runner,req.body.state, (req as any).userData.userId);
        res.status(200).send()
    } catch (e) {
        try {
            if (e instanceof RunnerNotFoundError) {
                res.status(404).send({err:"RunnerNotFound"})
            } else if (e instanceof RunnerStateNotFoundError) {
                res.status(404).send({err: "RunnerStateNotFound"})
            } else {
                next(new InternalServerError());                    
            }
        } catch(f) {
            console.error(f);
        }
    }
});

runnersRouter.get("/runners/states",PermissionLoginValidator([["RUNNER_MODIFY"]]), async (req, res, next) => {
    res.status(200).send(CONFIG.runners.states)
});


runnersRouter.post("/runners/addRound",PermissionLoginValidator([["RUNNER_MODIFY"]]), async (req, res, next) => {
    let runnerService = (<any> req).runnerService as RunnerService

    let rReq = <UsernameDto> req.body;
    if (!req.body || !rReq.id) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    try {
        let runner = await runnerService.getRunnerById(req.body.id);
        await runnerService.addRound(runner, (req as any).userData.userId);
        await runnerService.changeTimestampToNow(runner);
        res.status(200).send()
    } catch(e) {
        if (e instanceof RunnerNotFoundError) {
            res.status(404).send({err:"RunnerNotFound"})
        } else if (e instanceof RunnerStateNotSetError) {
            res.status(404).send({err:"RunnerStateNotSetError"})
        } else {
            next(new InternalServerError());
        }
    }
});

runnersRouter.post("/runners/decreaseRound",PermissionLoginValidator([["RUNNER_MODIFY"]]), async (req, res, next) => {
    let runnerService = (<any> req).runnerService as RunnerService

    let rReq = <UsernameDto> req.body;
    if (!req.body || !rReq.id) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }

    try {
        let runner = await runnerService.getRunnerById(rReq.id);
        await runnerService.decreaseRound(runner, (req as any).userData.userId)
        await runnerService.changeTimestampToNow(runner);
        res.status(200).send()
    } catch(e) {
        if (e instanceof RunnerNotFoundError) {
            res.status(404).send({err:"RunnerNotFound"})
        } else if (e instanceof RunnerStateNotSetError) {
            res.status(400).send({err: "RunnerStateNotSet"})
        } else {
            next(new InternalServerError());
        }
    }
});

runnersRouter.post("/runners/qr",PermissionLoginValidator([["RUNNER_LIST"],["RUNNER_SELF_OVERVIEW"]]), async (req, res, next) => {
    let runnerService = (<any> req).runnerService as RunnerService;
    let groupService = (<any> req).groupService as GroupService;
    let userService = (<any> req).userService as UserService;
    let rReq = <UsernameDto> req.body;
    if (!req.body || !rReq.id) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    try {
        let authUser = await userService.getUserById((req as any).userData.userId)
        let user = await userService.getUserById(rReq.id);
        let data = await RunnerCard.getRunnerCard(user.username, user.id);
        if (await groupService.userHasPermission(authUser, [["RUNNER_LIST"],["CENGINE_ADMIN"]])) {
            res.status(200).send({data: data})
        } else if (await  groupService.userHasPermission(authUser, [["RUNNER_SELF_OVERVIEW"]])) {
            if (rReq.id ==(<any>req).userData.userId) {
                res.status(200).send({data: data})
            } else {
                res.status(403).send({err:"ForbiddenA"});
            }
        } else {
            res.status(403).send({err: "ForbiddenB"});
        }
    } catch (e) {
        if (e instanceof UserNotFoundError) {
            res.status(404).send({err:"UserNotFound"});
        } else {
            next(new InternalServerError());;
        }
    }
});

/*
    Section for Runner Stations
*/
runnersRouter.post("/runners/station",PermissionLoginValidator([["RUNNER_MODIFY"]]), async (req,res,next) => {
    let runnerService = (<any> req).runnerService as RunnerService;

    let station = <string> req.body.station;
    let id = <string> req.body.id;
    if (!req.body || !id ||!station ) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }

    try {
        let runner = await runnerService.getRunnerById(id);
        runnerService.setStation(runner, station, (req as any).userData.userId);
        res.status(200).send();
    } catch(e) {
        if (e instanceof RunnerNotFoundError) {
            res.status(404).send({err:"RunnerNotFound"})
        } else {
            next(new InternalServerError());
        }
    }
});

/**
 * Get station
 */
runnersRouter.get("/runners/station",PermissionLoginValidator([["RUNNER_MODIFY"]]), async (req,res,next) => {
    let runnerService = (<any> req).runnerService as RunnerService;

    let station = <string> req.body.station;
    let uid = <string> req.body.uid;
    if (!req.body || !uid ||!station ) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }

    try {
        let runner = await runnerService.getRunnerById(uid);
        let station = runnerService.getStation(runner);
        res.status(200).send(station)
    } catch(e) {
        if (e instanceof RunnerNotFoundError) {
            res.status(404).send({err:"RunnerNotFound"})
        } else {
            next(new InternalServerError());
        }
    }
});

runnersRouter.get("/runners/stations",PermissionLoginValidator([["RUNNER_MODIFY"]]), async (req, res, next) => {
    res.status(200).send(CONFIG.runners.stations)
});

/**
 * self runner overview
 */
 runnersRouter.get("/runner",PermissionLoginValidator([["RUNNER_SELF_OVERVIEW"]]), async (req, res, next) => {
    let runnerService = (<any> req).runnerService as RunnerService;
    let uid = <string> req.body.uid;
    if (!req.body || !uid) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }

    try {
        let runner = await runnerService.getRunnerById(uid);
        res.status(200).send(runner)
    } catch(e) {
        if (e instanceof RunnerNotFoundError) {
            res.status(200).send({err:"RunnerNotFound"})
        } else {
            next(new InternalServerError());
        }
    }
});

/**
 * List conspicous runners
 */

runnersRouter.get("/runners/conspicous", PermissionLoginValidator([["RUNNER_CONSPICOUS"]]), async (req, res, next) => {
    let runnerService = (<any> req).runnerService as RunnerService;
    res.status(200).send(await runnerService.getConspicousUsers())
});

/**
 * Export runners as csv
 */
runnersRouter.get("/runners/export", PermissionLoginValidator([["RUNNER_EXPORT"]]), async (req, res) => {
    const runnerService = (<any> req).runnerService as RunnerService;

    let response = Papa.unparse(await runnerService.getRunners())
    res.contentType("text/csv").status(200).send(response)
})