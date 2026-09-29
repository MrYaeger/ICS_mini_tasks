#!/usr/bin/env node
/*
 * test.js — Node command-line runner for the JavaScript Mini Task suite.
 * (The teacher's tool. Students self-check in the browser with runner.html.)
 *
 *   Single:  node test.js <student.js> <tests/some_task.test.js>
 *   Batch:   node test.js --batch <folder_of_submissions> <tests/some_task.test.js>
 *
 * The student writes plain top-level function declarations, e.g.
 *      function isLeapYear(year) { ... }
 * in a single self-contained .js file. No exports or boilerplate required.
 */
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");
var Harness = require("./harness.js");

function usage() {
  console.log("Usage:");
  console.log("  node test.js <student.js> <tests/task.test.js>");
  console.log("  node test.js --batch <submissions_folder> <tests/task.test.js>");
}

// Run a student's file in an isolated sandbox and return that sandbox.
// Top-level `function name(){}` declarations attach to the sandbox global,
// so we can look them up by name (just like Python's get_from_module).
function loadStudent(file) {
  var code = fs.readFileSync(file, "utf8");
  var sandbox = {
    console: console, Math: Math, JSON: JSON, Date: Date,
    Number: Number, String: String, Boolean: Boolean, Array: Array, Object: Object,
    parseInt: parseInt, parseFloat: parseFloat, isNaN: isNaN, isFinite: isFinite
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: path.basename(file), timeout: 3000 });
  return sandbox;
}

function loadTests(testFile) {
  var mod = require(path.resolve(testFile));
  if (typeof mod.runTests !== "function") {
    throw new Error("Test file must define runTests(runner) and export it.");
  }
  return mod.runTests;
}

function runOne(studentFile, runTests) {
  var sandbox = loadStudent(studentFile);
  var runner = Harness.createRunner(function (name) { return sandbox[name]; });
  runTests(runner);
  return runner;
}

function printBatch(rows, testFile) {
  console.log("=".repeat(64));
  console.log("BATCH RESULTS  (" + path.basename(testFile) + ")");
  console.log("=".repeat(64));
  var widest = rows.reduce(function (m, r) { return Math.max(m, r.file.length); }, 4);
  rows.sort(function (a, b) { return a.file.localeCompare(b.file); });
  rows.forEach(function (r) {
    var name = r.file.padEnd(widest, " ");
    if (r.error) { console.log(name + "   ERROR: " + r.error); return; }
    var pct = r.run ? (r.passed / r.run * 100).toFixed(0) : "0";
    console.log(name + "   " + r.passed + "/" + r.run + "  (" + pct + "%)");
  });
  console.log("=".repeat(64));
}

function main() {
  var args = process.argv.slice(2);

  if (args[0] === "--batch") {
    var dir = args[1], testFile = args[2];
    if (!dir || !testFile) { usage(); process.exit(1); }
    var runTests = loadTests(testFile);
    var files = fs.readdirSync(dir).filter(function (f) { return f.endsWith(".js"); });
    var rows = files.map(function (f) {
      try {
        var runner = runOne(path.join(dir, f), runTests);
        var s = runner.summary();
        return { file: f, passed: s.passed, run: s.run };
      } catch (e) {
        return { file: f, passed: 0, run: 0, error: e.message };
      }
    });
    printBatch(rows, testFile);
    process.exit(0);
  }

  var studentFile = args[0], tFile = args[1];
  if (!studentFile || !tFile) { usage(); process.exit(1); }

  var runTestsFn;
  try { runTestsFn = loadTests(tFile); }
  catch (e) { console.log("ERROR loading test file: " + e.message); process.exit(1); }

  var runner;
  try { runner = runOne(studentFile, runTestsFn); }
  catch (e) { console.log("ERROR running your code: " + e.message); process.exit(1); }

  console.log(Harness.formatSummary(runner));
  var s = runner.summary();
  process.exit(s.passed === s.run ? 0 : 1);
}

main();
