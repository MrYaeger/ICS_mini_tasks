/*
 * Task: Total Production  (clicker warm-up!)
 * -----------------------------------------------------------------------------
 * In our clicker game, buildings are stored as objects in an array, like this:
 *
 *     let buildings = [
 *       { name: "Tree",   count: 3, rate: 2 },   // 3 trees, each makes 2/sec
 *       { name: "Bush",   count: 5, rate: 1 },
 *       { name: "Garden", count: 0, rate: 10 }
 *     ];
 *
 * Write a function:   function totalProduction(buildings)
 *   - loops through the array
 *   - adds up (count * rate) for every building
 *   - returns the grand total produced per second
 *
 * For the example above: 3*2 + 5*1 + 0*10 = 11.
 * Practises: arrays of objects (JSON), loops, accumulating a total.
 */
function runTests(runner) {
  runner.runTest("totalProduction exists", function () {
    return typeof runner.getFn("totalProduction") === "function"
      ? [true, "Found totalProduction"]
      : [false, "Define it as:  function totalProduction(buildings) { ... }"];
  });
  if (typeof runner.getFn("totalProduction") !== "function") return;

  runner.runTest("the example array → 11", function () {
    return runner.checkReturns("totalProduction", [[
      { name: "Tree", count: 3, rate: 2 },
      { name: "Bush", count: 5, rate: 1 },
      { name: "Garden", count: 0, rate: 10 }
    ]], 11);
  });
  runner.runTest("empty array → 0", function () { return runner.checkReturns("totalProduction", [[]], 0); });
  runner.runTest("one building", function () {
    return runner.checkReturns("totalProduction", [[{ name: "Mine", count: 4, rate: 5 }]], 20);
  });
  runner.runTest("all idle (counts 0) → 0", function () {
    return runner.checkReturns("totalProduction", [[
      { name: "A", count: 0, rate: 7 }, { name: "B", count: 0, rate: 3 }
    ]], 0);
  });
  runner.runTest("bigger numbers", function () {
    return runner.checkReturns("totalProduction", [[
      { name: "A", count: 10, rate: 10 }, { name: "B", count: 25, rate: 4 }, { name: "C", count: 1, rate: 1 }
    ]], 201);
  });
  runner.runTest("does NOT hard-code the example (random check)", function () {
    var fn = runner.getFn("totalProduction");
    var c = Math.floor(Math.random() * 9) + 1, r = Math.floor(Math.random() * 9) + 1;
    var got = fn([{ name: "X", count: c, rate: r }]);
    return got === c * r ? [true, "Worked for a random building (" + c + "×" + r + ")"]
                         : [false, "For one building count=" + c + " rate=" + r + ": expected " + (c * r) + " but got " + JSON.stringify(got)];
  });
}

if (typeof module !== "undefined" && module.exports) { module.exports = { runTests: runTests }; }
else if (typeof registerTask === "function") { registerTask("Total Production", runTests); }
