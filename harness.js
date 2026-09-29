/*
 * harness.js — shared test harness for the JavaScript Mini Task suite.
 *
 * Mirrors the Python test.py workflow. Works in BOTH:
 *   - Node  (via test.js, for the teacher to batch-test submissions)
 *   - Browser (via runner.html, for students to self-check — no install needed)
 *
 * Test definition files use only `runner.*` methods, so they never need to
 * import this file directly.
 */
(function (root) {
  "use strict";

  function deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a === "number" && typeof b === "number") {
      return Number.isNaN(a) && Number.isNaN(b); // NaN === NaN for our purposes
    }
    if (a && b && typeof a === "object" && typeof b === "object") {
      if (Array.isArray(a) !== Array.isArray(b)) return false;
      var ak = Object.keys(a), bk = Object.keys(b);
      if (ak.length !== bk.length) return false;
      for (var i = 0; i < ak.length; i++) {
        var k = ak[i];
        if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
        if (!deepEqual(a[k], b[k])) return false;
      }
      return true;
    }
    return false;
  }

  function show(v) {
    if (typeof v === "function") return "[a function]";
    if (v === undefined) return "undefined";
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  }

  // getFn(name) fetches a named function/value from the student's code.
  function createRunner(getFn) {
    var results = [];
    var run = 0, passed = 0;
    var consoleLogs = [];
    var originalConsoleLog = typeof console !== "undefined" ? console.log : null;

    return {
      getFn: getFn,
      results: results,

      // Run one test. testFn returns [passed:boolean, message:string]
      // (a plain boolean also works). Exceptions count as a failure.
      runTest: function (name, testFn) {
        run++;
        var res;
        this.resetConsole();
        try {
          var out = testFn();
          var ok = Array.isArray(out) ? !!out[0] : !!out;
          var msg = Array.isArray(out) ? (out[1] || "") : "";
          if (ok) passed++;
          res = { name: name, passed: ok, message: msg };
        } catch (e) {
          res = { name: name, passed: false, message: "Test crashed: " + (e && e.message ? e.message : String(e)) };
        }
        results.push(res);
        return res;
      },

      // Capture console.log output during a function call.
      // Returns [logs, result] where logs is an array of lines and result is the return value.
      captureConsole: function (fn, args) {
        args = args || [];
        this.resetConsole();
        this.enableConsoleCapture();
        var result;
        try {
          result = fn.apply(null, Array.isArray(args) ? args : [args]);
        } finally {
          this.disableConsoleCapture();
        }
        return [consoleLogs.slice(), result];
      },

      // Enable console.log capturing (replaces console.log with a captor).
      enableConsoleCapture: function () {
        if (typeof console !== "undefined") {
          console.log = function () {
            var msg = Array.prototype.map.call(arguments, function (arg) {
              return typeof arg === "string" ? arg : (typeof arg === "object" ? JSON.stringify(arg) : String(arg));
            }).join(" ");
            consoleLogs.push(msg);
          };
        }
      },

      // Disable console.log capturing (restore the original).
      disableConsoleCapture: function () {
        if (typeof console !== "undefined" && originalConsoleLog) {
          console.log = originalConsoleLog;
        }
      },

      // Reset the console log buffer.
      resetConsole: function () {
        consoleLogs = [];
      },

      // Get the current console logs.
      getConsoleLogs: function () {
        return consoleLogs.slice();
      },

      // Convenience: assert that student's fnName(...args) deep-equals `expected`.
      // Returns the [passed, message] pair that runTest expects.
      checkReturns: function (fnName, args, expected) {
        var fn = getFn(fnName);
        if (typeof fn !== "function") {
          return [false, "Function '" + fnName + "' not found. Define it as:  function " + fnName + "(...) { ... }"];
        }
        var actual;
        try { actual = fn.apply(null, args); }
        catch (e) { return [false, "Your code crashed on " + fnName + "(" + args.map(show).join(", ") + "): " + e.message]; }
        if (deepEqual(actual, expected)) {
          return [true, fnName + "(" + args.map(show).join(", ") + ") → " + show(actual)];
        }
        return [false, "For " + fnName + "(" + args.map(show).join(", ") + "): expected " + show(expected) + " but got " + show(actual)];
      },

      summary: function () { return { run: run, passed: passed }; }
    };
  }

  function formatSummary(runner) {
    var lines = ["", "=".repeat(64), "TEST RESULTS", "=".repeat(64)];
    runner.results.forEach(function (r) {
      lines.push((r.passed ? "PASS  " : "FAIL  ") + r.name + (r.message ? "\n        -> " + r.message : ""));
    });
    var s = runner.summary();
    var pct = s.run ? (s.passed / s.run * 100) : 0;
    lines.push("=".repeat(64));
    lines.push("Total: " + s.passed + "/" + s.run + " tests passed");
    lines.push("Score: " + pct.toFixed(1) + "%");
    lines.push("=".repeat(64));
    return lines.join("\n");
  }

  var api = { createRunner: createRunner, formatSummary: formatSummary, deepEqual: deepEqual, show: show };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;          // Node
  } else {
    root.Harness = api;            // Browser (window.Harness)
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
