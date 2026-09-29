/*
 * Task: Letter Grade
 * -----------------------------------------------------------------------------
 * Write a function:   function letterGrade(percent)
 *   - takes a number `percent` (0–100)
 *   - returns the letter grade as a string:
 *        90–100 → "A"
 *        80–89  → "B"
 *        70–79  → "C"
 *        60–69  → "D"
 *        below 60 → "F"
 *
 * Watch the boundaries! 80 is a "B", not a "C" (use >= , not >).
 * Practises: decision statements (if / else if), comparison operators.
 */
function runTests(runner) {
  runner.runTest("letterGrade exists", function () {
    return typeof runner.getFn("letterGrade") === "function"
      ? [true, "Found letterGrade"]
      : [false, "Define it as:  function letterGrade(percent) { ... }"];
  });
  if (typeof runner.getFn("letterGrade") !== "function") return;

  runner.runTest("95 → A", function () { return runner.checkReturns("letterGrade", [95], "A"); });
  runner.runTest("85 → B", function () { return runner.checkReturns("letterGrade", [85], "B"); });
  runner.runTest("72 → C", function () { return runner.checkReturns("letterGrade", [72], "C"); });
  runner.runTest("63 → D", function () { return runner.checkReturns("letterGrade", [63], "D"); });
  runner.runTest("40 → F", function () { return runner.checkReturns("letterGrade", [40], "F"); });
  // Boundary cases — these catch > vs >= mistakes:
  runner.runTest("boundary 90 → A", function () { return runner.checkReturns("letterGrade", [90], "A"); });
  runner.runTest("boundary 80 → B", function () { return runner.checkReturns("letterGrade", [80], "B"); });
  runner.runTest("boundary 70 → C", function () { return runner.checkReturns("letterGrade", [70], "C"); });
  runner.runTest("boundary 60 → D", function () { return runner.checkReturns("letterGrade", [60], "D"); });
  runner.runTest("boundary 100 → A", function () { return runner.checkReturns("letterGrade", [100], "A"); });
  runner.runTest("boundary 59 → F", function () { return runner.checkReturns("letterGrade", [59], "F"); });
}

if (typeof module !== "undefined" && module.exports) { module.exports = { runTests: runTests }; }
else if (typeof registerTask === "function") { registerTask("Letter Grade", runTests); }
