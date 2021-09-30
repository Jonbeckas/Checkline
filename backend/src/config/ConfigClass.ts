import { TypedJSON } from "typedjson";
import { Configuration } from "./ConfigDto";
import * as fs from "fs"
import { InvalidConfigError } from "./ConfigException";

export class ConfigClass {
    static parseConfig():Configuration {
        let fileContent =  fs.readFileSync(__dirname+"/../config.json","utf-8");
        TypedJSON.setGlobalConfig({
            errorHandler: e => {
                throw e;
            },
        });
        let serializer = new TypedJSON(Configuration);
        try  {
            let value =  serializer.parse(fileContent);
            if (value == undefined) {
                throw new InvalidConfigError();
            } else {
                //console.log(value)
                return value;
            }

        } catch(e: any) {
            throw new InvalidConfigError(e.message);
        }
    }
}