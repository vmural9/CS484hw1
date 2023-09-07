---
title: homework 1 - crud apps
description: Express + SQLite
due: 2023-09-08T13:59:00-5:00
github_link: https://classroom.github.com/a/8Hso8Pyq
release: 2023-08-28
---

# Homework1 - Crud App

This Homework is about provisioning a CRUD App that is provided to you with a session based authentication using passport.js. Once you are done, please submit the github repository on Gradescope. By the end of this assignment you will be having your own Vanilla 484-GPT ready on the internet.

## Overview

Homework1 is a Vanilla-JS clone for a full stack ChatGPT application. You are required to complete few routes on server-end and write up logic for some JS functions for the front-end.

The webapplication that is provided to you has the following features -

1. Create a user ('/create_user')
2. Update user details ('/update_user')
3. Login ('/login')
4. Create a new prompt ('/create_user_prompt')
5. Update a user prompt ('/update_user_prompt').
6. Delete a user prompt ('/delete_user_prompt').

The application maintains a SQLite database facilitating authentication and preserving history of user generated prompts.

Checkout 'Exploring the webapplication' section on details about the functionality of webapp.

## Pre-requisite

Please have `Node.js` installed for starting this project. For installing `Node.js` checkout this webpage https://nodejs.org/en/ and download the LTS version of Node.js for your laptop.

## Cloning your homework assignment

[This GitHub Classroom link](https://classroom.github.com/a/8Hso8Pyq) will allow you to accept the assignment.

## Installing required packages

Open the terminal window and type in `npm install`. This will install all the dependencies listed in the `package.json` file and will create a folder `node_modules` where all these dependencies will be installed. This will also setup the database `HW1_DB.db` in the folder `database`. To start the server, type in `npm start` or `node server.js` and this should start the server and log following messages on the console.

```
Server Up and Listening at http://localhost:3000/
Connected to the database HW1_DB.db

```

For stopping Nodejs application, press Ctrl + c
You can also setup nodemon for easier development See here [https://www.npmjs.com/package/nodemon]

## Project Details

This homework uses ExpressJS for quick and easy server setup along with SQlite to store user data and credentials(in encrypted format). Please find below information on different files / directories used in this HW.

1. server.js - Main file used to start/ stop server. This file contains all the endpoints (GET, POST, PUT, DELETE) and the middlewares useful for setting session-based authentication
2. serverFunctions.js - Helper file containing functions for validations of user input (name, emailId, password)
3. package.json - JSON file containing information about the project, dependencies, starter commands, etc
4. .gitignore - Contains information on what should be ignored from the local project while uploading to Git Repository

#### New Files Used for setting Passport.js and Database connection and delivering JS over browser.

5. passportAuth.js (**IMPORTANT FILE**) - File containing implementation for local strategy and functions to serialize and deserialize the user data
6. dbFunctions.js - Database connection and SQL Statements for performing CRUD Operations
7. crudOperationsFunctions.js - Intermediate file containing functions which will call functions in 'dbFunctions.js'. This approach is helpful to do any sanity checks/ data manipulation before hitting database queries
8. views folder - The views folder contains all the .html pages that are used for this web application
9. public folder - contains all the JS enabling frontend logics and styling

## Exploring the webapplication

- Consider this web application as a simple clone for ChatGPT aka GPT-484. It's a webapp where a user may create a new account, authenticate and login to the dashboard.
- Once over the dashboard, the user can create new prompt and see the prompt getting added to the history pane.
- History pane allows the user to edit and delete an existing prompt.
- Clicking on a particular prompt (say PromptX )on the history pane in left, populates the prompt in the input and any updates made to the prompt are then reflected to the same prompt (PromptX).

Once you are successfully able to start the server, go to the landing page by accessing 'http://localhost:3000/' page. Please replace the `port` with the port that you have used to setup the server. If you are able to see this page, you have successfully started the application. Start by creating a user

1. Create a user by accessing 'http://localhost:3000/create-user'. There are two types of user - admin and users. There is no difference in functionality for the two and there is no impact on chosing either of it for this assignment.
2. Once the user is created, Login using those credentials. This should take you to the dashboard. Note - With the code provided you would be able to login with the created email and password. However you may still be able to visit the /dashboard page as routes are not properly setup. Look into server.js for additional comments.
3. Create a user prompt in the input bar at the bottom.
4. Once you click the send button or press enter, the entered prompt should come up over the history pane in the left.
5. You can edit a prompt, delete a prompt as defined in the introduction of this section.

Note - For any issues encountered on the web pages, check the server logs for more details. Also, if you want to start with clean database, delete the `HW1_DB.db` file inside the `database` folder and run `npm install` again.

## ToDo For HW1

1. The heavy work of setting up the authentication has been done for you. You do not need to create or manage any sessions. Also certain middlewares have been provided for you for your assist.
   Your task to just use the appropriate middleware to complete the functionality as asked. You need to modify `server.js` to enable session based authentication and update the code to make the routes completely functional. Check the `TO DO` section in those files along with more comments for the specifics.
   - Try to understand the logic in server.js.
   - Look for other routes how are they being implemented and seek any reference that can be helpful for you.
2. Apart from that, you also have to complete the `populateHistory()` function inside the `./public/dashboardHandler.js` file. This functions is used to fetch all your user prompts and display them over the dashboard.

## Checking your work

### Running testcases locally

- Run `npm run test`. Vitest should start and give you details of the testcases/testfiles passing / failing.
  Once you have completed with your work , you should be able to create a user and login. Once you login, the `req.session`, should have an extra passport entry. This confirms that you are able to authenticate using passport.js. Visit other routes and see if you able to access them. Now logout of the application and try directly accessing a route where you have set-up/completed authentication (e.g. http://localhost:3000/dashboard). This should take you to the `login` page.

To check `populateHistory()`, go to `/dashboard` by logging in and then create some prompts. This should list all the prompts you have created ( plus any previous ones if any ). Now press delete on any prompt and you shouldn't be able to view that same prompt.

Try editing an existing prompt by clicking on the prompt. The prompt gets loaded in the input bar. Make any update to the prompt in the input bar and click send button or press enter. You should be able to see the updated prompt in realtime.

## Deploying your Application.

- We will be using Render for deploying our WebApplication.
- Create an account over Render.com and connect your Github repository with Render.
- Select New option and then chose Web Service.
- Connect your repository.
- Write a name for your Service and under the Build command, `update yarn to npm install`
- Once deployed you will get the hosted APP URL.
- Take this URL and update this in student.json.

## Submitting your work

After you are confident that your code works, you can push the code to GitHub, and then submit it via Gradescope. You can find the link to our class gradescope at the bottom of this page. If you have issues with the autograder, please contact us via Piazza ASAP. **Please keep in mind that technical issues while submitting your assignment is not an acceptable excuse for improper or late submissions.**

## Points

| Task                                                                 | Points |
| -------------------------------------------------------------------- | ------ |
| Setting up routes for server (adding middlewares, completing routes) | 19     |
| Server Functionality working over hosted website                     | 19     |
| Completing server helper functions                                   | 3      |
| Completing front-end JS functions and validating front-end flow      | 13     |
| Front-end functionality working over hosted website                  | 13     |

## Due Date

This assignment is due at 11:59 PM on Friday, September 08th. Extra credit in the course is available for anyone who writes meaningful test cases and submits them to the TA by Sunday, September 3rd.
