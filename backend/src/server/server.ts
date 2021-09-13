import express, {ErrorRequestHandler} from 'express'

import cors from "cors";
import SlowDown from "express-slow-down";
import {UserService} from "../services/UserService";
import {GroupService} from "../services/GroupService";
import {authRouter} from "../modules/authentification/AuthentificationModule";
import { groupsRouter } from '../modules/groups/GroupsModule';
import { userRouter } from '../modules/users/UsersModule';
import { RunnersModule } from '../modules/runners/RunnersModule';
import { Connection } from 'typeorm';
import { CONFIG } from '../config/Config';

//console.log(listEndpoints(app));

export class Server {
    constructor(userService: UserService, groupService: GroupService, connection: Connection) {
        const app = express();
        app.enable("trust proxy")
        const speedLimiter = SlowDown({
            windowMs: 15 * 60 * 1000, // 15 minutes
            delayAfter: 100, // allow 100 requests per 15 minutes, then...
            delayMs: 500 // begin adding 500ms of delay per request above 100:
        });

        //  apply to all requests
        app.use(speedLimiter);
        app.use(cors())

        app.use(((req, res, next) => {
            (<any>req).userService = userService;
            (<any>req).groupService = groupService;
            next()
        }))

        app.use(authRouter);
        app.use(groupsRouter);
        app.use(userRouter);
        //app.use(RunnersModule.init(userService,groupService,connection))

        app.use(express.json());

        app.get('/', (req, res) => res.send('Server runs!'));

        app.use(((err, req, res, next) => {
            res.status(500).send({err: "Unknown Error"})
        }) as ErrorRequestHandler); // ok


        app.listen(CONFIG.port, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${CONFIG.port}`);
        });
    }
}
