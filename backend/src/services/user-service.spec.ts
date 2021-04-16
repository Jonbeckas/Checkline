import {User} from "../model/User";
import {DB} from "../db/DB";
import {getUserByLoginNameExceptional} from "./UserService";
import {InvalidMysqlData} from "../exception/invalid-mysql-data";
import { assert } from "chai";
import {NoUserFoundException} from "../exception/no-user-found.exception";

describe('Userservices', () => {
    const USER_ID = "33ecb6e3-ec16-4f45-a77e-9d45c7adf5dd";
    const USER_ID2 = "5bba9652-ec66-421a-a1a3-42e7d5bdf729";

    it("Two users same name",async (done)=> {
        const user = new DB();
        await user.connect();
        try {
            await user.insertObject("users",<User>{ userId:USER_ID,name:"LOL",password:"123",firstName:"lol",loginName:"name2@test"});
            await user.insertObject("users",<User>{ userId:USER_ID2,name:"JJ",password:"dd",firstName:"FGV",loginName:"name2@test"});
        } catch (e) {

        }
        try {
            const res = await getUserByLoginNameExceptional("name2@test");
        } catch (e) {
            if (e instanceof InvalidMysqlData) {
                await user.deleteObject("users",{userId:USER_ID});
                await user.deleteObject("users",{userId:USER_ID2});
                done()
            }
        }


    })

    it("Return User",async ()=> {
        const user = new DB();
        await user.connect();

        const res = <User>await getUserByLoginNameExceptional("name1@test");
        assert.strictEqual(res.userId,"33ecb6e3-ec16-4f45-a77e-9d45c7adf5d5");
    })

})
