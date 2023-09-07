let request = require("supertest");
const requestLocal = request("http://localhost:3000");
import { beforeAll, afterAll, test, expect } from "vitest";
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

let dbConn;

beforeAll(async () => {
  // console.log("Creating User For testing");
  let payload = {
    emailId: "admin@mail.com",
    firstname: "AdminFirstName",
    lastname: "AdminLastName",
    password: "password123",
    role: "worker",
  };
  const res1 = await requestLocal
    .post("/create_user")
    .set("Content-type", "application/json")
    .send(payload);

  dbConn = await sqlite.open({
    filename: `./database/HW1_DB.db`,
    driver: sqlite3.Database,
  });
  if (dbConn != undefined) {
    // console.log("Connected to Database for TEsting");
  }
});

afterAll(async () => {
  // console.log("Erasing data from prompt_history Table");
  // await dbConn.run("DELETE FROM prompt_history", []);
  dbConn.close((err) => {
    if (err) {
      console.error("Error closing the database:", err.message);
    } else {
      console.log("Database connection closed");
    }
  });
});

test("(1 pts) Test for Authentication (Not Logged-in ) - /update-user ", async function () {
  const response = await requestLocal.get("/update-user");
  expect(response.status).toBe(302);
  expect(response.headers.location).toBe("/");
});

test("(1 pts) Test for Authentication (Not Logged-in ) - /dashboard ", async function () {
  const response = await requestLocal.get("/dashboard");
  expect(response.status).toBe(302);
  expect(response.headers.location).toBe("/");
});

test("(1 pts) Test for Authentication (Not Logged-in ) - /get_prompt_list ", async function () {
  const response = await requestLocal.get("/get_prompt_list");
  expect(response.text).toBe('{"msg":false}');
});

// POST
test("(1 pts) Test for Authentication (Not Logged-in ) - /update_user ", async function () {
  const response = await requestLocal.post("/update_user");
  expect(response.text).toBe('{"msg":false}');
});

test("(1 pts) Test for Authentication (Not Logged-in ) - /create_user_prompt ", async function () {
  const response = await requestLocal.post("/create_user_prompt");
  expect(response.text).toBe('{"msg":false}');
});

test("(1 pts) Test for Authentication (Not Logged-in ) - /update_user_prompt ", async function () {
  const response = await requestLocal.put("/update_user_prompt/1");
  expect(response.text).toBe('{"msg":false}');
});

test("(1 pts) Test for Authentication (Not Logged-in ) - /delete_user_prompt ", async function () {
  const response = await requestLocal.delete("/delete_user_prompt/2");
  expect(response.text).toBe('{"msg":false}');
});

test("(2 pts) Test for logging-in - /login", async function () {
  const payload = JSON.stringify({
    emailId: "admin@mail.com",
    password: "password123",
  });
  const response = await requestLocal
    .post("/login")
    .set("Content-type", "application/json")
    .send(payload);

  expect(response.status).toBe(302);
  expect(response.headers.location).toBe("/dashboard");
});

test("(2 pts) Test after logging-in - /update-user", async function () {
  const loginCookieAdmin = await getLoginCookie();
  const response = await requestLocal
    .get("/update-user")
    .set("Cookie", [loginCookieAdmin]);
  expect(response.text).toEqual(
    expect.stringContaining("Update User Information")
  );
});

test("(2 pts) Test after logging-in - Creating a new prompt", async function () {
  const loginCookieAdmin = await getLoginCookie();

  const payload = {
    email: "admin@mail.com",
    name: "AdminFirstName AdminLastName",
    prompt: "If you read this in Code. You are close! <3",
  };
  const response = await requestLocal
    .post("/create_user_prompt")
    .set("Cookie", [loginCookieAdmin])
    .set("Content-type", "application/json")
    .send(payload);

  expect(response.text).toBe('{"msg":true}');

  // Check if the user was created in the database
  const dbRes = await dbConn.get(
    "Select id from prompt_history where email=?",
    ["admin@mail.com"]
  );
  const dbRes1 = await dbConn.get("Select * from prompt_history where id=?", [
    dbRes.id,
  ]);
  expect(dbRes1).not.toBeUndefined();
});

test("(3 pts) Test after logging-in - /update_user_prompt", async function () {
  // Create a prompt
  const promptId = await createNewPrompt("admin@mail.com");
  // console.log(promptId);
  // Get Cookies
  const loginCookieAdmin = await getLoginCookie();

  let payload = {
    prompt: "Updating the Prompt!",
  };
  const response = await requestLocal
    .put(`/update_user_prompt/${promptId}`)
    .set("Cookie", [loginCookieAdmin])
    .set("Content-type", "application/json")
    .send(payload);

  expect(response.text).toBe('{"msg":true}');

  // Fetch the result about this request from the database to check if was reflected there
  const dbRes1 = await dbConn.get("Select * from prompt_history where id=?", [
    promptId,
  ]);
  expect(dbRes1.prompt).equals(payload.prompt);
});

test("(3 pts) Test after logging-in - /delete_user_prompt", async function () {
  const promptId = await createNewPrompt("admin@mail.com");

  // Get Cookies
  const loginCookieAdmin = await getLoginCookie();

  const response = await requestLocal
    .delete(`/delete_user_prompt/${promptId}`)
    .set("Cookie", [loginCookieAdmin]);

  expect(response.text).toBe('{"msg":true}');

  const dbRes = await dbConn.get("Select * from prompt_history where id=?", [
    promptId,
  ]);
  expect(dbRes).toBeUndefined();
});

async function createNewPrompt(email) {
  const loginCookieAdmin = await getLoginCookie();

  const payload = {
    email: email,
    name: "AdminFirstName AdminLastName",
    prompt: "Were you really believing that. Commonnn! <3",
  };

  const response = await requestLocal
    .post("/create_user_prompt")
    .set("Cookie", [loginCookieAdmin])
    .set("Content-type", "application/json")
    .send(payload);

  const dbRes = await dbConn.get(
    "Select id from prompt_history where email=?",
    [email]
  );
  // console.log(dbRes);
  return dbRes.id;
}

async function getLoginCookie() {
  const payload = JSON.stringify({
    emailId: "admin@mail.com",
    password: "password123",
  });
  var response = await requestLocal
    .post("/login")
    .set("Content-type", "application/json")
    .send(payload);
  let cookieTemp = response.headers["set-cookie"][0];
  return (cookieTemp = cookieTemp.split(";")[0]);
}
