// This file contains unit tests for functions inside the serverFunction.js file

import { test, expect } from "vitest";
const serverFunctions = require("../serverFunctions.js");

// UPDATE
// Changing checkUserName to CheckString as there is not function named checkUserName

test("(1 pts) Check Username", () => {
  expect(serverFunctions.checkUserName("SomeName")).toBe(true);
  expect(serverFunctions.checkUserName("      ")).toBe(false);
});

test("(1 pts) Check Password Length", () => {
  expect(serverFunctions.checkPasswordLength("12345678")).toBe(true);
  expect(serverFunctions.checkPasswordLength("123456")).toBe(false);
});

test("(1 pts) Check Email ID", () => {
  expect(serverFunctions.checkEmailId("@.")).toBe(false);
  expect(serverFunctions.checkEmailId("string@string")).toBe(false);
  expect(serverFunctions.checkEmailId("string@string.string")).toBe(true);
  expect(serverFunctions.checkEmailId("string@string.string.string")).toBe(
    true
  );
});
