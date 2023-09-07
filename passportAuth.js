// Import Modules Required to setup passport local stragegy
const crypto = require("crypto");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crudOperations = require("./crudOperationFunctions.js");

/**
 * passportInit() function is used to initialize the LocalStrategy of passport.js
 * This strategy helps apply session based authentication
 * Please note "usenameField" & "passwordField" provide the alias names which correspond to input data
 * For Ex - Any POST must have key value like  emailId="someEmail@email.com" and password="SomePassword"
 * Call Back for this function has three arguments (emailId, password, next) where the next is called to apply next stage in the middleware
 * For more information on middlewares check out this link- https://expressjs.com/en/guide/using-middleware.html
 */
function passportInit() {
  passport.use(
    new LocalStrategy(
      { usernameField: "emailId", passwordField: "password" },
      (emailId, password, next) => {
        // Check if the user exists and get the data
        // Validate the password with the hash stored
        // Call the middleware

        crudOperations.checkUserAndGet(emailId, (err, user) => {
          if (err) {
            return next(err);
          }
          if (!user) {
            return next(null, false, {
              message: "No user exists with that email!",
            });
          }
          const result = validPassword(password, user.password, user.salt);
          if (result) return next(err, user);
          return next(err, false);
        });
      }
    )
  );
}
/**
 * Functions serializeUser & deserializeUser need to be implementated while working with passport
 * serializeUser function stores a mapping of emailId and express session
 * derializeUser functions does the opposite of finding if there exists a valid user **
 */
passport.serializeUser((data, next) => {
  next(null, data);
});

// User input for the deserialize function comes from the passport entry that forms in the express session
// This function is called when you invoked the isAuthenticated() function.
// Here the 'data' is the value that is stored in the express session under the passport field ( This is the same data that you store when serialize method is called )
passport.deserializeUser(async (data, next) => {
  try {
    const [firstName, lastName] = data.name.split(" ");
    const res = await crudOperations.checkUser(
      data.email,
      firstName,
      lastName,
      data.password,
      data.role
    );

    if (res !== false) {
      next(null, data);
    } else {
      next(null, false);
    }
  } catch (error) {
    console.error("Error in passport.deserializeUser:", error);
    next(error);
  }
});

// Function to generate hashed password and salt
// ***** This function is used in dbFunctions.js while creating the user in which the password is hashed with a salt
function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}

// Function to validate if password matches the stored hashed password
function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

module.exports = {
  passportInit,
  genPassword,
  validPassword,
};
