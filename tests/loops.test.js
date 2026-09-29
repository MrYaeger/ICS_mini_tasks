/*
 * Task Set: Loops (for, while, forEach)
 * ---
 * Three tasks at different difficulty levels. Pick at least one.
 *
 * EASY: Print the first N multiples of 3
 * MEDIUM: Sum the numbers from 1 to N
 * HARD: Print a multiplication table
 */

// ============================================================================
// EASY: Multiples of 3
// ============================================================================
/*
 * Write a function:   function printMultiplesOf3(n)
 *   - takes a number `n`
 *   - prints the first n multiples of 3 (one per line via console.log)
 *   - returns nothing (or undefined)
 *
 * Example:  printMultiplesOf3(5) prints:
 *             3
 *             6
 *             9
 *             12
 *             15
 */
function runTests_printMultiplesOf3(runner) {
  runner.runTest("printMultiplesOf3 exists", function () {
    return typeof runner.getFn("printMultiplesOf3") === "function"
      ? [true, "Found printMultiplesOf3"]
      : [false, "Define it as:  function printMultiplesOf3(n) { ... }"];
  });
  if (typeof runner.getFn("printMultiplesOf3") !== "function") return;

  runner.runTest("printMultiplesOf3(5) prints 5 lines", function () {
    var fn = runner.getFn("printMultiplesOf3");
    var logs = runner.captureConsole(fn, [5])[0];
    return logs.length === 5 ? [true, "Printed 5 lines"] : [false, "Expected 5 lines, got " + logs.length];
  });

  runner.runTest("printMultiplesOf3(3) prints correct values", function () {
    var fn = runner.getFn("printMultiplesOf3");
    var logs = runner.captureConsole(fn, [3])[0];
    var expected = ["3", "6", "9"];
    for (var i = 0; i < expected.length; i++) {
      if (logs[i] !== expected[i]) {
        return [false, "Line " + (i + 1) + ": expected '" + expected[i] + "', got '" + logs[i] + "'"];
      }
    }
    return [true, "All 3 lines are correct"];
  });

  runner.runTest("printMultiplesOf3(1) prints just 3", function () {
    var fn = runner.getFn("printMultiplesOf3");
    var logs = runner.captureConsole(fn, [1])[0];
    return logs.length === 1 && logs[0] === "3" ? [true, "Printed '3'"] : [false, "Expected ['3'], got " + JSON.stringify(logs)];
  });
}

// ============================================================================
// MEDIUM: Sum 1 to N
// ============================================================================
/*
 * Write a function:   function sumTo(n)
 *   - takes a number `n`
 *   - returns the sum of all integers from 1 to n (inclusive)
 *   - use a loop to calculate it
 *
 * Example:  sumTo(5) → 1 + 2 + 3 + 4 + 5 = 15
 *           sumTo(3) → 1 + 2 + 3 = 6
 */
function runTests_sumTo(runner) {
  runner.runTest("sumTo exists", function () {
    return typeof runner.getFn("sumTo") === "function"
      ? [true, "Found sumTo"]
      : [false, "Define it as:  function sumTo(n) { ... }"];
  });
  if (typeof runner.getFn("sumTo") !== "function") return;

  runner.runTest("sumTo(5) = 15", function () { return runner.checkReturns("sumTo", [5], 15); });
  runner.runTest("sumTo(3) = 6", function () { return runner.checkReturns("sumTo", [3], 6); });
  runner.runTest("sumTo(1) = 1", function () { return runner.checkReturns("sumTo", [1], 1); });
  runner.runTest("sumTo(10) = 55", function () { return runner.checkReturns("sumTo", [10], 55); });
  runner.runTest("sumTo(0) = 0", function () { return runner.checkReturns("sumTo", [0], 0); });
  runner.runTest("returns a number", function () {
    var r = runner.getFn("sumTo")(5);
    return typeof r === "number" ? [true, "Returns a number"] : [false, "Expected a number, got " + typeof r];
  });
}

// ============================================================================
// HARD: Multiplication Table
// ============================================================================
/*
 * Write a function:   function printTimesTable(n)
 *   - takes a number `n`
 *   - prints the multiplication table for n (from 1×n to 12×n, one per line)
 *   - format each line as: "1 * n = result", "2 * n = result", etc.
 *
 * Example:  printTimesTable(3) prints:
 *             1 * 3 = 3
 *             2 * 3 = 6
 *             3 * 3 = 9
 *             ...
 *             12 * 3 = 36
 */
function runTests_printTimesTable(runner) {
  runner.runTest("printTimesTable exists", function () {
    return typeof runner.getFn("printTimesTable") === "function"
      ? [true, "Found printTimesTable"]
      : [false, "Define it as:  function printTimesTable(n) { ... }"];
  });
  if (typeof runner.getFn("printTimesTable") !== "function") return;

  runner.runTest("printTimesTable(2) prints 12 lines", function () {
    var fn = runner.getFn("printTimesTable");
    var logs = runner.captureConsole(fn, [2])[0];
    return logs.length === 12 ? [true, "Printed 12 lines"] : [false, "Expected 12 lines, got " + logs.length];
  });

  runner.runTest("printTimesTable(5) contains '1 * 5 = 5'", function () {
    var fn = runner.getFn("printTimesTable");
    var logs = runner.captureConsole(fn, [5])[0];
    var hasFirst = logs.some(function (line) { return /^\s*1\s*\*\s*5\s*=\s*5\s*$/.test(line); });
    return hasFirst ? [true, "Found '1 * 5 = 5'"] : [false, "Expected a line like '1 * 5 = 5'; first line was: " + JSON.stringify(logs[0])];
  });

  runner.runTest("printTimesTable(4) contains '12 * 4 = 48'", function () {
    var fn = runner.getFn("printTimesTable");
    var logs = runner.captureConsole(fn, [4])[0];
    var hasLast = logs.some(function (line) { return /^\s*12\s*\*\s*4\s*=\s*48\s*$/.test(line); });
    return hasLast ? [true, "Found '12 * 4 = 48'"] : [false, "Expected a line like '12 * 4 = 48'; last line was: " + JSON.stringify(logs[11])];
  });
}

// Node entry point (the browser dropdown calls the sub-task functions directly).
// Picks sub-tasks by the TASK env var ("all" runs everything); with no TASK set,
// it auto-detects: it runs whichever sub-task functions the student's file defines.
function runTests(runner) {
  var tasks = [
    ["printMultiplesOf3", runTests_printMultiplesOf3],
    ["sumTo", runTests_sumTo],
    ["printTimesTable", runTests_printTimesTable],
  ];
  var choice = (typeof process !== "undefined" && process.env) ? process.env.TASK : null;
  var toRun = tasks.filter(function (t) {
    if (choice === "all") return true;
    if (choice) return t[0] === choice;
    return typeof runner.getFn(t[0]) === "function";
  });
  if (toRun.length === 0) toRun = [tasks[0]]; // nothing found: run one for its friendly "define it as" message
  toRun.forEach(function (t) { t[1](runner); });
}

if (typeof module !== "undefined" && module.exports) { module.exports = { runTests: runTests }; }
else if (typeof registerTask === "function") {
  registerTask("Loops (Easy)", function (r) { runTests_printMultiplesOf3(r); });
  registerTask("Loops (Medium)", function (r) { runTests_sumTo(r); });
  registerTask("Loops (Hard)", function (r) { runTests_printTimesTable(r); });
}
