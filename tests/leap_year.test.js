/*
 * Task: Leap Year
 * -----------------------------------------------------------------------------
 * Write a function:   function isLeapYear(year)
 *   - takes a whole number `year`
 *   - returns true if it is a leap year, false otherwise
 *
 * Rules:
 *   - a year is a leap year if it is divisible by 4
 *   - EXCEPT years divisible by 100 are NOT leap years
 *   - EXCEPT years divisible by 400 ARE leap years
 *
 * Examples:  2024 → true,  2023 → false,  1900 → false,  2000 → true
 */
function runTests(runner) {
  runner.runTest("isLeapYear exists", function () {
    return typeof runner.getFn("isLeapYear") === "function"
      ? [true, "Found isLeapYear"]
      : [false, "Define it as:  function isLeapYear(year) { ... }"];
  });
  if (typeof runner.getFn("isLeapYear") !== "function") return;

  runner.runTest("2024 is a leap year", function () { return runner.checkReturns("isLeapYear", [2024], true); });
  runner.runTest("2023 is not", function () { return runner.checkReturns("isLeapYear", [2023], false); });
  runner.runTest("2025 is not", function () { return runner.checkReturns("isLeapYear", [2025], false); });
  runner.runTest("1900 is not (divisible by 100)", function () { return runner.checkReturns("isLeapYear", [1900], false); });
  runner.runTest("2000 is (divisible by 400)", function () { return runner.checkReturns("isLeapYear", [2000], true); });
  runner.runTest("1600 is (divisible by 400)", function () { return runner.checkReturns("isLeapYear", [1600], true); });
  runner.runTest("2100 is not (divisible by 100)", function () { return runner.checkReturns("isLeapYear", [2100], false); });
  runner.runTest("returns a real boolean", function () {
    var r = runner.getFn("isLeapYear")(2024);
    return typeof r === "boolean" ? [true, "Returns a boolean"] : [false, "Expected true/false (a boolean), got " + JSON.stringify(r)];
  });
}

if (typeof module !== "undefined" && module.exports) { module.exports = { runTests: runTests }; }
else if (typeof registerTask === "function") { registerTask("Leap Year", runTests); }
