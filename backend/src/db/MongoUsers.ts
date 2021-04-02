import {MongoClient} from "mongodb";
import {CONFIG} from "../config";
import {User} from "../model/User";

export class MongoUsers {

    isConnected =false;
    db: MongoClient|null = null;


    connect() {
        MongoClient.connect(CONFIG.mongoUrl, async (err, db)  => {
            if (err) throw err;
            console.log("Database created!");
            const dbo = db.db("checkline");
            const collection = await dbo.createCollection("users");
            console.log("Collection created!");
            this.isConnected = true;
            this.db = db;
        });
    }

    async close() {
        if (this.isConnected) {
            this.db?.close();
            this.isConnected = false;
        }
    }

    async insert(user:User) {
        MongoClient.connect(CONFIG.mongoUrl, async (err, db)  => {
            if (err) throw err;
            console.log("Database created!");
            const dbo = db.db("checkline");
            const collection = await dbo.createCollection("users");
            console.log("Collection created!");
            this.isConnected = true;
            this.db = db;
        });
    }

}
