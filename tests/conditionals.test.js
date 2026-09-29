/*
 * Task Set: Conditionals (if / else)
 * ---
 * Three tasks at different difficulty levels. Pick at least one.
 *
 * EASY: Classify a grade as pass/fail
 * MEDIUM: Check voter eligibility by age
 * HARD: Categorize a number's sign (positive/negative/zero)
 */

// ============================================================================
// EASY: Pass or Fail
// ============================================================================
/*
 * Write a function:   function passOrFail(grade)
 *   - takes a number `grade` (0–100)
 *   - returns "pass" if grade >= 70, "fail" otherwise
 *
 * Example:  passOrFail(85) → "pass"
 *           passOrFail(60) → "fail"
 */
function runTests_passOrFail(runner) {
  runner.runTest("passOrFail exists", function () {
    return typeof runner.getFn("passOrFail") === "function"
      ? [true, "Found passOrFail"]
      : [false, "Define it as:  function passOrFail(grade) { ... }"];
  });
  if (typeof runner.getFn("passOrFail") !== "function") return;

  runner.runTest("85 is a pass", function () { return runner.checkReturns("passOrFail", [85], "pass"); });
  runner.runTest("70 is a pass (boundary)", function () { return runner.checkReturns("passOrFail", [70], "pass"); });
  runner.runTest("69 is a fail (boundary)", function () { return runner.checkReturns("passOrFail", [69], "fail"); });
  runner.runTest("0 is a fail", function () { return runner.checkReturns("passOrFail", [0], "fail"); });
  runner.runTest("100 is a pass", function () { return runner.checkReturns("passOrFail", [100], "pass"); });
  runner.runTest("returns a string", function () {
    var r = runner.getFn("passOrFail")(75);
    return typeof r === "string" ? [true, "Returns a string"] : [false, "Expected a string, got " + typeof r];
  });
}

// ============================================================================
// MEDIUM: Voter Eligibility
// ============================================================================
/*
 * Write a function:   function canVote(age)
 *   - takes a number `age`
 *   - returns "can vote" if age >= 18, else "too young to vote"
 *
 * Example:  canVote(25) → "can vote"
 *           canVote(16) → "too young to vote"
 */
function runTests_canVote(runner) {
  runner.runTest("canVote exists", function () {
    return typeof runner.getFn("canVote") === "function"
      ? [true, "Found canVote"]
      : [false, "Define it as:  function canVote(age) { ... }"];
  });
  if (typeof runner.getFn("canVote") !== "function") return;

  runner.runTest("25 can vote", function () { return runner.checkReturns("canVote", [25], "can vote"); });
  runner.runTest("18 can vote (boundary)", function () { return runner.checkReturns("canVote", [18], "can vote"); });
  runner.runTest("17 is too young (boundary)", function () { return runner.checkReturns("canVote", [17], "too young to vote"); });
  runner.runTest("0 is too young", function () { return runner.checkReturns("canVote", [0], "too young to vote"); });
  runner.runTest("100 can vote", function () { return runner.checkReturns("canVote", [100], "can vote"); });
}

// ============================================================================
// HARD: Classify a Number
// ============================================================================
/*
 * Write a function:   function classifyNumber(n)
 *   - takes a number `n`
 *   - returns "positive" if n > 0, "negative" if n < 0, "zero" if n === 0
 *
 * Example:  classifyNumber(42) → "positive"
 *           classifyNumber(-5) → "negative"
 *           classifyNumber(0) → "zero"
 */
function runTests_classifyNumber(runner) {
  runner.runTest("classifyNumber exists", function () {
    return typeof runner.getFn("classifyNumber") === "function"
      ? [true, "Found classifyNumber"]
      : [false, "Define it as:  function classifyNumber(n) { ... }"];
  });
  if (typeof runner.getFn("classifyNumber") !== "function") return;

  runner.runTest("5 is positive", function () { return runner.checkReturns("classifyNumber", [5], "positive"); });
  runner.runTest("-3 is negative", function () { return runner.checkReturns("classifyNumber", [-3], "negative"); });
  runner.runTest("0 is zero", function () { return runner.checkReturns("classifyNumber", [0], "zero"); });
  runner.runTest("0.1 is positive", function () { return runner.checkReturns("classifyNumber", [0.1], "positive"); });
  runner.runTest("-0.1 is negative", function () { return runner.checkReturns("classifyNumber", [-0.1], "negative"); });
  runner.runTest("100 is positive", function () { return runner.checkReturns("classifyNumber", [100], "positive"); });
}

// Node entry point (the browser dropdown calls the sub-task functions directly).
// Picks sub-tasks by the TASK env var ("all" runs everything); with no TASK set,
// it auto-detects: it runs whichever sub-task functions the student's file defines.
function runTests(runner) {
  var tasks = [
    ["passOrFail", runTests_passOrFail],
    ["canVote", runTests_canVote],
    ["classifyNumber", runTests_classifyNumber],
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
  registerTask("Conditionals (Easy)", function (r) { runTests_passOrFail(r); });
  registerTask("Conditionals (Medium)", function (r) { runTests_canVote(r); });
  registerTask("Conditionals (Hard)", function (r) { runTests_classifyNumber(r); });
}
