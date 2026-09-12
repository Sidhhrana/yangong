import assert from "node:assert/strict";
import { test } from "node:test";
import { assertGoAttempt, assertGoTask, canGoTask } from "./machine.ts";

test("Task cannot jump judging → closed", () => {
  assert.throws(() => assertGoTask("judging", "closed"));
});

test("Task cannot jump accepted → closed (must settle)", () => {
  assert.throws(() => assertGoTask("accepted", "closed"));
});

test("Task judging → accepted is allowed", () => {
  assert.equal(assertGoTask("judging", "accepted"), "accepted");
});

test("Attempt cannot jump provisional → accepted", () => {
  assert.throws(() => assertGoAttempt("provisional", "accepted"));
});

test("Attempt verifying → failed is allowed", () => {
  assert.equal(assertGoAttempt("verifying", "failed"), "failed");
});

test("Attempt passed → stability is allowed", () => {
  assert.equal(assertGoAttempt("passed", "stability"), "stability");
});

test("Task cannot reopen from closed", () => {
  assert.equal(canGoTask("closed", "open"), false);
});
