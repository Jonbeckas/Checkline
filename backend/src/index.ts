
import express from 'express';
import cors from "cors";
import {CONFIG} from "./config";

export const app = express();
app.use(express.json());
app.use(cors())

app.get("/",async (req,res) => {
    res.status(400);
    res.send();
})


app.listen(CONFIG.port, () => {
    console.log(`Server is listening on port ${CONFIG.port}`);
});
