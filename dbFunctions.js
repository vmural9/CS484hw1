const cryptoFunctions = require("./passportAuth.js");
const dbName = "HW1_DB";
let db;
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

sqlite
  .open({
    filename: `./database/${dbName}.db`,
    driver: sqlite3.Database,
  })
  .then((dbConn) => {
    console.log(`Connected to database - ./database/${dbName}.db`);
    db = dbConn;
  });

async function checkUserExists(emailId) {
  queryString = "SELECT * FROM users where email=?";
  try {
    const result = await db.get(queryString, [emailId]);
    if (result == undefined) {
      return false;
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function checkUserExistsAndGet(emailId) {
  queryString = "SELECT * FROM users where email=?";
  try {
    const result = await db.get(queryString, [emailId]);
    if (result != undefined) {
      return result;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function createUser(firstname, lastname, email, password, role) {
  try {
    // Generate Hashed Password
    passwordHashSalt = cryptoFunctions.genPassword(password);

    queryString = "INSERT INTO users(name, password, email, salt, role)";
    queryString += "VALUES(?, ?, ?, ?, ?);";

    const result = await db.run(queryString, [
      firstname + " " + lastname,
      passwordHashSalt.hash,
      email,
      passwordHashSalt.salt,
      role,
    ]);
    if (result != null) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function updateUser(firstname, lastname, email) {
  try {
    queryString = "UPDATE users ";
    queryString += "SET name=?,";
    queryString += "email=?";
    queryString += "  where email=?;";

    const result = await db.run(queryString, [
      firstname + " " + lastname,
      email,
      email,
    ]);
    // console.log(result);
    if (result.changes > 0) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function deleteUser(email) {
  try {
    queryString = "DELETE FROM users ";
    queryString += " where email=?";

    const result = await db.run(queryString, [email]);
    if (result.changes > 0) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function createNewPrompt(name, prompt, email) {
  try {
    queryString = "INSERT INTO prompt_history(name, prompt, email) ";
    queryString += " VALUES(?, ?, ?);";

    const result = await db.run(queryString, [name, prompt, email]);
    // console.log("Result for new prompt creation", result);
    if (result.changes > 0) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function getPromptList(email) {
  try {
    // console.log("DB file", email);
    queryString = "SELECT * FROM prompt_history where email=?";

    const result = await db.all(queryString, [email]);
    if (result != []) {
      return result;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function updateExistingPrompt(id, newPrompt) {
  try {
    queryString = "UPDATE prompt_history SET prompt=? WHERE id=?";
    const result = await db.run(queryString, [newPrompt, id]);
    if (result.changes > 0) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function deleteExistingPrompt(id) {
  try {
    queryString = "DELETE FROM prompt_history where id=?";
    const result = await db.run(queryString, [id]);
    if (result.changes > 0) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function deleteAllUsers() {
  try {
    queryString = "DELETE FROM users";
    const result = await db.run(queryString, []);
    if (result.changes > 0) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function deleteAllPrompts() {
  try {
    queryString = "DELETE FROM prompt_history";
    const result = await db.run(queryString, []);
    if (result.changes > 0) {
      return true;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}
async function getPromptId(email) {
  try {
    queryString = "SELECT id FROM prompt_history where email=?";

    const result = await db.all(queryString, [email]);
    console.log(result);
    if (result != []) {
      return result;
    }
    return false;
  } catch (e) {
    console.log(e);
    return false;
  }
}
module.exports = {
  checkUserExists,
  createUser,
  checkUserExistsAndGet,
  updateUser,
  createNewPrompt,
  getPromptList,
  updateExistingPrompt,
  deleteExistingPrompt,
  getPromptId,
  deleteAllUsers,
  deleteAllPrompts,
};
