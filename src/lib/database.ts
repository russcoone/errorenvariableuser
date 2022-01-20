import MongoClient from "mongodb";
import chalk from "chalk";

class Database {
  async init() {
    const MONGO_DB =
      process.env.DATABASE ||
      "mongodb+srv://root:Casas7897419632@cluster0.eyr6v.mongodb.net/test";
    const client = await MongoClient.connect(MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db();

    if (client.isConnected()) {
      console.log("==============DATABASE=================");
      console.log(`STATUS: ${chalk.greenBright("ONLINE")}`);
      console.log(`DATABASE: ${chalk.greenBright(db.databaseName)}`);
    }
    return db;
  }
}
export default Database;

// import { Db, MongoClient } from "mongodb";
// import chalk from "chalk";
// class Database {
//     db?: Db;

//     async init(): Promise<Db | undefined> {
//         console.log("================DATABASE================");
//         try {
//             const MONGO_DB = process.env.DATABASE;
//             const mongoClient = await MongoClient.connect(MONGO_DB);

//             this.db = mongoClient.db();
//             // Mensaje visual con el estado
//             console.log(`STATUS: ${chalk.greenBright("ONLINE")}`);
//             console.log(`DATABASE: ${chalk.greenBright(this.db.databaseName)}`);
//         } catch(error) {
//             console.log(`ERROR: ${error}`);
//             console.log(`STATUS: ${chalk.redBright("OFFLINE")}`);
//             console.log(`DATABASE: ${chalk.redBright(this.db?.databaseName)}`);
//         }
//         return this.db;
//     }
// }

// export default Database;
