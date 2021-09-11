import {Configuration} from "./config/config-interface";
import * as fs from "fs";

export const CONFIG:Configuration  = JSON.parse(fs.readFileSync(__dirname+"/config.json","utf-8"))
