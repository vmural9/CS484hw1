/**
 * Contains CRUD functions for operating users data
 * Also functions for creating, updating , deleting a prompt
 *
 */

const dbOperations = require("./dbFunctions.js");
const serverFunctions = require("./serverFunctions.js");

// Function to check if user exits
// return true or false OR message string about error

async function checkUser(emailId, firstname, lastname, password, role) {
  try {
    if (
      !serverFunctions.checkUserName(firstname) ||
      !serverFunctions.checkUserName(lastname) ||
      !serverFunctions.checkUserName(role.toString())
    ) {
      return "Please enter correct first and lastname or role";
    }

    if (!serverFunctions.checkPasswordLength(password)) {
      return "Please enter password with more than 8 characters";
    }

    if (!serverFunctions.checkEmailId(emailId)) {
      return "Invalid email Id";
    }

    const dbData = await dbOperations.checkUserExists(emailId);
    return dbData;
  } catch (error) {
    console.error("Error while checking user:", error);
    throw new Error("Error while checking user");
  }
}

// Function to create user in Database
// return true or false
async function createUser(firstname, lastname, emailId, password, role) {
  if (role == "worker") {
    role = true;
  } else {
    role = false;
  }

  try {
    const dbResult = await dbOperations.createUser(
      firstname,
      lastname,
      emailId,
      password,
      role
    );
    return dbResult;
  } catch (error) {
    // Handle the error if something goes wrong
    throw error;
  }
}

// Function to check if the users exists and return data
// This function will return entire data about a user i.e. (name, password, salt, role, etc)
// return user data OR null
// Look specifically for this function signature, that also includes a callback.
// Endorse how async-await saves us from the callback and callback hells.

async function checkUserAndGet(emailId, callback) {
  const dbResult = await dbOperations.checkUserExistsAndGet(emailId);
  if (dbResult != false) {
    return callback(null, dbResult);
  }
  return callback(null, null);
}

// Function to update users data (firstname, lastname, emailId) in Database
// return true or false
async function updateUser(firstname, lastname, emailId) {
  try {
    // Check the firstname, lastname emailId format and password strength
    if (
      !serverFunctions.checkUserName(firstname) ||
      !serverFunctions.checkUserName(lastname)
    ) {
      return "Please enter correct first and lastname";
    }

    if (!serverFunctions.checkEmailId(emailId)) {
      return "Invalid email Id";
    }

    const dbResult = await dbOperations.updateUser(
      firstname,
      lastname,
      emailId
    );
    return dbResult;
  } catch (error) {
    throw error;
  }
}

// Function to create prompt in database
// return true or false
async function createPrompt(name, prompt, email) {
  if (
    !serverFunctions.checkUserName(name) ||
    !serverFunctions.checkUserName(prompt)
  ) {
    return "Please enter correct first and lastname";
  }

  if (!serverFunctions.checkEmailId(email)) {
    return "Invalid email Id";
  }

  const dbResult = await dbOperations.createNewPrompt(name, prompt, email);
  return dbResult;
}

async function getPromptId(email) {
  const dbResult = await dbOperations.getPromptId(email);
  return dbResult;
}
// Function to get list of prompts
// return list or error with false
async function getPromptList(email) {
  // console.log("Getting Prompt for Email:", email);
  const dbResult = await dbOperations.getPromptList(email);
  return dbResult;
}

// Function to update a prompt
async function updatePrompt(id, incomingUpdatedPrompt) {
  try {
    const dbResult = await dbOperations.updateExistingPrompt(
      id,
      incomingUpdatedPrompt
    );
    return dbResult > 0; // Return true if changes were made
  } catch (error) {
    console.error(error);
    return false;
  }
}

// Function to delete a prompt
async function deletePrompt(id) {
  try {
    // console.log(id);
    const dbResult = await dbOperations.deleteExistingPrompt(id);
    // console.log(dbResult);
    return dbResult;
  } catch (error) {
    // console.log(error);
    return null;
  }
}

async function deleteAllPrompts(id) {
  try {
    // console.log(id);
    const dbResult = await dbOperations.deleteAllPrompts();
    // console.log(dbResult);
    return dbResult;
  } catch (error) {
    // console.log(error);
    return null;
  }
}

async function deleteAllUsers(id) {
  try {
    // console.log(id);
    const dbResult = await dbOperations.deleteAllUsers();
    // console.log(dbResult);
    return dbResult;
  } catch (error) {
    // console.log(error);
    return null;
  }
}

// Another Way of exporting functions
exports.checkUser = checkUser;
exports.checkUserAndGet = checkUserAndGet;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.createPrompt = createPrompt;
exports.getPromptList = getPromptList;
exports.updatePrompt = updatePrompt;
exports.deletePrompt = deletePrompt;
exports.getPromptId = getPromptId;
exports.deleteAllPrompts = deleteAllPrompts;
exports.deleteAllUsers = deleteAllUsers;
