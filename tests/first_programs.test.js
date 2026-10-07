/*
 * Task Set: First Programs
 * ---
 * Whole-program tasks: the student's file is a short program that runs from top
 * to bottom, not a function the tester calls. These show what the tester can
 * check beyond functions, and work as starting points for tasks like them.
 *
 *   First Programs 1  Hello World      print one exact line             runner.checkOutput
 *   First Programs 2  About Me         const and let, printing them     runner.declaredWith, runner.globals
 *   First Programs 3  Ask a Question   prompt() and printing the answer runner.run({ inputs })
 *
 * HOW THE TASKS ARE CHECKED
 * The tester runs the whole file once before the tests start. runner.output() is
 * everything it printed, one string per console.log. let and const variables are
 * visible, so these tasks use them. runner.run({ inputs: [...] }) runs the file
 * again, with prompt() answering from the list.
 *
 * In Node, test.js picks the part from the file (prompt -> 3, name and age -> 2,
 * otherwise 1). Set TASK to hello, aboutMe or ask to force one, or TASK=all.
 */

// ============================================================================
// First Programs 1: Hello World
// ============================================================================
/*
 * Write a program that prints exactly this line:
 *     Hello World
 *
 * One line of code does it. Don't put it inside a function.
 */
function runTests_hello(runner) {
  runner.runTest("prints Hello World", function () {
    var out = runner.output();
    if (out.length === 0 && /function\s+\w+\s*\(/.test(runner.source())) {
      return [false, "Nothing was printed. Your console.log is inside a function that never runs." +
        " Take it out of the function, so it's a line on its own."];
    }
    return runner.checkOutput(["Hello World"]);
  });
}

// ============================================================================
// First Programs 2: About Me
// ============================================================================
/*
 * At the top of your file, make two variables:
 *     const name = ...    your name, as text. It never changes, so it's a const.
 *     let age = ...       your age, as a number. It changes below, so it's a let.
 *
 * Then print these two lines, joining the variables in with +:
 *     My name is Sam and I am 15 years old.
 *     Next year I will be 16.
 * (with your own name and age). Between the two lines, add 1 to age, and use
 * age itself in the second line - not age + 1.
 */
function runTests_aboutMe(runner) {
  var g = runner.globals() || {};

  runner.runTest("name is a const holding text", function () {
    var how = runner.declaredWith("name");
    if (!how) return [false, "Couldn't find a variable called name. Put  const name = \"Sam\";  at the top of your file (with your own name)."];
    if (how !== "const") return [false, "name was made with " + how + ". It never changes, so make it with const."];
    if (typeof g.name !== "string" || g.name.trim() === "") return [false, "name should hold your name as text, in \"quotes\"."];
    return [true, "const name = " + JSON.stringify(g.name)];
  });

  runner.runTest("age is a let holding a number", function () {
    var how = runner.declaredWith("age");
    if (!how) return [false, "Couldn't find a variable called age. Put  let age = 15;  at the top of your file (with your own age)."];
    if (how !== "let") return [false, "age was made with " + how + ". It changes, so make it with let."];
    if (typeof g.age !== "number") return [false, "age should hold a number, with no quotes. It holds " + JSON.stringify(g.age) + "."];
    return [true, "let age (" + g.age + " after the program ran)"];
  });

  if (typeof g.name !== "string" || typeof g.age !== "number") return;
  var before = g.age - 1; // the program has already added 1

  runner.runTest("prints both lines", function () {
    return runner.checkOutput([
      "My name is " + g.name + " and I am " + before + " years old.",
      "Next year I will be " + g.age + "."
    ]);
  });

  runner.runTest("joins the variables instead of typing the values", function () {
    var code = runner.source();
    var uses = function (v) { return new RegExp("\\+\\s*" + v + "\\b|\\b" + v + "\\s*\\+|\\$\\{\\s*" + v + "\\s*\\}").test(code); };
    if (!uses("name")) return [false, "Join name into the first line with +, instead of typing your name inside the quotes."];
    if (!uses("age")) return [false, "Join age into both lines with +, instead of typing the numbers."];
    return [true, "Uses name and age in the printed lines"];
  });
}

// ============================================================================
// First Programs 3: Ask a Question
// ============================================================================
/*
 * Write a program that:
 *   - asks "What is your name?" with prompt(), and keeps the answer in a variable
 *   - prints Hello, then the answer, then an exclamation mark. If the answer is Sam:
 *         Hello, Sam!
 */
function runTests_ask(runner) {
  runner.runTest("asks a question with prompt()", function () {
    var first = runner.run({ inputs: ["Sam"] });
    if (first.error) return [false, "Your file crashed: " + first.error];
    if (first.prompts.length === 0) return [false, "Your program didn't ask anything. Use  let answer = prompt(\"What is your name?\");"];
    if (first.prompts.length > 1) return [false, "Your program asked " + first.prompts.length + " questions. Ask just one."];
    return [true, "Asked: " + first.prompts[0]];
  });

  ["Sam", "Priya"].forEach(function (answer) {
    runner.runTest("answering " + answer + " prints Hello, " + answer + "!", function () {
      var r = runner.run({ inputs: [answer] });
      if (r.error) return [false, "Your file crashed: " + r.error];
      var result = runner.checkOutput(["Hello, " + answer + "!"], r.output);
      if (!result[0] && answer === "Priya" && r.output.join("\n") === "Hello, Sam!") {
        return [false, "It printed Hello, Sam! even though the answer was Priya. Join the answer's variable in with +, instead of typing a name."];
      }
      return result;
    });
  });
}

// ============================================================================
// Node: run the part the student's file looks like (or TASK=name / TASK=all)
// ============================================================================
function runTests(runner) {
  var tasks = { hello: runTests_hello, aboutMe: runTests_aboutMe, ask: runTests_ask };
  var choice = (typeof process !== "undefined" && process.env) ? process.env.TASK : null;
  if (choice === "all") { Object.keys(tasks).forEach(function (k) { tasks[k](runner); }); return; }
  if (choice && tasks[choice]) { tasks[choice](runner); return; }
  if (/\bprompt\s*\(/.test(runner.source())) runTests_ask(runner);
  else if (runner.declaredWith("name") || runner.declaredWith("age")) runTests_aboutMe(runner);
  else runTests_hello(runner);
}

if (typeof module !== "undefined" && module.exports) { module.exports = { runTests: runTests }; }
else if (typeof registerTask === "function") {
  registerTask("First Programs 1: Hello World", function (r) { runTests_hello(r); });
  registerTask("First Programs 2: About Me", function (r) { runTests_aboutMe(r); });
  registerTask("First Programs 3: Ask a Question", function (r) { runTests_ask(r); });
}
