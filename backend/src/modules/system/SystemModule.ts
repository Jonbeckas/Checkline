import express from "express";
import { PermissionLoginValidator } from "../../server/PermissionLoginValidator";
import bodyParser from "body-parser";
import { RunnerService } from "../runners/RunnerService";
import Papa from "papaparse";
import { SystemService } from "./SystemService";

export const systemRouter = express.Router({caseSensitive:false});

systemRouter.use(bodyParser.json());
systemRouter.use(bodyParser.urlencoded({ extended: true }))

systemRouter.get("/system/logs/export",PermissionLoginValidator([["CENGINE_ADMIN"]]), async (req, res, next) => {
    const systemService = (<any> req).systemService as SystemService;

    let response = Papa.unparse(await systemService.getAllLogs())
    res.contentType("text/csv").status(200).send(response)
});