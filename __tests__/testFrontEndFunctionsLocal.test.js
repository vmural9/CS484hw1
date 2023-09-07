import { chromium } from "playwright";
import { Page } from "@playwright/test";
import { expect, beforeAll, afterAll, test } from "vitest";
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

let browser;
let page;
let dbConn;

let optionsForFetch = {
  method: "GET",
  headers: {
    cookie: "",
  },
};

function getRandomText() {
  return "Random Text " + Math.random().toString(36).substring(7);
}

beforeAll(async () => {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto("http://localhost:3000/");
  // page.on("console", (message) => {
  //   console.log(`Console [${message.type()}]: ${message.text()}`);
  // });

  dbConn = await sqlite.open({
    filename: `./database/HW1_DB.db`,
    driver: sqlite3.Database,
  });

  if (dbConn != undefined) {
    // console.log("Connected to Database for TEsting");
  }
}, 60000);

afterAll(async () => {
  await browser.close();
  if (dbConn != undefined) {
    // // console.log("Connected to Database for Testing")
  }
  // console.log("Erasing data from prompt_history Table")
  await dbConn.run("DELETE FROM prompt_history", []);
  await dbConn.run("DELETE FROM users", []);
});

test("(2 pts) Create User and Login", async () => {
  // Open the login page
  await page.click('a[href="/create-user"]');

  // Fill out the user creation form
  await page.fill("#firstname", "Testing User");
  await page.fill("#lastname", "484");
  await page.fill("#emailId", "testing@testing.com");
  await page.fill("#password", "123456789");
  await page.selectOption("#role-selector", "Admin");

  // Click the "Submit" button
  await page.click("#createUserButton");

  await page.waitForSelector("#msg-for-failure-sucess");
  const successMessage = await page.textContent("#msg-for-failure-sucess");
  // console.log("Message", successMessage);
  expect(successMessage).toContain("Successfully created user");

  // Now navigate back to the login page
  await page.click("#goLoginButton");
  // console.log(await page.content());

  // Fill out the login form
  await page.fill("#emailId", "testing@testing.com");
  await page.fill("#password", "123456789");

  // Click the "Login" button
  await page.click("#loginButton");
  await page.waitForNavigation();
  // console.log(await page.content());
});

test("(2 pts) Create a single new Prompt", async () => {
  const randomText = getRandomText();
  await page.fill("input", randomText);

  // Click the submit button
  await page.click("#submit");

  // Wait for history to update (assuming it's an AJAX update)
  await page.waitForSelector(".chat-entry");

  const historyEntries = await page.$$(".chat-entry");

  // Check if the random text appears in any history entry
  let found = false;
  for (const entry of historyEntries) {
    const text = await entry.$eval("p", (el) => el.textContent);
    if (text === randomText) {
      found = true;
      break;
    }
  }
  expect(found).toBe(true);
});

test("(3 pts) Create a second Prompt. Check for total prompts", async () => {
  const newPrompt = getRandomText();
  await page.fill("input", newPrompt);

  // Click the submit button
  await page.click("#submit");
  // Wait for history to update (assuming it's an AJAX update)
  await page.waitForTimeout(500);
  await page.waitForSelector(".chat-entry");

  const historyEntries = await page.$$(".chat-entry");

  // Check if the new prompt appears in any history entry
  let newPromptFound = false;
  for (const entry of historyEntries) {
    const text = await entry.$eval("p", (el) => el.textContent);
    if (text === newPrompt) {
      newPromptFound = true;
      break;
    }
  }
  const totalPrompts = historyEntries.length;
  expect(newPromptFound).toBe(true);
  expect(totalPrompts).greaterThan(1);
});

test("(3 pts) Edit and update a prompt from history", async () => {
  // Assuming the history already has some entries
  const historyEntries = await page.$$(".chat-entry");

  if (historyEntries.length === 0) {
    console.log("No history entries to test.");
    return;
  }

  // Click on the first history entry to edit
  const firstEntry = historyEntries[0];
  const clickedEntryId = await firstEntry.evaluate((entry) =>
    entry.getAttribute("data-id")
  );
  await firstEntry.click(); // Assuming clicking triggers the edit action

  // Wait for the input field to be populated
  await page.waitForFunction(
    () => document.querySelector("input").value !== ""
  );

  // Update the input field
  const updatedText = "Incoming Updated text W";
  await page.fill("input", updatedText);

  // Click the submit button
  await page.click("#submit");
  await page.waitForTimeout(500);
  // Wait for history to update (assuming it's an AJAX update)
  await page.waitForSelector(".chat-entry");

  // Check if the updated prompt appears in the history and the data-id matches
  const updatedPromptFound = await page.evaluate(
    ({ clickedId, updatedText }) => {
      const historyEntries = document.querySelectorAll(".chat-entry");
      for (const entry of historyEntries) {
        const entryText = entry.querySelector("p").textContent;
        const entryId = entry.getAttribute("data-id");
        if (entryText === updatedText && entryId === clickedId) {
          return true;
        }
      }
      return false;
    },
    { clickedId: clickedEntryId, updatedText }
  );

  expect(updatedPromptFound).toBe(true);
});

test("(3 pts) Delete a prompt from history", async () => {
  // Assuming the history already has some entries
  const historyEntries = await page.$$(".chat-entry");

  if (historyEntries.length === 0) {
    console.log("No history entries to test.");
    return;
  }

  // Click on the first history entry's delete button
  const firstEntry = historyEntries[0];
  const clickedEntryId = await firstEntry.evaluate((entry) =>
    entry.getAttribute("data-id")
  );
  const deleteButton = await firstEntry.$("button");
  await deleteButton.click(); // Assuming clicking the delete button
  await page.waitForTimeout(500);

  // Wait for history to update (assuming it's an AJAX update)
  await page.waitForFunction(
    (clickedId) => !document.querySelector(`[data-id="${clickedId}"]`),
    {},
    clickedEntryId
  );

  // Check if the deleted prompt no longer appears in the history
  const deletedPromptExists = await page.evaluate((clickedId) => {
    const entry = document.querySelector(`[data-id="${clickedId}"]`);
    return entry !== null;
  }, clickedEntryId);

  expect(deletedPromptExists).toBe(false);
});
