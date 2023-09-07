// Import modules
const express = require("express");
const path = require("path");
const app = express();

const sessionObj = require("express-session");
const port = 3000;
const crudOperations = require("./crudOperationFunctions.js");
const passport = require("passport");

const dotenv = require("dotenv");
dotenv.config();

// Middlewares
// Middle ware for parsing JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Middleware to create in-memory session store
// In-memory vs persistent datastore (Database based)
// Session data is lost when the server is stopped with in-memory store
// Session data is not lost when the server is stopped
// Below is the configuration for in-memory datastore
// For details on Options used for this middleware check out - https://www.npmjs.com/package/express-session
app.use(
  sessionObj({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 10,
    },
  })
);

// // Initialize passport auth middleware
app.use(passport.initialize());
app.use(passport.session());

// // Initialise the "Local" Strategy for passport authentication
const passportAuth = require("./passportAuth.js");
const middleware = require("./middleware");
const authenticateInternal = require("./authenticationMiddleWareInternal");

passportAuth.passportInit();

// // ***********   Below are all the endpoints where requests are sent ( GET, PUT, DELETE, POST ) ***********

app.get("/", (req, res) => {
  // TO DO - Add Authentication for this route . If the user is authenticated redirect to the dashboard else send the login.html page
  // Hints - Have Look inside req object for the Authentication method.
  // Based on return value of that method: If true: redirect response(res) to /dashboard else send login.html in response(res).
  res.sendFile("login.html", { root: path.join(__dirname, "views") });
});

app.get("/login", (req, res) => {
  // TO DO - Add Authentication for this route . If the user is authenticated redirect to the dashboard else send the login.html page
  // // Hints - Have Look inside req object for the Authentication method.
  res.sendFile("login.html", { root: path.join(__dirname, "views") });
});

app.get("/create-user", (req, res) => {
  res.sendFile("create_user.html", { root: path.join(__dirname, "views") });
});

// TO DO - Add Authentication for this route which does the following:
//  - If the user is authenticated then return update users page or else redirect to login page
// 1. Add a middleware to handle authentication. Look at how middlewares are added to a route.
// 2. Good Part - The middleware files have been already created for you.
// 3. Figure out based on funtionality which will be appropriate to be used here.
app.get("/update-user", (req, res) => {
  res.sendFile("./views/update_user.html", { root: __dirname });
});

// TO DO - Add Authentication for this route . If the user is authenticated then return dashboard page or else redirect to login page
// Add a middleware to handle authentication.
// The middleware files have been already created for you.
// Figure out based on funtionality which will be appropriate to be used here.
app.get("/dashboard", (req, res) => {
  res.sendFile("./views/dashboard.html", { root: __dirname });
});

app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
      return next(err);
    }
    console.log("Redirecting!");
    res.redirect("/");
  });
});

// TO DO - Complete the route to return the Prompt Lists.
// 1. Here the middleware has been added for you which checks if you are authenticated or not. If yes, continues with execution else sends response as { "msg": false }
// 2. Look out inside crudOperations file. Use a function that returns you the Prompt List.
// 3. Once found look what needs to be passed as per the function signature. Maybe you can extract that required argument from request obj (req)?
// 4. Handle the value returned by the function (say data) as follows:
//    4.1 If data is not null and not false, return a json response {msg: data}
//    4.2 Else return  {msg: []}

app.get("/get_prompt_list", authenticateInternal(), async (req, res) => {
  try {
    // WRITE
    //      YOUR
    //          CODE
    //              HERE.
  } catch (error) {
    console.error(error);
    res.json({
      msg: "There was some issue with fetching prompt list. Check server logs",
    });
  }
});

app.get("/get_prompt_id", authenticateInternal(), async (req, res) => {
  try {
    const { email } = req.user;
    const data = await crudOperations.getPromptId(email);

    if (data != null && data !== false) {
      // console.log("Fetched Data Successfully");
      res.json({ msg: data[0].id });
    } else {
      res.json({ msg: [] });
    }
  } catch (error) {
    console.error(error);
    res.json({
      msg: "There was some issue with fetching prompt ID. Check server logs",
    });
  }
});

app.post("/create_user", async (req, res) => {
  try {
    // Parse the data from the request
    let { firstname, lastname, emailId, password, role } = req.body;

    // Check if user exists or not
    const userExists = await crudOperations.checkUser(
      emailId,
      firstname,
      lastname,
      password,
      role
    );

    console.log(userExists);
    if (userExists !== null) {
      if (userExists === false) {
        // Call the operation to create the user
        // Password Encrypted at dbFunctions.js
        const createUserResult = await crudOperations.createUser(
          firstname,
          lastname,
          emailId,
          password,
          role
        );

        if (createUserResult === true) {
          console.log(`User Created with email id ${emailId}`);
          res.json({ msg: true });
        } else {
          res.json({ msg: false });
        }
      } else {
        // If userExists is not false, send the data to frontend
        console.log(`Problems Creating a new user as:- ${userExists}`);
        res.json({ msg: false });
      }
    } else {
      console.log("Error while checking user existence.");
      res.json({ msg: false });
    }
  } catch (error) {
    console.error("Error while creating user:", error);
    res.json({ msg: "Error While Creating User" });
  }
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.redirect("/dashboard");
});

// TO DO - Add Authentication for this route. If not authenticated respond with this json - {"msg" : false}
// 1. Add a middleware to handle authentication
// 2. The middleware files have been already created for you.
// 3. Figure out based on funtionality which will be appropriate to be used here.
// 4. Look out at crudOperations file to look at appropriate function and check its function signature.
// 5. Now pass the extracted fields from the requests' body to the function.
// 6. Handle the result as following:
//    6.1. If result is true return a json response as {msg: true}
//    6.2. Else return {msg: false}
app.post("/update_user", async (req, res) => {
  try {
    let { firstname, lastname, emailId } = req.body;

    // const result = replaceFunctionHere(a, b, c);
    // WRITE
    //      YOUR
    //          CODE
    //              HERE.
  } catch (error) {
    console.log(error);
    res.json({
      msg: "Error While Updating User. See Server Logs for Details",
    });
  }
});

// TO DO - Add Authentication for this route. If not authenticated respond with this json - {"msg" : false}
// 1. Add a middleware to handle authentication
// 2. The middleware files have been already created for you.
// 3. Figure out based on funtionality which will be appropriate to be used here.
app.post("/create_user_prompt", async (req, res) => {
  try {
    const { prompt } = req.body;
    const { name, email } = req.user;

    const result = await crudOperations.createPrompt(name, prompt, email);

    if (result === true) {
      console.log(`Added prompt for email id ${email}`);
      res.json({ msg: true });
    } else {
      console.log(`Unable to add new prompt`);
      console.log(result);
      res.json({ msg: result });
    }
  } catch (error) {
    console.error(error);
    res.json({
      msg: "Error While Creating New Prompt. See Server Logs for Details",
    });
  }
});

// TO DO - Add Authentication for this route. If not authenticated respond with this json - {"msg" : false}
// 1. Add a middleware to handle authentication
// 2. The middleware files have been already created for you.
// 3. Figure out based on funtionality which will be appropriate to be used here.
app.put("/update_user_prompt/:id", replaceHere(), async (req, res) => {
  try {
    // TO DO - Add Authentication for this route
    // Check if the user has permissions (proper role) to approve / complete the request
    // If user has permissions then proceed else return json: {"msg": false}

    const id = req.params.id;
    const updatedPrompt = req.body.prompt; // Extract the updated prompt from the request body

    const isUpdated = await crudOperations.updatePrompt(id, updatedPrompt);

    if (isUpdated) {
      console.log(`Updated Prompt for id -> ${id}`);
      console.log(req.body);
      res.json({ msg: true });
    } else {
      console.log(`Failed to update request for id -> ${id}`);
      res.json({ msg: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "There was some issue in updating the prompt. Check server logs.",
    });
  }
});

// TO DO - Add Authentication for this route. If not authenticated respond with this json - {"msg" : false}
// 1. Add a middleware to handle authentication
// 2. The middleware files have been already created for you.
// 3. Figure out based on funtionality which will be appropriate to be used here.
app.delete("/delete_user_prompt/:id", replaceHere(), async (req, res) => {
  try {
    // TO DO - Add Authentication for this route
    // Check if the user has permission's (proper role) to cancel the request
    // If user has permissions then proceed else return json: {"msg": false}

    const cancellationResult = await crudOperations.deletePrompt(req.params.id);

    if (cancellationResult === true) {
      console.log(`Deleted prompt for id -> ${req.params.id}`);
      res.json({ msg: true });
    } else {
      console.log(cancellationResult);
      res.json({ msg: false });
    }
  } catch (error) {
    console.error(error);
    res.json({
      msg: "There was an issue in deleting the prompt. Check server logs",
    });
  }
});

app.delete("/delete_all_prompts", authenticateInternal(), async (req, res) => {
  try {
    const cancellationResult = await crudOperations.deleteAllPrompts();

    if (cancellationResult === true) {
      res.json({ msg: true });
    } else {
      console.log(cancellationResult);
      res.json({ msg: false });
    }
  } catch (error) {
    console.error(error);
    res.json({
      msg: "There was an issue in deleting the prompt. Check server logs",
    });
  }
});

app.delete("/delete_all_users", authenticateInternal(), async (req, res) => {
  try {
    const cancellationResult = await crudOperations.deleteAllUsers();

    if (cancellationResult === true) {
      res.json({ msg: true });
    } else {
      console.log(cancellationResult);
      res.json({ msg: false });
    }
  } catch (error) {
    console.error(error);
    res.json({
      msg: "There was an issue in deleting the prompt. Check server logs",
    });
  }
});

// Application setup / entry to create a server on a port which is given as an argument
app.listen(port, () => {
  console.log(`Server Up and Listening at http://localhost:${port}/`);
});
