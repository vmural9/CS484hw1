let request = require("supertest");
import { website } from "../student.json";
const requestLive = request(website);
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
  const res1 = await requestLive
    .post("/create_user")
    .set("Content-type", "application/json")
    .send(payload);
}, 60000);

afterAll(async () => {
  // console.log("Erasing data from prompt_history Table");
});

test("(1 pts) Live Test for Authentication (Not Logged-in ) - /update-user ", async function () {
  const response = await requestLive.get("/update-user");
  expect(response.status).toBe(302);
  expect(response.headers.location).toBe("/");
});

test("(1 pts) Live Test for Authentication (Not Logged-in ) - /dashboard ", async function () {
  const response = await requestLive.get("/dashboard");
  expect(response.status).toBe(302);
  expect(response.headers.location).toBe("/");
});

test("(1 pts) Live Test for Authentication (Not Logged-in ) - /get_prompt_list ", async function () {
  const response = await requestLive.get("/get_prompt_list");
  expect(response.text).toBe('{"msg":false}');
});

// POST
test("(1 pts) Live Test for Authentication (Not Logged-in ) - /update_user ", async function () {
  const response = await requestLive.post("/update_user");
  expect(response.text).toBe('{"msg":false}');
});

test("(1 pts) Live Test for Authentication (Not Logged-in ) - /create_user_prompt ", async function () {
  const response = await requestLive.post("/create_user_prompt");
  expect(response.text).toBe('{"msg":false}');
});

test("(1 pts) Live Test for Authentication (Not Logged-in ) - /update_user_prompt ", async function () {
  const response = await requestLive.put("/update_user_prompt/1");
  expect(response.text).toBe('{"msg":false}');
});

test("(1 pts) Live Test for Authentication (Not Logged-in ) - /delete_user_prompt ", async function () {
  const response = await requestLive.delete("/delete_user_prompt/2");
  expect(response.text).toBe('{"msg":false}');
});

test("(2 pts) Live Test for logging-in - /login", async function () {
  const payload = JSON.stringify({
    emailId: "admin@mail.com",
    password: "password123",
  });
  const response = await requestLive
    .post("/login")
    .set("Content-type", "application/json")
    .send(payload);

  expect(response.status).toBe(302);
  expect(response.headers.location).toBe("/dashboard");
});

test("(2 pts) Live Test after logging-in - /update-user", async function () {
  const loginCookieAdmin = await getLoginCookie();
  const response = await requestLive
    .get("/update-user")
    .set("Cookie", [loginCookieAdmin]);
  expect(response.text).toEqual(
    expect.stringContaining("Update User Information")
  );
});

test("(2 pts) Live Test after logging-in - Creating a new prompt", async function () {
  const loginCookieAdmin = await getLoginCookie();

  const payload = {
    email: "admin@mail.com",
    name: "AdminFirstName AdminLastName",
    prompt: "If you read this in Code. You are close! <3",
  };
  const response = await requestLive
    .post("/create_user_prompt")
    .set("Cookie", [loginCookieAdmin])
    .set("Content-type", "application/json")
    .send(payload);

  expect(response.text).toBe('{"msg":true}');

  // Check if the user was created in the database
});

// Cancel Request as a admin and the try doing the same with customer
test("(3 pts) Live Test after logging-in - /update_user_prompt", async function () {
  // Create a new prompt
  const promptId = await createNewPrompt("admin@mail.com");
  // console.log(promptId);
  // Get Cookies
  const loginCookieAdmin = await getLoginCookie();

  let payload = {
    prompt: "Updating the Prompt!",
  };
  const response = await requestLive
    .put(`/update_user_prompt/${promptId}`)
    .set("Cookie", [loginCookieAdmin])
    .set("Content-type", "application/json")
    .send(payload);

  expect(response.text).toBe('{"msg":true}');
});

test("(3 pts) Live Test after logging-in - /delete_user_prompt", async function () {
  const promptId = await createNewPrompt("admin@mail.com");

  // Get Cookies
  const loginCookieAdmin = await getLoginCookie();

  const response = await requestLive
    .delete(`/delete_user_prompt/${promptId}`)
    .set("Cookie", [loginCookieAdmin]);

  expect(response.text).toBe('{"msg":true}');
});

async function createNewPrompt(email) {
  const loginCookieAdmin = await getLoginCookie();

  const payload = {
    email: email,
    name: "AdminFirstName AdminLastName",
    prompt: "Were you really believing that. Commonnn! <3",
  };

  const response = await requestLive
    .post("/create_user_prompt")
    .set("Cookie", [loginCookieAdmin])
    .set("Content-type", "application/json")
    .send(payload);

  const responseID = await requestLive
    .get("/get_prompt_id")
    .query({ email: email })
    .set("Cookie", [loginCookieAdmin]);

  const ID = JSON.parse(responseID.text).msg;
  return ID;
}

async function getLoginCookie() {
  const payload = JSON.stringify({
    emailId: "admin@mail.com",
    password: "password123",
  });
  var response = await requestLive
    .post("/login")
    .set("Content-type", "application/json")
    .send(payload);
  let cookieTemp = response.headers["set-cookie"][0];
  return (cookieTemp = cookieTemp.split(";")[0]);
}
