import express, {ErrorRequestHandler} from 'express';
import {authRouter} from "../modules/authentification/authentification.module";
import {groupsRouter} from "../modules/groups/groups.module";
import listEndpoints from "express-list-endpoints"
import {userRouter} from "../modules/users/users.module";
import cors from "cors";
import {CONFIG} from "../config";
import {runnersRouter} from "../modules/runners/runners.module";
import SlowDown from "express-slow-down";

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
app.use(authRouter);
app.use(groupsRouter);
app.use(userRouter);
app.use(runnersRouter)

app.use(express.json());

app.get('/', (req, res) => res.send('Server runs!'));

app.use(((err, req, res, next) => {
    res.status(500).send({err: "Unknown Error"})
}) as ErrorRequestHandler); // ok


//console.log(listEndpoints(app));

export class Server {
    constructor() {
        app.listen(CONFIG.port, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${CONFIG.port}`);
        });
    }
}
