import express, {ErrorRequestHandler} from 'express';
import {authRouter} from "../modules/authentification/authentification.module";
import {groupsRouter} from "../modules/groups/groups.module";
import listEndpoints from "express-list-endpoints"
import {userRouter} from "../modules/users/users.module";
import cors from "cors";
import {CONFIG} from "../config";
import {runnersRouter} from "../modules/runners/runners.module";

const app = express();
app.get('/', (req, res) => res.send('Express + TypeScript Server'));

app.use(cors())
app.use(authRouter);
app.use(groupsRouter);
app.use(userRouter);
app.use(runnersRouter)

app.use(express.json());

app.use(((err, req, res, next) => {
    res.status(500).send({err: "Unknown Error"})
}) as ErrorRequestHandler); // ok


console.log(listEndpoints(app));


app.listen(CONFIG.port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${CONFIG.port}`);
});
