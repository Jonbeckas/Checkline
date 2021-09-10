import {DB} from "./DB";
import {Group} from "../model/Group";
import * as Uuid from "uuid"
import {User} from "../model/User";
import * as Argon2 from "argon2";
import {UserGroup} from "../model/UserGroup";
import type = Mocha.utils.type;
import {Permission} from "../modules/groups/dtos/permission";

describe('Fill Db with testdata', () => {
    it('Create Db', () => {
            const user = new DB();
            user.connect();
    })

    it("insert Data",async ()=> {
        const user = new DB();
        await user.connect();
        const userId = "33ecb6e3-ec16-4f45-a77e-9d45c7adf5d5";
        const groupId = "5bba9652-ec66-421a-a1a3-42e7d5bdf728";
        const hash = await Argon2.hash("password");

        await user.insertObject("groups",<Group>{ groupId:groupId,name:"LOL"});
        await user.deleteObject("groups",<Group>{ groupId:groupId,name:"LOL"});
        await user.insertObject("groups",<Group>{ groupId:groupId,name:"Admin"});
        await user.getObject("groups",<Group>{ groupId:groupId,name:"Admin"});
        await user.insertObject("users",<User> {userId:userId,name:"Testname",firstname:"Max",password:hash,loginName:"name1@test"});
        await user.insertObject("user-groups",<UserGroup> {userId:userId,groupId:groupId});
        await user.insertObject("group-permissions",{permission:"CENGINE_ADMIN",groupId:groupId});


    })

    it ("Check for Mysql Injection",async  () => {
        const user = new DB();
        await user.connect();
        const groupId = Uuid.v4();
        await user.insertObject("groups",<Group>{ groupId:groupId,name:"LOL\"\''() AND DROP TABLE"});
        await user.deleteObject("groups",<Group>{ groupId:groupId});
    })


})

