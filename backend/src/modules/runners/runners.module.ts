import express from "express";
import {authRouter} from "../authentification/authentification.module";
import bodyParser from "body-parser";
import {DB} from "../../db/DB";
import {PermissionLoginValidator} from "../../server/permission-login-validator";
import {GroupService} from "../../services/group-service";
import {RunnerService} from "./runner-service";
import {CONFIG} from "../../config";
import {UsernameDto} from "./dtos/username.dto";
import {warnEnvConflicts} from "prisma/prisma-client/runtime";
import {RunnerCard} from "./runner-card";

export const runnersRouter = express.Router({caseSensitive:false});

runnersRouter.use(bodyParser.json());
runnersRouter.use(bodyParser.urlencoded({ extended: true }))

const db = new DB();
db.connect().catch(e => console.error(e));

runnersRouter.get("/runners",PermissionLoginValidator([["RUNNER_LIST"]]), async (req, res, next) => {
    res.status(200).send(await RunnerService.getRunners())
});

runnersRouter.post("/runner",PermissionLoginValidator([["RUNNER_LIST"],["RUNNER_MODIFY"]]), async (req, res, next) => {
    if (!req.body || !req.body.username) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    try {
        res.status(200).send(await RunnerService.getRunnerByName(req.body.username));
    } catch (e) {
        res.status(404).send({err: "User not found"});
        return;
    }
});

runnersRouter.post("/runner/state",PermissionLoginValidator([["RUNNER_MODIFY"]]), async (req, res, next) => {
    if (!req.body || !req.body.username || !req.body.state) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    try {
        let result = await RunnerService.setRunneState(req.body.username,req.body.state);
        if (result.success) {
            res.status(200).send();
         } else {
            res.status(404).send({err:result.err});
        }
    } catch (e) {
        console.error(e);
        res.status(404).send(e);
        return;
    }
});

runnersRouter.get("/runners/states",PermissionLoginValidator([["RUNNER_MODIFY"]]), async (req, res, next) => {
    res.status(200).send(CONFIG.runners.states)
});


runnersRouter.post("/runners/addRound",PermissionLoginValidator([["RUNNER_MODIFY"]]), async (req, res, next) => {

    let rReq = <UsernameDto> req.body;
    if (!req.body || !rReq.username) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    let result = await RunnerService.addRound(rReq.username);
    if (result.success) {
        res.status(200).send()
    } else{
        res.status(404).send({err:result.err})
    }
});

runnersRouter.post("/runners/decreaseRound",PermissionLoginValidator([["RUNNER_MODIFY"]]), async (req, res, next) => {

    let rReq = <UsernameDto> req.body;
    if (!req.body || !rReq.username) {
        res.status(400).send({err: "Missing Fields"});
        return;
    }
    let result = await RunnerService.decreaseRound(rReq.username);
    if (result.success) {
        res.status(200).send()
    } else{
        if (result.err == "User not found") {
            res.status(404).send({err:result.err})
        } else if (result.err == "User has no defined state") {
            res.status(400).send({err:result.err})
        } else if (result.err == "User has no round") {
            res.status(400).send({err:result.err})
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
        res.status(200).contentType('application/pdf').send(await RunnerCard.getRunnerCard(rReq.username))
    } catch (e) {
        res.status(500).send({err:"Unknown error"});
    }
});


