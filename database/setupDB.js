const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const dbName = "HW1_DB";
let db;

/**
 * 1. Create a DB file if there doesn't exist already
 * 2. Connect to the Database
 * 3. Create users table
 * 4. Create prompt_history table
 */

try {
  createDatabase((err) => {
    if (err != null) {
      console.log("Error While Creating db file inside ./database/ folder");
      throw err;
    }

    db = new sqlite3.Database(
      "./database/" + dbName + ".db",
      sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log(`Connected to the database ${dbName}.db`);
      }
    );

    createUsersTable((res) => {
      if (res == true) {
        console.log(`Created users Table inside ${dbName}.db`);
      } else {
        console.log(`Unable to create users Table inside ${dbName}.db`);
      }
    });

    createPromptHistoryTable((res) => {
      if (res == true) {
        console.log(`Created prompt_history Table inside ${dbName}.db`);
      } else {
        console.log(
          `Unable to create prompt_history Table inside ${dbName}.db`
        );
      }
    });
  });
} catch (e) {
  console.log(e);
}

// Create a file named HW1_DB.db if not present
function createDatabase(callback) {
  // open function with filename, file opening mode and callback function
  fd = fs.open("./database/" + dbName + ".db", "w+", function (err, file) {
    if (err) throw callback(err);
    console.log("Created DB");
    return callback(null);
  });

  // fs.close(fd, (err)=>{
  //     if (err) {
  //         console.log("Problems with closing the file");
  //         throw callback(err);
  //     }

  //     return callback(null)
  // })
}

// Creates prompt_history table
function createPromptHistoryTable(callback) {
  sqlQuery =
    "CREATE TABLE prompt_history (" +
    "    name         VARCHAR (200)," +
    "    prompt       VARCHAR (400)," +
    "    email        VARCHAR (200)," +
    "    id           INTEGER        PRIMARY KEY AUTOINCREMENT" +
    ");";

  sqlParams = [];

  return db.run(sqlQuery, sqlParams, function (err) {
    if (err != null) {
      console.log("Error while creating Table");
      console.log(err);
      return callback(false);
    }

    return callback(true);
  });
}

// Creates users table
function createUsersTable(callback) {
  sqlQuery =
    "CREATE TABLE users ( " +
    "   name     VARCHAR (200), " +
    "   password VARCHAR (500), " +
    "   email    VARCHAR (200), " +
    "   salt     VARCHAR (500), " +
    "   role     BOOLEAN       NOT NULL DEFAULT false " +
    ");";

  sqlParams = [];

  return db.run(sqlQuery, sqlParams, function (err) {
    if (err != null) {
      console.log("Error while creating Table");
      console.log(err);
      return callback(false);
    }

    return callback(true);
  });
}
