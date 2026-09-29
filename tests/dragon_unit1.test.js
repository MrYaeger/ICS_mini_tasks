/*
 * Task Set: Dragon Game — Unit 1
 * ---
 * Five tasks, one per lesson (1, 3, 5, 6, 7 — Lesson 2 & 4's tasks are in
 * conditionals.test.js / loops.test.js since they're pure if/loop drills).
 * Each is the exact calculation from that lesson's game code, as a pure function.
 */

// ============================================================================
// Lesson 1: Health Percent
// ============================================================================
/*
 * Write a function:   function healthPercent(current, max)
 *   - returns the % of health remaining, as a number (e.g. 70, not "70%")
 *   - this is the value you'd glue "%" onto for the CSS width
 *
 * Example:  healthPercent(7, 10) → 70
 *           healthPercent(10, 10) → 100
 */
function runTests_healthPercent(runner) {
  runner.runTest("healthPercent exists", function () {
    return typeof runner.getFn("healthPercent") === "function"
      ? [true, "Found healthPercent"]
      : [false, "Define it as:  function healthPercent(current, max) { ... }"];
  });
  if (typeof runner.getFn("healthPercent") !== "function") return;

  runner.runTest("7/10 -> 70", function () { return runner.checkReturns("healthPercent", [7, 10], 70); });
  runner.runTest("10/10 -> 100", function () { return runner.checkReturns("healthPercent", [10, 10], 100); });
  runner.runTest("0/10 -> 0", function () { return runner.checkReturns("healthPercent", [0, 10], 0); });
  runner.runTest("5/20 -> 25", function () { return runner.checkReturns("healthPercent", [5, 20], 25); });
  runner.runTest("3/10 -> 30", function () { return runner.checkReturns("healthPercent", [3, 10], 30); });
}

// ============================================================================
// Lesson 3: Exp To Next
// ============================================================================
/*
 * Write a function:   function expToNext(level)
 *   - returns the exp needed to go from `level` to the next level
 *   - formula: level * 1000 * 1.5^(level - 1)
 *
 * Example:  expToNext(1) → 1000
 *           expToNext(2) → 3000
 */
function runTests_expToNext(runner) {
  runner.runTest("expToNext exists", function () {
    return typeof runner.getFn("expToNext") === "function"
      ? [true, "Found expToNext"]
      : [false, "Define it as:  function expToNext(level) { ... }"];
  });
  if (typeof runner.getFn("expToNext") !== "function") return;

  runner.runTest("level 1 -> 1000", function () { return runner.checkReturns("expToNext", [1], 1000); });
  runner.runTest("level 2 -> 3000", function () { return runner.checkReturns("expToNext", [2], 3000); });
  runner.runTest("level 3 -> 6750", function () { return runner.checkReturns("expToNext", [3], 6750); });
  runner.runTest("level 4 -> 13500", function () {
    var fn = runner.getFn("expToNext");
    var got = fn(4);
    return Math.abs(got - 13500) < 0.01 ? [true, "expToNext(4) → " + got] : [false, "Expected ~13500, got " + got];
  });
}

// ============================================================================
// Lesson 5: Mana After
// ============================================================================
/*
 * Write a function:   function manaAfter(current, perSecond, deltaSeconds, cap)
 *   - returns the new mana value after regenerating for deltaSeconds,
 *     never exceeding cap
 *
 * Example:  manaAfter(90, 1, 5, 100) → 95
 *           manaAfter(98, 1, 5, 100) → 100  (capped)
 */
function runTests_manaAfter(runner) {
  runner.runTest("manaAfter exists", function () {
    return typeof runner.getFn("manaAfter") === "function"
      ? [true, "Found manaAfter"]
      : [false, "Define it as:  function manaAfter(current, perSecond, deltaSeconds, cap) { ... }"];
  });
  if (typeof runner.getFn("manaAfter") !== "function") return;

  runner.runTest("90 + 1/s for 5s -> 95", function () { return runner.checkReturns("manaAfter", [90, 1, 5, 100], 95); });
  runner.runTest("98 + 1/s for 5s -> capped at 100", function () { return runner.checkReturns("manaAfter", [98, 1, 5, 100], 100); });
  runner.runTest("0 + 2/s for 10s -> 20", function () { return runner.checkReturns("manaAfter", [0, 2, 10, 100], 20); });
  runner.runTest("50 + 0/s -> unchanged", function () { return runner.checkReturns("manaAfter", [50, 0, 100, 100], 50); });
  runner.runTest("exactly at cap stays at cap", function () { return runner.checkReturns("manaAfter", [100, 1, 1, 100], 100); });
}

// ============================================================================
// Lesson 6: Cooldown Label
// ============================================================================
/*
 * Write a function:   function cooldownLabel(remaining)
 *   - returns "" (empty string) if remaining <= 0
 *   - otherwise returns the CEILING of remaining, as a string
 *
 * Example:  cooldownLabel(0) → ""
 *           cooldownLabel(-2) → ""
 *           cooldownLabel(4.2) → "5"
 */
function runTests_cooldownLabel(runner) {
  runner.runTest("cooldownLabel exists", function () {
    return typeof runner.getFn("cooldownLabel") === "function"
      ? [true, "Found cooldownLabel"]
      : [false, "Define it as:  function cooldownLabel(remaining) { ... }"];
  });
  if (typeof runner.getFn("cooldownLabel") !== "function") return;

  runner.runTest("0 -> empty string", function () { return runner.checkReturns("cooldownLabel", [0], ""); });
  runner.runTest("-2 -> empty string", function () { return runner.checkReturns("cooldownLabel", [-2], ""); });
  runner.runTest("4.2 -> '5' (ceiling)", function () { return runner.checkReturns("cooldownLabel", [4.2], "5"); });
  runner.runTest("0.1 -> '1' (ceiling, not floor!)", function () { return runner.checkReturns("cooldownLabel", [0.1], "1"); });
  runner.runTest("10 -> '10'", function () { return runner.checkReturns("cooldownLabel", [10], "10"); });
  runner.runTest("returns a string, not a number", function () {
    var r = runner.getFn("cooldownLabel")(5);
    return typeof r === "string" ? [true, "Returns a string"] : [false, "Expected a string, got " + typeof r];
  });
}

// ============================================================================
// Lesson 7: Make Resource
// ============================================================================
/*
 * Write a function:   function makeResource(name, symbol, perSecond)
 *   - returns a dictionary (object) shaped:
 *       { name: name, symbol: symbol, perSecond: perSecond, quantity: 0 }
 *
 * Example:  makeResource("Gold", "🪙", 0) → {name:"Gold", symbol:"🪙", perSecond:0, quantity:0}
 */
function runTests_makeResource(runner) {
  runner.runTest("makeResource exists", function () {
    return typeof runner.getFn("makeResource") === "function"
      ? [true, "Found makeResource"]
      : [false, "Define it as:  function makeResource(name, symbol, perSecond) { ... }"];
  });
  if (typeof runner.getFn("makeResource") !== "function") return;

  runner.runTest("Gold resource shape", function () {
    return runner.checkReturns("makeResource", ["Gold", "🪙", 0], { name: "Gold", symbol: "🪙", perSecond: 0, quantity: 0 });
  });
  runner.runTest("Mana resource shape", function () {
    return runner.checkReturns("makeResource", ["Mana", "🔮", 1], { name: "Mana", symbol: "🔮", perSecond: 1, quantity: 0 });
  });
  runner.runTest("quantity always starts at 0", function () {
    var fn = runner.getFn("makeResource");
    var r = fn("Test", "?", 99);
    return r.quantity === 0 ? [true, "quantity is 0"] : [false, "Expected quantity 0, got " + JSON.stringify(r.quantity)];
  });
}

// Node entry point (the browser dropdown calls the sub-task functions directly).
// Picks sub-tasks by the TASK env var ("all" runs everything); with no TASK set,
// it auto-detects: it runs whichever sub-task functions the student's file defines.
function runTests(runner) {
  var tasks = [
    ["healthPercent", runTests_healthPercent],
    ["expToNext", runTests_expToNext],
    ["manaAfter", runTests_manaAfter],
    ["cooldownLabel", runTests_cooldownLabel],
    ["makeResource", runTests_makeResource],
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
  registerTask("Dragon: Health Percent (L1)", function (r) { runTests_healthPercent(r); });
  registerTask("Dragon: Exp To Next (L3)", function (r) { runTests_expToNext(r); });
  registerTask("Dragon: Mana After (L5)", function (r) { runTests_manaAfter(r); });
  registerTask("Dragon: Cooldown Label (L6)", function (r) { runTests_cooldownLabel(r); });
  registerTask("Dragon: Make Resource (L7)", function (r) { runTests_makeResource(r); });
}
