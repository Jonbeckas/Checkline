import {UserDB} from "./UserDB";
import {Group} from "../model/Group";
import * as Uuid from "uuid"
import {User} from "../model/User";
import * as Argon2 from "argon2";
import {UserGroup} from "../model/UserGroup";
import type = Mocha.utils.type;

describe('Fill Db with testdata', () => {
    it('Create Db', () => {
            const user = new UserDB();
            user.connect();
    })

    it("insert Data",async ()=> {
        const user = new UserDB();
        await user.connect();
        const userId = Uuid.v4();
        const groupId = Uuid.v4();
        const hash = await Argon2.hash("password");

        await user.insertObject("groups",<Group>{ groupId:groupId,name:"LOL"});
        await  user.deleteObject("groups",<Group>{ groupId:groupId,name:"LOL"});
        await  user.insertObject("groups",<Group>{ groupId:groupId,name:"Admin"});
        console.log(typeof Group)
        console.log(await user.getObject("groups",<Group>{ groupId:groupId,name:"Admin"}));
        //await user.editObject("groups",["groupId","name"],<Group>{ groupId:groupId,name:"LUL"})
        //await user.insertObject("users",<User> {userId:userId,name:"Testname",firstName:"Max",password:hash});
       // await user.insertObject("user-groups",<UserGroup> {userId:userId,groupId:groupId});

    })


})

