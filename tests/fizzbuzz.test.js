/*
 * Task: FizzBuzz
 * -----------------------------------------------------------------------------
 * Write a function:   function fizzBuzz(n)
 *   - if n is divisible by 3 AND 5, return the string "FizzBuzz"
 *   - else if divisible by 3, return "Fizz"
 *   - else if divisible by 5, return "Buzz"
 *   - otherwise, return the number as a string, e.g. "7"
 *
 * Examples:  3 → "Fizz",  5 → "Buzz",  15 → "FizzBuzz",  7 → "7"
 * Practises: decision statements, the modulo (%) operator, returning values.
 */
function runTests(runner) {
  runner.runTest("fizzBuzz exists", function () {
    return typeof runner.getFn("fizzBuzz") === "function"
      ? [true, "Found fizzBuzz"]
      : [false, "Define it as:  function fizzBuzz(n) { ... }"];
  });
  if (typeof runner.getFn("fizzBuzz") !== "function") return;

  runner.runTest('3 → "Fizz"', function () { return runner.checkReturns("fizzBuzz", [3], "Fizz"); });
  runner.runTest('9 → "Fizz"', function () { return runner.checkReturns("fizzBuzz", [9], "Fizz"); });
  runner.runTest('5 → "Buzz"', function () { return runner.checkReturns("fizzBuzz", [5], "Buzz"); });
  runner.runTest('20 → "Buzz"', function () { return runner.checkReturns("fizzBuzz", [20], "Buzz"); });
  runner.runTest('15 → "FizzBuzz"', function () { return runner.checkReturns("fizzBuzz", [15], "FizzBuzz"); });
  runner.runTest('30 → "FizzBuzz"', function () { return runner.checkReturns("fizzBuzz", [30], "FizzBuzz"); });
  runner.runTest('7 → "7" (as a string)', function () { return runner.checkReturns("fizzBuzz", [7], "7"); });
  runner.runTest('1 → "1" (as a string)', function () { return runner.checkReturns("fizzBuzz", [1], "1"); });
}

if (typeof module !== "undefined" && module.exports) { module.exports = { runTests: runTests }; }
else if (typeof registerTask === "function") { registerTask("FizzBuzz", runTests); }
