/*
 * harness.js — shared test harness for the JavaScript Mini Task suite.
 *
 * Mirrors the Python test.py workflow. Works in BOTH:
 *   - Node  (via test.js, for the teacher to batch-test submissions)
 *   - Browser (via runner.html, for students to self-check — no install needed)
 *
 * Test definition files use only `runner.*` methods, so they never need to
 * import this file directly.
 *
 * Besides calling the student's functions (getFn, checkReturns, captureConsole),
 * a test can treat the file as a whole program: output() is what it printed when
 * it ran, run({ inputs }) runs it again with answers for prompt(), and globals()
 * reads and changes its top-level variables, let and const included.
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

  // ------------------------------------------------------------------
  // Printing
  // ------------------------------------------------------------------

  // One console.log call as one line of text: text as it is, anything else the
  // way JSON writes it, separated by spaces.
  function formatLog(args) {
    return Array.prototype.map.call(args, function (arg) {
      if (typeof arg === "string") return arg;
      if (arg && typeof arg === "object") {
        try { return JSON.stringify(arg); } catch (e) { return String(arg); }
      }
      return String(arg);
    }).join(" ");
  }

  var PRINT_METHODS = ["log", "info", "warn", "error", "debug"];

  // Until the returned function is called, everything printed through `con`
  // is added to `lines` instead of appearing in the console.
  function recordPrinting(con, lines) {
    var saved = {};
    PRINT_METHODS.forEach(function (m) {
      saved[m] = con[m];
      con[m] = function () { lines.push(formatLog(arguments)); };
    });
    return function stop() {
      PRINT_METHODS.forEach(function (m) { con[m] = saved[m]; });
    };
  }

  // ------------------------------------------------------------------
  // The student's top-level variables, let and const included
  // ------------------------------------------------------------------
  // A file's top-level var and function declarations become properties of its
  // global object; let, const and class declarations don't. Both kinds are
  // reached here through tiny functions compiled in the file's own global scope,
  // which see exactly what the student's functions see.
  //   evalGlobal(code) - runs code in that global scope (runner.html: the iframe's
  //                      eval; test.js: vm.runInContext)
  //   globalObject     - that scope's global object
  var IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

  function studentScope(evalGlobal, globalObject) {
    var readers = Object.create(null), writers = Object.create(null), probes = Object.create(null);

    function compiled(cache, name, code) {
      if (!(name in cache)) {
        cache[name] = null;
        if (IDENTIFIER.test(name) && name !== "arguments" && name !== "this") {
          try { cache[name] = evalGlobal(code); } catch (e) { /* a reserved word, not a variable name */ }
        }
      }
      return cache[name];
    }

    // { found: true, value: ... } or { found: false }
    function read(name) {
      var reader = compiled(readers, name, "(function () { return " + name + "; })");
      if (!reader) {
        return name in globalObject ? { found: true, value: globalObject[name] } : { found: false };
      }
      try { return { found: true, value: reader() }; }
      catch (e) { return { found: false }; } // never declared, or the file crashed before that line ran
    }

    function write(name, value) {
      var writer = compiled(writers, name, "(function ($$mtValue) { " + name + " = $$mtValue; })");
      if (!writer) { globalObject[name] = value; return; }
      try { writer(value); }
      catch (e) {
        if (e && e.name === "TypeError") {
          throw new Error(name + " was made with const, so it can't be changed. Anything that changes needs var or let.");
        }
        throw e;
      }
    }

    // "var" (var and function declarations), "let", "const", "class", or null if there's no such variable.
    function declaredWith(name) {
      var r = read(name);
      if (!r.found) return null;
      if (name in globalObject && Object.is(globalObject[name], r.value)) return "var";
      if (typeof r.value === "function" && /^class\b/.test(Function.prototype.toString.call(r.value))) return "class";
      var probe = compiled(probes, name,
        "(function () { try { " + name + " = " + name + "; return \"let\"; } catch (e) { return \"const\"; } })");
      return probe ? probe() : null;
    }

    return {
      get: function (name) { return read(name).value; },
      set: write,
      has: function (name) { return read(name).found; },
      declaredWith: declaredWith
    };
  }

  // An object whose properties are the student's top-level variables: reading
  // g.score and setting g.score = 5 work for var and let alike.
  function globalsView(scope, globalObject) {
    if (typeof Proxy === "undefined") return globalObject;
    return new Proxy(globalObject, {
      get: function (target, key) {
        return typeof key === "string" ? scope.get(key) : Reflect.get(target, key);
      },
      set: function (target, key, value) {
        if (typeof key === "string") scope.set(key, value);
        else Reflect.set(target, key, value);
        return true;
      },
      has: function (target, key) {
        return typeof key === "string" ? scope.has(key) : Reflect.has(target, key);
      }
    });
  }

  // ------------------------------------------------------------------
  // Comparing printed output
  // ------------------------------------------------------------------
  function toLines(x) {
    if (Array.isArray(x)) return x.map(String);
    if (x === undefined || x === null || x === "") return [];
    return String(x).split("\n");
  }

  function trimEnd(s) { return s.replace(/\s+$/, ""); }

  function indentLines(lines) {
    return lines.length ? lines.map(function (l) { return "  " + l; }).join("\n") : "  (nothing)";
  }

  // A likely reason two lines differ, or "".
  function lineHint(want, got) {
    var squash = function (s) { return s.replace(/\s+/g, ""); };
    var bare = function (s) { return s.toLowerCase().replace(/[^a-z0-9]/g, ""); };
    if (want.toLowerCase() === got.toLowerCase()) return "Check the capital letters.";
    if (squash(want) === squash(got)) return "Check the spaces.";
    if (got === '"' + want + '"' || got === "'" + want + "'") return "The quotation marks were printed too.";
    if (bare(want) === bare(got)) return "Check the punctuation.";
    if (/undefined/.test(got) && !/undefined/.test(want)) {
      return "undefined usually means a variable that was never given a value, or a name that's spelled differently.";
    }
    if (/NaN/.test(got) && !/NaN/.test(want)) return "NaN means \"not a number\": some maths was done with something that isn't a number.";
    return "";
  }

  // [passed, message] for the lines `actual` against the lines `expected`. Each can be
  // an array of lines or one string with \n between lines. Spaces at the end of a
  // line don't count; everything else, capitals and blank lines included, does.
  function compareOutput(expected, actual) {
    var want = toLines(expected).map(trimEnd), got = toLines(actual).map(trimEnd);
    if (deepEqual(want, got)) return [true, "Printed:\n" + indentLines(got)];
    if (got.length === 0) {
      return [false, "Nothing was printed. Expected:\n" + indentLines(want) + "\nPrint each line with console.log(...)."];
    }
    var both = (want.length > 1 || got.length > 1)
      ? "\n\nExpected:\n" + indentLines(want) + "\nPrinted:\n" + indentLines(got) : "";
    for (var i = 0; i < Math.min(want.length, got.length); i++) {
      if (want[i] !== got[i]) {
        var hint = lineHint(want[i], got[i]);
        return [false, "Line " + (i + 1) + " should be:\n  " + want[i] + "\nbut it was:\n  " + got[i] +
          (hint ? "\n" + hint : "") + both];
      }
    }
    if (got.length < want.length) {
      var missing = want.length - got.length;
      return [false, (missing === 1 ? "A line is missing" : missing + " lines are missing") + " from the end. Next expected:\n  " +
        want[got.length] + both];
    }
    var extra = got.length - want.length;
    return [false, (extra === 1 ? "One extra line was printed" : extra + " extra lines were printed, starting with") + ":\n  " +
      got[want.length] + both];
  }

  // getFn(name) fetches a named function/value from the student's code.
  // `student` (optional) is what runner.html and test.js know about the student's file:
  //   { scope, globalObject, source, output, prompts, rerun(options) }
  // and switches on runner.globals(), output(), source(), declaredWith() and run().
  function createRunner(getFn, student) {
    var results = [];
    var run = 0, passed = 0;
    var consoleLogs = [];
    var originalConsoleLog = typeof console !== "undefined" ? console.log : null;
    var view = null;

    return {
      getFn: getFn,
      results: results,

      // ---- the student's file as a whole program ----

      // The lines the student's file printed while it ran (console.log, and alert).
      output: function () { return student && student.output ? student.output.slice() : []; },

      // The student's code, as text - for checks like "uses a for loop".
      source: function () { return student && student.source ? student.source : ""; },

      // An object for reading and changing the file's top-level variables, let included:
      // g.coins = 25 sets it, g.coins reads it. null where the tester can't provide it.
      globals: function () {
        if (!student || !student.scope) return null;
        if (!view) view = globalsView(student.scope, student.globalObject);
        return view;
      },

      // How a top-level name was declared: "var" (function declarations too), "let",
      // "const", "class", or null if the file has no such variable.
      declaredWith: function (name) {
        if (student && student.scope) return student.scope.declaredWith(name);
        return typeof getFn(name) === "undefined" ? null : "var";
      },

      // Run the student's file again from the start, in a fresh copy. options.inputs
      // lists the answers prompt() gives, in order. Returns
      //   { output: [lines], prompts: [questions asked], error: "message" or null, get: function (name) }
      run: function (options) {
        if (!student || !student.rerun) throw new Error("This tester can't run the file again.");
        var again = student.rerun(options || {});
        return {
          output: again.output.slice(),
          prompts: again.prompts.slice(),
          error: again.error ? again.error.message : null,
          get: again.scope.get
        };
      },

      // [passed, message]: did the file print exactly these lines? `expected` is an array of
      // lines or a string. Pass `actual` to check other lines instead, e.g. the logs from
      // captureConsole or the output of run().
      checkOutput: function (expected, actual) {
        return compareOutput(expected, arguments.length > 1 ? actual : this.output());
      },

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
          console.log = function () { consoleLogs.push(formatLog(arguments)); };
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

  var api = {
    createRunner: createRunner, formatSummary: formatSummary, deepEqual: deepEqual, show: show,
    formatLog: formatLog, recordPrinting: recordPrinting, studentScope: studentScope, compareOutput: compareOutput
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;          // Node
  } else {
    root.Harness = api;            // Browser (window.Harness)
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
