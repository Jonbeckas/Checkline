import express from 'express';
import {authRouter} from "../modules/authentification/authentification.module";
import {groupsRouter} from "../modules/groups/groups.module";
import listEndpoints from "express-list-endpoints"
import {userRouter} from "../modules/users/users.module";
import cors from "cors";

const app = express();
const PORT = 8000;
app.get('/', (req, res) => res.send('Express + TypeScript Server'));

app.use(cors())
app.use(authRouter);
app.use(groupsRouter);
app.use(userRouter);

app.use(express.json());

console.log(listEndpoints(app));


app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
