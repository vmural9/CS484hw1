// This file contains all the helper functions

// Function to check if the username is string and not empty
function checkUserName(incomingString) {
  //Remove all the white spacing from the left and the right

  incomingString = incomingString.trim();

  if (typeof incomingString === "string" && incomingString.length != 0) {
    return true;
  } else {
    return false;
  }
}

// Function to check if the password length is atleast 8 characters
// Return true if >=8 else false.
function checkPasswordLength(password) {
  if (password.length >= 8) {
    return true;
  } else {
    return false;
  }
}

// Function to check if the email Id has '@' and contains '.' and the email Id is string@string.string.* format. (Can contain ,!$#%, etc in the email Id. For more strict check , checkout regex expression to validate email ID)
function checkEmailId(emailID) {
  if (
    typeof emailID === "string" &&
    emailID.includes("@") &&
    emailID.includes(".")
  ) {
    const [localPart, domainPart] = emailID.split("@");

    const domainSplit = domainPart.split(".");

    if (localPart && domainSplit.length >= 2) {
      if (domainSplit[0] && domainSplit[1]) {
        return true;
      }
    }
  }
  return false;
}

// Export modules so that they can be accessed from another file . Check out import statements in server.js
module.exports = { checkPasswordLength, checkUserName, checkEmailId };
