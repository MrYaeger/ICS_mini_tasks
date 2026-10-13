/*
 * Task Set: Invaders Game — Unit 2
 * ---
 * Four short practice tasks per lesson. They are ordinary programming exercises, not parts of
 * the game. Lessons 0-5 practise ideas from the clicker unit (variables, printing, functions,
 * parameters and return, math, decisions) in a new setting; Lessons 6-9 practise the unit's new
 * ideas (objects, lists and loops). Parts a and b are quick; c and d take a little more thought.
 * None of them is meant to be hard.
 *
 *   Invaders 0a  Three Variables      playerName, lives, gravity   var, text, whole numbers, decimals
 *   Invaders 0b  Welcome Message      printWelcome()               printing exact text
 *   Invaders 0c  Print a Variable     showHighScore()              printing a variable, not its value
 *   Invaders 0d  Score Text           printScore()                 joining text and a number with +
 *   Invaders 1a  Minutes to Seconds   minutesToSeconds(minutes)    a parameter and return
 *   Invaders 1b  Distance Travelled   distanceTravelled(speed, seconds)   two parameters
 *   Invaders 1c  Walk                 walk(seconds)                changing a variable with +=
 *   Invaders 1d  Average of Three     average(a, b, c)             brackets and the order of operations
 *   Invaders 2a  Pass or Fail         passOrFail(mark)             if / else, returning text
 *   Invaders 2b  Pause Button         togglePause()                a true/false variable that flips
 *   Invaders 2c  Health Colour        healthColour(health)         else if, and why the order matters
 *   Invaders 2d  Arrow Keys           isArrowKey(key)              || and returning true or false
 *   Invaders 3a  Both Positive        bothPositive(a, b)           && between two comparisons
 *   Invaders 3b  Valid Mark           isValidMark(mark)            a range: two comparisons, not 0 <= mark <= 100
 *   Invaders 3c  Ride Check           canRide(height, withAdult)   && and || together, a true/false parameter
 *   Invaders 3d  Microwave            startMicrowave(seconds)      only start something that isn't already going
 *   Invaders 4a  Distance             distance(x1, y1, x2, y2)     Pythagoras and Math.sqrt
 *   Invaders 4b  Point in a Rectangle pointInRectangle(px, py, x, y, width, height)   four comparisons
 *   Invaders 4c  Overlap on a Line    rangesOverlap(start1, end1, start2, end2)       the x half of overlaps()
 *   Invaders 4d  Circles Touch        circlesTouch(x1, y1, r1, x2, y2, r2)            calling Part A's function
 *   Invaders 5a  Roll a Die           rollDie()                    Math.random and Math.floor, 1 to 6
 *   Invaders 5b  Random Between       randomBetween(low, high)     a random decimal in a range
 *   Invaders 5c  Countdown            countDown(seconds)           a timer that stops at 0
 *   Invaders 5d  Traffic Light        nextLight(light)             a state that moves on
 *   Invaders 6a  A Pet                pet                          an object with three properties
 *   Invaders 6b  Describe a Pet       describePet(pet)             reading an object's properties
 *   Invaders 6c  Birthday             haveBirthday(pet)            changing an object that's sent in
 *   Invaders 6d  Make a Rectangle     makeRectangle(x, y, width, height)   a function that returns a new object
 *   Invaders 7a  Count to Ten         (a whole program)            a for loop that prints
 *   Invaders 7b  Total                total(numbers)               adding up a list
 *   Invaders 7c  Count Passing        countPassing(marks)          counting with a loop
 *   Invaders 7d  Biggest              largest(numbers)             finding the biggest, without Math.max
 *   Invaders 8a  Cart Total           cartTotal(items)             a list of objects
 *   Invaders 8b  Find a Price         findPrice(items, name)       searching, and -1 for "not found"
 *   Invaders 8c  Rectangle of Stars   printRectangle(rows, columns)   nested loops, building a line of text
 *   Invaders 8d  Times Table          printTimesTable(size)        nested loops
 *   Invaders 9a  Even Numbers         evensUpTo(n)                 building a list with push
 *   Invaders 9b  Passing Marks        passingMarks(marks)          a new list of the ones that pass
 *   Invaders 9c  Remove All           removeAll(list, value)       splice, going backwards
 *   Invaders 9d  No Duplicates        noDuplicates(list)           includes, and a new list
 *
 * HOW THE TASKS ARE CHECKED
 * Students write one file per lesson (lesson0.js, lesson1.js, ...) holding all four parts, and
 * choose one part at a time in the tester. A task's variables must be declared at the top of
 * the file with `var` (`let` works too; a `const` can't change), and the file must not use
 * document or ctx: a mini task file has no page and no canvas. Students don't call their
 * functions; the tester does.
 *
 * In Node, test.js runs every part whose function the file defines (0a and 6a are found by
 * their variables; 7a by the rest of a lesson 7 file, or by the file printing something).
 * To force one part, set TASK to its function name, or to playerName (0a), pet (6a) or
 * countToTen (7a).
 */

// ============================================================================
// Helpers shared by the tasks below. The mt_ prefix keeps them from clashing
// with anything a student might name their own functions.
// ============================================================================

// The student's top-level variables. runner.globals() reads and changes them,
// let included, in test.js and runner.html. A runner without it (an older copy
// of the harness) only reaches `var`s: they live on the file's global object,
// and a function made by that file's own Function constructor returns it.
function mt_globals(runner, fnName) {
  var g = runner.globals ? runner.globals() : null;
  return g || runner.getFn(fnName).constructor("return this")();
}

// A value written the way it would look in code: "text", [1, 2], { x: 10, y: 20 }
function mt_show(value) {
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "function") return "a function";
  if (Array.isArray(value)) return "[" + value.map(mt_show).join(", ") + "]";
  if (value && typeof value === "object") {
    var keys = Object.keys(value);
    if (keys.length === 0) return "{}";
    return "{ " + keys.map(function (k) { return k + ": " + mt_show(value[k]); }).join(", ") + " }";
  }
  return String(value);
}

// Are a and b the same? Lists and objects are compared part by part, and numbers
// with a tiny allowance for rounding. (A list from the student's file and one from
// this file are different objects, so === can't compare them.)
function mt_same(a, b) {
  if (a === b || mt_close(a, b)) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  var ak = Object.keys(a), bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (var i = 0; i < ak.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(b, ak[i]) || !mt_same(a[ak[i]], b[ak[i]])) return false;
  }
  return true;
}

// "score = 120, lives = 3"
function mt_list(names, source) {
  return names.map(function (k) { return k + " = " + mt_show(source[k]); }).join(", ");
}

function mt_close(a, b) {
  return typeof a === "number" && typeof b === "number" && Math.abs(a - b) < 1e-9;
}

function mt_randomInt(low, high) {
  return low + Math.floor(Math.random() * (high - low + 1));
}

// The same name with different capitals or an underscore: highscore, HighScore, high_score.
function mt_nearMiss(runner, name) {
  var snake = name.replace(/[A-Z]/g, function (c) { return "_" + c.toLowerCase(); });
  var variants = [name.toLowerCase(), name.charAt(0).toUpperCase() + name.slice(1), snake, name.toUpperCase()];
  for (var i = 0; i < variants.length; i++) {
    if (variants[i] !== name && typeof runner.getFn(variants[i]) !== "undefined") return variants[i];
  }
  return null;
}

// Turn a crash inside the student's function into a message with a next step.
function mt_explain(fnName, e, fn) {
  var msg = e && e.message ? e.message : String(e);
  if (!/[.!?]$/.test(msg)) msg += ".";
  var hint = "";
  if (/\bctx\b|canvas|document|getElementById|of null/.test(msg)) {
    hint = " Mini task files have no page and no canvas - take out any document or ctx lines.";
  } else if (/setInterval|setTimeout/.test(msg)) {
    hint = " Don't start a timer in a mini task file - the tester calls your function itself.";
  } else if (/\bdistance is not defined/.test(msg)) {
    hint = " circlesTouch uses distance() from Part A, so both functions have to be in the same file.";
  } else if (/is not defined/.test(msg) && fn && fn.length > 0) {
    hint = " If that name is meant to be the parameter, spell it exactly as it is between the function's brackets." +
      " If it's meant to be text, it needs \"quotes\".";
  } else if (/is not defined/.test(msg)) {
    hint = " If that word is meant to be text, it needs \"quotes\". If it is a variable, declare it at the top of your file with var.";
  } else if (/constant variable/.test(msg)) {
    hint = " Something your function changes was made with const. Anything that changes needs var.";
  }
  return "Your " + fnName + "() crashed: " + msg + hint;
}

// The usual first test: does the function exist? Returns true if it does.
// `shape` is how the first line should look, e.g. "minutesToSeconds(minutes)".
function mt_exists(runner, fnName, shape) {
  runner.runTest(fnName + " exists", function () {
    if (typeof runner.getFn(fnName) === "function") return [true, "Found " + fnName];
    var near = mt_nearMiss(runner, fnName);
    if (near) {
      return [false, "Found " + near + ", but the tester looks for " + fnName + ". Names have to match exactly, capitals included."];
    }
    return [false, "Couldn't find a function called " + fnName + ". Define it as:  function " + shape + " { ... }" +
      "  (check the spelling and the capital letters)"];
  });
  return typeof runner.getFn(fnName) === "function";
}

// A function that's meant to take parameters, written with empty brackets.
function mt_hasParams(runner, fnName, shape, count) {
  runner.runTest(fnName + " has " + (count === 1 ? "a parameter" : count + " parameters"), function () {
    var fn = runner.getFn(fnName);
    if (fn.length >= count) return [true, "function " + fnName + " takes " + fn.length + (fn.length === 1 ? " parameter" : " parameters")];
    var what = count === 1 ? "a parameter" : count + " parameters, separated by commas";
    return [false, fnName + " needs " + what + " between its brackets:  function " + shape + " { ... }." +
      " The numbers the tester sends arrive in the parameters."];
  });
}

// Find one of the student's variables. `kind` is "string", "number" or "boolean";
// `example` is what its declaration could look like. Returns { ok, value, message }.
function mt_findVar(runner, name, kind, example) {
  var value = runner.getFn(name);
  if (typeof value === "undefined") {
    var near = mt_nearMiss(runner, name);
    if (near) {
      return { ok: false, message: "Found a variable called " + near + ", but the tester looks for " + name +
        ". Names have to match exactly, capitals included." };
    }
    return { ok: false, message: "Couldn't find a variable called " + name + ". Put  " + example +
      "  at the top of your file, outside any function." };
  }
  if (kind && typeof value !== kind) {
    var fix = "";
    if (kind === "number" && typeof value === "string") fix = " That's text, because of the quotes. Numbers don't have quotes.";
    else if (kind === "string" && typeof value === "number") fix = " Text needs \"quotes\".";
    else if (kind === "boolean" && typeof value === "string") fix = " Take the quotes off: true and false are written without quotes. With quotes, it's just text.";
    else if (kind === "boolean") fix = " Use the word true or false, with no quotes.";
    var what = kind === "boolean" ? "true or false" : kind === "string" ? "text" : "a number";
    return { ok: false, message: name + " should hold " + what + ", but it holds " + mt_show(value) + "." + fix +
      " Try:  " + example };
  }
  return { ok: true, value: value };
}

// A variable that has to start at a particular value.
function mt_startsAt(runner, fnName, name, kind, start, example) {
  runner.runTest(name + " is a variable that starts at " + mt_show(start), function () {
    var found = mt_findVar(runner, name, kind, example);
    if (!found.ok) return [false, found.message];
    if (found.value === start) return [true, name + " starts at " + mt_show(start)];
    return [false, name + " should start at " + mt_show(start) + ", but before the tester called anything it was " +
      mt_show(found.value) + "." + (fnName ? " (You don't need to call " + fnName + "() in your file - the tester does.)" : "")];
  });
}

// Call a function and catch what it prints: { logs, result } or { crash }.
function mt_capture(runner, fnName, args) {
  var fn = runner.getFn(fnName);
  try {
    var out = runner.captureConsole(fn, args || []);
    return { logs: out[0], result: out[1] };
  } catch (e) {
    return { crash: mt_explain(fnName, e, fn) };
  }
}

// Call fnName(...args) and check what it RETURNS. Numbers are compared with a tiny
// allowance for rounding. `hint(got)` can explain a known wrong answer.
function mt_returns(runner, fnName, args, expected, hint) {
  var call = fnName + "(" + args.map(mt_show).join(", ") + ")";   // before the call, in case it changes a list
  var out = mt_capture(runner, fnName, args);
  if (out.crash) return [false, out.crash];
  var got = out.result;
  if (mt_same(got, expected)) return [true, call + " gave back " + mt_show(got)];
  var msg = call + " should give back " + mt_show(expected) + ", but it gave back " + mt_show(got) + ".";
  var extra = hint ? hint(got) : "";
  if (extra) {
    msg += " " + extra;
  } else if (got === undefined && out.logs.length > 0) {
    msg += " It printed " + mt_show(out.logs[0]) + " instead. console.log shows the answer to YOU; return gives it back to the code.";
  } else if (got === undefined) {
    msg += " Nothing came back - put return in front of the answer.";
  } else if (typeof expected === "number" && typeof got === "string") {
    msg += " That's text, not a number - check for quotes.";
  } else if (typeof expected === "boolean" && typeof got === "string") {
    msg += " That's text. Return true or false with no quotes.";
  } else if (typeof expected === "string" && typeof got === "string" && got.toLowerCase() === expected.toLowerCase()) {
    msg += " Only the capitals are different, but the tester checks those too.";
  } else if (typeof expected === "string" && typeof got === "boolean") {
    msg += " Return the text " + mt_show(expected) + ", in quotes, not true or false.";
  }
  return [false, msg];
}

// Set the variables in `before`, call the student's function, then compare the
// variables in `expect`. `calls` is how many times to call it with no arguments,
// or a list of argument lists: [[3], [1]] calls fnName(3) then fnName(1).
// `hint(g, returned)` can explain a known mistake.
function mt_scenario(runner, fnName, before, calls, expect, hint) {
  var g = mt_globals(runner, fnName);
  var missing = Object.keys(expect).filter(function (k) { return typeof g[k] === "undefined"; });
  if (missing.length > 0) {
    return [false, "Couldn't find a variable called " + missing[0] + ". Declare it at the top of your file with var."];
  }
  try { Object.keys(before).forEach(function (k) { g[k] = before[k]; }); }
  catch (e) { return [false, e.message]; } // a const the tester can't change
  var fn = runner.getFn(fnName);
  var argLists = [];
  if (typeof calls === "number") {
    for (var n = 0; n < calls; n++) argLists.push([]);
  } else {
    argLists = calls;
  }
  var returned;
  for (var i = 0; i < argLists.length; i++) {
    try { returned = fn.apply(null, argLists[i]); }
    catch (e) { return [false, mt_explain(fnName, e, fn)]; }
  }
  var start = "Start: " + mt_list(Object.keys(before), before);
  var call = typeof calls !== "number"
    ? argLists.map(function (a) { return fnName + "(" + a.map(mt_show).join(", ") + ")"; }).join(" then ")
    : (calls === 1 ? fnName + "()" : fnName + "() " + calls + " times");
  var names = Object.keys(expect);
  var ok = names.every(function (k) { return g[k] === expect[k] || mt_close(g[k], expect[k]); });
  if (ok) return [true, start + "  ->  after " + call + ": " + mt_list(names, g)];
  var extra = hint ? hint(g, returned) : "";
  return [false, start + ". After " + call + " it should be " + mt_list(names, expect) +
    ", but it is " + mt_list(names, g) + "." + (extra ? " " + extra : "")];
}

// Does `line` contain `value` as a whole number? ("High score: 1234" contains 1234; "12345" doesn't.)
function mt_hasNumber(line, value) {
  var text = String(value).replace(".", "\\.");
  return new RegExp("(^|[^0-9.])" + text + "($|[^0-9.])").test(String(line));
}

// ============================================================================
// Invaders 0a: Three Variables
// ============================================================================
/*
 * At the top of your file, make three variables with var:
 *     playerName   - any name you like, as text in "quotes"
 *     lives        - the number 3
 *     gravity      - the number 9.8
 *
 * That's all. This part has no function.
 */
function runTests_threeVariables(runner) {
  runner.runTest("playerName is a variable that holds text", function () {
    var found = mt_findVar(runner, "playerName", "string", "var playerName = \"Sam\";");
    if (!found.ok) return [false, found.message];
    if (found.value.trim() === "") return [false, "playerName is empty text. Put a name between the quotes:  var playerName = \"Sam\";"];
    return [true, "playerName = " + mt_show(found.value)];
  });

  runner.runTest("lives is the number 3", function () {
    var found = mt_findVar(runner, "lives", "number", "var lives = 3;");
    if (!found.ok) return [false, found.message];
    return found.value === 3
      ? [true, "lives = 3"]
      : [false, "lives should be 3, but it is " + mt_show(found.value) + "."];
  });

  runner.runTest("gravity is the number 9.8", function () {
    var found = mt_findVar(runner, "gravity", "number", "var gravity = 9.8;");
    if (!found.ok) return [false, found.message];
    if (found.value === 9.8) return [true, "gravity = 9.8"];
    if (found.value === 9 || found.value === 10) return [false, "gravity should be 9.8, but it is " + found.value + ". Numbers can have decimals: write 9.8."];
    if (found.value === 98) return [false, "gravity should be 9.8, but it is 98. Decimals use a dot:  var gravity = 9.8;"];
    return [false, "gravity should be 9.8, but it is " + mt_show(found.value) + "."];
  });
}

// ============================================================================
// Invaders 0b: Welcome Message
// ============================================================================
/*
 * Write a function:   function printWelcome()
 *   - it prints exactly this message to the console:
 *         Welcome to the arcade!
 *   - a capital W, small letters after that, and the ! at the end.
 *     The tester checks every character.
 *
 * You don't need to call printWelcome() yourself - the tester does.
 */
function runTests_printWelcome(runner) {
  if (!mt_exists(runner, "printWelcome", "printWelcome()")) return;
  var want = "Welcome to the arcade!";

  runner.runTest("printWelcome() prints one line", function () {
    var out = mt_capture(runner, "printWelcome");
    if (out.crash) return [false, out.crash];
    if (out.logs.length === 1) return [true, "It printed one line"];
    if (out.logs.length === 0) {
      return [false, "printWelcome() ran, but nothing was printed. Put  console.log(\"" + want + "\");  inside the function's { braces }."];
    }
    return [false, "printWelcome() printed " + out.logs.length + " lines. It should print just the one."];
  });

  runner.runTest("the line says exactly: " + want, function () {
    var out = mt_capture(runner, "printWelcome");
    if (out.crash) return [false, out.crash];
    if (out.logs.length === 0) return [false, "Nothing was printed, so there's nothing to check yet."];
    var got = out.logs[0];
    if (got === want) return [true, "It printed: " + got];
    var hint = "";
    if (got.toLowerCase() === want.toLowerCase()) hint = " The words are right, but the capitals aren't: only the W is a capital.";
    else if (got.trim() === want) hint = " There are extra spaces at the start or end - take them out of the quotes.";
    else if (got.replace(/\s+/g, " ").trim() === want) hint = " There are extra spaces between the words.";
    else if (got.replace(/[^a-z ]/gi, "").toLowerCase() === "welcome to the arcade") hint = " Check the punctuation: one ! at the end, and nothing else.";
    return [false, "It printed " + mt_show(got) + ". It should print exactly " + mt_show(want) + "." + hint];
  });
}

// ============================================================================
// Invaders 0c: Print a Variable
// ============================================================================
/*
 * At the top of your file:
 *     var highScore = 500;     // the best score so far
 *
 * Write a function:   function showHighScore()
 *   - it prints the value of highScore to the console
 *   - print the VARIABLE, not the number 500: if highScore changes, what
 *     showHighScore() prints changes too
 */
function runTests_showHighScore(runner) {
  if (!mt_exists(runner, "showHighScore", "showHighScore()")) return;

  mt_startsAt(runner, "showHighScore", "highScore", "number", 500, "var highScore = 500;");

  function printsValue(value) {
    var g = mt_globals(runner, "showHighScore");
    if (typeof g.highScore === "undefined") return [false, "Make the highScore variable first (see the test above)."];
    g.highScore = value;
    var out = mt_capture(runner, "showHighScore");
    g.highScore = 500;
    if (out.crash) return [false, out.crash];
    if (out.logs.length === 0) return [false, "Nothing was printed. Put  console.log(highScore);  inside the function's { braces }."];
    for (var i = 0; i < out.logs.length; i++) {
      if (mt_hasNumber(out.logs[i], value)) return [true, "With highScore = " + value + ", it printed " + mt_show(out.logs[i])];
    }
    var got = out.logs[0];
    if (/highscore/i.test(got)) {
      return [false, "It printed " + mt_show(got) + ": the NAME of the variable, because it's in quotes. Without quotes," +
        " console.log(highScore) prints what's stored in the variable."];
    }
    if (mt_hasNumber(got, 500)) {
      return [false, "highScore was " + value + ", but it printed " + mt_show(got) + ". Print the variable (no quotes), not the number 500."];
    }
    return [false, "highScore was " + value + ", but it printed " + mt_show(got) + "."];
  }

  runner.runTest("it prints highScore: 500", function () { return printsValue(500); });
  runner.runTest("it prints the new value when highScore changes", function () { return printsValue(mt_randomInt(1000, 9999)); });
}

// ============================================================================
// Invaders 0d: Score Text
// ============================================================================
/*
 * At the top of your file:
 *     var score = 0;           // the player's score
 *
 * Write a function:   function printScore()
 *   - it prints the score with "Score: " in front of it
 *   - for example, when score is 120 it prints:   Score: 120
 *   - use + to join the text and the variable
 *
 * This is the same text your game draws with ctx.fillText.
 */
function runTests_printScore(runner) {
  if (!mt_exists(runner, "printScore", "printScore()")) return;

  mt_startsAt(runner, "printScore", "score", "number", 0, "var score = 0;");

  function printsScore(value, lastValue) {
    var g = mt_globals(runner, "printScore");
    if (typeof g.score === "undefined") return [false, "Make the score variable first (see the test above)."];
    g.score = value;
    var out = mt_capture(runner, "printScore");
    g.score = 0;
    if (out.crash) return [false, out.crash];
    var want = "Score: " + value;
    if (out.logs.length === 0) return [false, "Nothing was printed. Put  console.log(\"Score: \" + score);  inside the function's { braces }."];
    var got = out.logs[0];
    if (got === want) return [true, "With score = " + value + ", it printed " + mt_show(got)];
    var hint = "";
    if (/score\s*$/i.test(got) && !mt_hasNumber(got, value)) hint = " It printed the WORD score. Take score out of the quotes and join it on with +:  \"Score: \" + score";
    else if (got === "Score:" + value) hint = " There's no space after the colon. Put the space inside the quotes:  \"Score: \"";
    else if (got === "Score:  " + value) hint = " There are two spaces after the colon. If you used a comma, join with + instead.";
    else if (got === String(value)) hint = " That's just the number. Put \"Score: \" in front of it, joined with +.";
    else if (got.toLowerCase() === want.toLowerCase()) hint = " Only the capitals are different: a capital S, small letters after it.";
    else if (lastValue !== undefined && mt_hasNumber(got, lastValue)) hint = " That's the old score. Join the variable, not a number.";
    return [false, "With score = " + value + ", it should print " + mt_show(want) + ", but it printed " + mt_show(got) + "." + hint];
  }

  runner.runTest("score = 120 prints \"Score: 120\"", function () { return printsScore(120); });
  runner.runTest("score = 0 prints \"Score: 0\"", function () { return printsScore(0); });
  runner.runTest("a different score prints that score", function () { return printsScore(mt_randomInt(200, 9999), 120); });
}

// ============================================================================
// Invaders 1a: Minutes to Seconds
// ============================================================================
/*
 * Write a function:   function minutesToSeconds(minutes)
 *   - it takes a number of minutes
 *   - it RETURNS how many seconds that is (there are 60 seconds in a minute)
 *   - it doesn't print anything
 *
 * Example:  minutesToSeconds(2) gives back 120
 */
function runTests_minutesToSeconds(runner) {
  if (!mt_exists(runner, "minutesToSeconds", "minutesToSeconds(minutes)")) return;
  mt_hasParams(runner, "minutesToSeconds", "minutesToSeconds(minutes)", 1);

  function check(minutes) {
    return mt_returns(runner, "minutesToSeconds", [minutes], minutes * 60, function (got) {
      if (mt_close(got, minutes / 60)) return "You divided. Every minute has 60 seconds, so multiply by 60.";
      if (got === minutes + 60) return "You added 60. Every minute has 60 seconds, so multiply by 60.";
      if (got === 60 && minutes !== 1) return "It gave back 60 no matter how many minutes. Use the parameter: minutes * 60.";
      return "";
    });
  }

  runner.runTest("1 minute is 60 seconds", function () { return check(1); });
  runner.runTest("5 minutes is 300 seconds", function () { return check(5); });
  runner.runTest("0 minutes is 0 seconds", function () { return check(0); });
  runner.runTest("2.5 minutes is 150 seconds", function () { return check(2.5); });
  runner.runTest("a random number of minutes", function () { return check(mt_randomInt(10, 99)); });
}

// ============================================================================
// Invaders 1b: Distance Travelled
// ============================================================================
/*
 * Write a function:   function distanceTravelled(speed, seconds)
 *   - speed is how fast something moves, in metres per second
 *   - seconds is how long it moves for
 *   - it RETURNS how far it went: speed times time
 *
 * Example:  distanceTravelled(20, 3) gives back 60
 *           (20 metres every second, for 3 seconds)
 *
 * It's the same sum your game does every tick: speed * delta.
 */
function runTests_distanceTravelled(runner) {
  if (!mt_exists(runner, "distanceTravelled", "distanceTravelled(speed, seconds)")) return;
  mt_hasParams(runner, "distanceTravelled", "distanceTravelled(speed, seconds)", 2);

  function check(speed, seconds) {
    return mt_returns(runner, "distanceTravelled", [speed, seconds], speed * seconds, function (got) {
      if (got === speed + seconds && speed * seconds !== speed + seconds) return "You added. The distance is the speed TIMES the time.";
      if (mt_close(got, speed / seconds) || mt_close(got, seconds / speed)) return "You divided. The distance is the speed TIMES the time.";
      return "";
    });
  }

  runner.runTest("20 m/s for 3 seconds is 60 m", function () { return check(20, 3); });
  runner.runTest("150 pixels/s for half a second is 75 pixels", function () { return check(150, 0.5); });
  runner.runTest("not moving: speed 0 for 10 seconds is 0", function () { return check(0, 10); });
  runner.runTest("no time: speed 12 for 0 seconds is 0", function () { return check(12, 0); });
  runner.runTest("a random speed and time", function () { return check(mt_randomInt(3, 50), mt_randomInt(2, 20)); });
}

// ============================================================================
// Invaders 1c: Walk
// ============================================================================
/*
 * A robot walks along a straight track. At the top of your file:
 *     var robotPosition = 0;   // how far the robot is from the start, in metres
 *     var robotSpeed = 2;      // how fast the robot walks, in metres per second
 *
 * Write a function:   function walk(seconds)
 *   - it moves the robot: it adds robotSpeed times seconds to robotPosition
 *   - it CHANGES robotPosition; it doesn't return or print anything
 *
 * Example:  robotPosition = 0, robotSpeed = 2
 *           walk(3)   ->  robotPosition is 6
 *           walk(1)   ->  robotPosition is 8   (it keeps going from where it was)
 *
 * This is moveInvader(delta) with the canvas taken out.
 */
function runTests_walk(runner) {
  if (!mt_exists(runner, "walk", "walk(seconds)")) return;
  mt_hasParams(runner, "walk", "walk(seconds)", 1);

  mt_startsAt(runner, "walk", "robotPosition", "number", 0, "var robotPosition = 0;");
  mt_startsAt(runner, "walk", "robotSpeed", "number", 2, "var robotSpeed = 2;");

  function hints(start, speed, seconds) {
    return function (g, returned) {
      var right = start + speed * seconds;
      if (g.robotPosition === start && mt_close(returned, right)) {
        return "walk() gave back the answer, but this task wants it to CHANGE robotPosition: robotPosition += ...";
      }
      if (g.robotPosition === start) {
        return "robotPosition didn't change. Check that the line really changes it (+=, not just +)," +
          " and that there's no var in front of it inside the function - var there makes a brand-new variable.";
      }
      if (mt_close(g.robotPosition, speed * seconds)) {
        return "It replaced robotPosition instead of adding to it. Use += so the robot keeps going from where it was.";
      }
      if (speed !== 2 && mt_close(g.robotPosition, start + 2 * seconds)) {
        return "It moved at 2 m/s, but robotSpeed was " + speed + ". Use the variable robotSpeed, not the number 2.";
      }
      return "";
    };
  }

  runner.runTest("walk(3) from 0 at 2 m/s: robotPosition becomes 6", function () {
    return mt_scenario(runner, "walk", { robotPosition: 0, robotSpeed: 2 }, [[3]], { robotPosition: 6 }, hints(0, 2, 3));
  });

  runner.runTest("it keeps going: from 6, walk(1) makes it 8", function () {
    return mt_scenario(runner, "walk", { robotPosition: 6, robotSpeed: 2 }, [[1]], { robotPosition: 8 }, hints(6, 2, 1));
  });

  runner.runTest("a faster robot: 5 m/s for half a second, from 10", function () {
    return mt_scenario(runner, "walk", { robotPosition: 10, robotSpeed: 5 }, [[0.5]], { robotPosition: 12.5 }, hints(10, 5, 0.5));
  });

  runner.runTest("a negative speed walks backwards: -3 m/s for 4 seconds, from 20", function () {
    return mt_scenario(runner, "walk", { robotPosition: 20, robotSpeed: -3 }, [[4]], { robotPosition: 8 }, function (g, returned) {
      if (g.robotPosition === 32) return "It went forwards. Don't change the sign yourself: speed * seconds is already negative.";
      return hints(20, -3, 4)(g, returned);
    });
  });

  runner.runTest("walk() doesn't change robotSpeed", function () {
    return mt_scenario(runner, "walk", { robotPosition: 0, robotSpeed: 4 }, [[2], [3]], { robotPosition: 20, robotSpeed: 4 }, hints(0, 4, 5));
  });
}

// ============================================================================
// Invaders 1d: Average of Three
// ============================================================================
/*
 * Write a function:   function average(a, b, c)
 *   - it takes three numbers
 *   - it RETURNS their average: add them up, then divide by 3
 *
 * Example:  average(90, 75, 60) gives back 75
 *
 * Careful: JavaScript does multiplying and dividing before adding, the same as in math class.
 */
function runTests_average(runner) {
  if (!mt_exists(runner, "average", "average(a, b, c)")) return;
  mt_hasParams(runner, "average", "average(a, b, c)", 3);

  function check(a, b, c) {
    return mt_returns(runner, "average", [a, b, c], (a + b + c) / 3, function (got) {
      if (mt_close(got, a + b + c / 3)) {
        return "JavaScript divides before it adds, so a + b + c / 3 only divides c. Put brackets around the adding:  (a + b + c) / 3";
      }
      if (mt_close(got, a + b + c)) return "That's the total. Now divide it by 3.";
      if (mt_close(got, (a + b + c) / 2)) return "There are three numbers, so divide by 3.";
      return "";
    });
  }

  runner.runTest("average(90, 75, 60) is 75", function () { return check(90, 75, 60); });
  runner.runTest("average(2, 4, 6) is 4", function () { return check(2, 4, 6); });
  runner.runTest("average(7, 7, 7) is 7", function () { return check(7, 7, 7); });
  runner.runTest("average(-5, 0, 5) is 0", function () { return check(-5, 0, 5); });
  runner.runTest("average(1, 2, 4) has decimals", function () { return check(1, 2, 4); });
  runner.runTest("three random numbers", function () { return check(mt_randomInt(10, 99), mt_randomInt(10, 99), mt_randomInt(10, 99)); });
}

// ============================================================================
// Invaders 2a: Pass or Fail
// ============================================================================
/*
 * Write a function:   function passOrFail(mark)
 *   - mark is a number from 0 to 100
 *   - it RETURNS the text "Pass" if the mark is 50 or more
 *   - it RETURNS the text "Fail" if the mark is less than 50
 *
 * Example:  passOrFail(73) gives back "Pass"
 *           passOrFail(38) gives back "Fail"
 */
function runTests_passOrFail(runner) {
  if (!mt_exists(runner, "passOrFail", "passOrFail(mark)")) return;
  mt_hasParams(runner, "passOrFail", "passOrFail(mark)", 1);

  function check(mark, want) {
    return mt_returns(runner, "passOrFail", [mark], want, function (got) {
      if (mark === 50 && got === "Fail") return "Exactly 50 is a pass. Did you write > where you need >= ?";
      if (got === undefined && want === "Fail") return "Nothing came back for a failing mark. Add an else that returns \"Fail\".";
      return "";
    });
  }

  runner.runTest("73 is a pass", function () { return check(73, "Pass"); });
  runner.runTest("38 is a fail", function () { return check(38, "Fail"); });
  runner.runTest("exactly 50 is a pass", function () { return check(50, "Pass"); });
  runner.runTest("49 is a fail", function () { return check(49, "Fail"); });
  runner.runTest("100 is a pass", function () { return check(100, "Pass"); });
  runner.runTest("0 is a fail", function () { return check(0, "Fail"); });
  runner.runTest("49.5 is a fail", function () { return check(49.5, "Fail"); });
}

// ============================================================================
// Invaders 2b: Pause Button
// ============================================================================
/*
 * At the top of your file:
 *     var paused = false;      // is the game paused?
 *
 * Write a function:   function togglePause()
 *   - if paused is true, it changes paused to false
 *   - otherwise, it changes paused to true
 *
 * Calling it once pauses the game; calling it again unpauses it.
 * true and false have no quotes.
 */
function runTests_togglePause(runner) {
  if (!mt_exists(runner, "togglePause", "togglePause()")) return;

  mt_startsAt(runner, "togglePause", "paused", "boolean", false, "var paused = false;");

  function hints(start) {
    return function (g) {
      if (typeof g.paused === "string") return "paused became text, " + mt_show(g.paused) + ". Write true and false with no quotes.";
      if (g.paused === start) {
        return "paused didn't change. Two common causes: (1) two separate ifs - the first one changes paused, then the second" +
          " one sees the new value and changes it straight back (make the second one an else); (2) var in front of paused" +
          " inside the function, which makes a brand-new variable.";
      }
      return "";
    };
  }

  runner.runTest("not paused -> paused", function () {
    return mt_scenario(runner, "togglePause", { paused: false }, 1, { paused: true }, hints(false));
  });

  runner.runTest("paused -> not paused", function () {
    return mt_scenario(runner, "togglePause", { paused: true }, 1, { paused: false }, hints(true));
  });

  runner.runTest("twice: not paused -> paused -> not paused", function () {
    return mt_scenario(runner, "togglePause", { paused: false }, 2, { paused: false }, function (g) {
      if (typeof g.paused === "string") return hints(false)(g);
      return "One call should pause, and the next should unpause. Check the two tests above first.";
    });
  });
}

// ============================================================================
// Invaders 2c: Health Colour
// ============================================================================
/*
 * Write a function:   function healthColour(health)
 *   - health is a number from 0 to 100
 *   - it RETURNS "green" if health is 60 or more
 *   - it RETURNS "yellow" if health is 30 or more (but less than 60)
 *   - it RETURNS "red" if health is less than 30
 *
 * Example:  healthColour(85) gives back "green"
 *           healthColour(45) gives back "yellow"
 *
 * (A game could use it for a health bar:  ctx.fillStyle = healthColour(health);)
 */
function runTests_healthColour(runner) {
  if (typeof runner.getFn("healthColour") !== "function" && typeof runner.getFn("healthColor") === "function") {
    runner.runTest("healthColour exists", function () {
      return [false, "Found healthColor, but the tester looks for healthColour, with a u (the Canadian spelling)."];
    });
    return;
  }
  if (!mt_exists(runner, "healthColour", "healthColour(health)")) return;
  mt_hasParams(runner, "healthColour", "healthColour(health)", 1);

  // Is 85 green? If so, a 60 that comes out yellow is a > vs >= mistake, not the order.
  function bigIsGreen() {
    try { return runner.getFn("healthColour")(85) === "green"; } catch (e) { return false; }
  }

  function check(health, want) {
    return mt_returns(runner, "healthColour", [health], want, function (got) {
      if ((health === 60 && got === "yellow" && bigIsGreen()) || (health === 30 && got === "red")) {
        return "Exactly " + health + " should be " + mt_show(want) + ". Did you write > where you need >= ?";
      }
      if (want === "green" && got === "yellow") {
        return "Your check for 30 or more comes first, and " + health + " is 30 or more too, so the green check never gets a turn." +
          " An else if chain stops at the first check that's true, so check for 60 first.";
      }
      return "";
    });
  }

  runner.runTest("85 is green", function () { return check(85, "green"); });
  runner.runTest("45 is yellow", function () { return check(45, "yellow"); });
  runner.runTest("10 is red", function () { return check(10, "red"); });
  runner.runTest("exactly 60 is green", function () { return check(60, "green"); });
  runner.runTest("59 is yellow", function () { return check(59, "yellow"); });
  runner.runTest("exactly 30 is yellow", function () { return check(30, "yellow"); });
  runner.runTest("29.5 is red", function () { return check(29.5, "red"); });
  runner.runTest("100 is green", function () { return check(100, "green"); });
}

// ============================================================================
// Invaders 2d: Arrow Keys
// ============================================================================
/*
 * Write a function:   function isArrowKey(key)
 *   - key is the name of a keyboard key, like event.key in your game
 *   - it RETURNS true if key is "ArrowLeft", "ArrowRight", "ArrowUp" or "ArrowDown"
 *   - it RETURNS false for any other key
 *
 * Example:  isArrowKey("ArrowUp") gives back true
 *           isArrowKey("a") gives back false
 *
 * true and false have no quotes.
 */
function runTests_isArrowKey(runner) {
  if (!mt_exists(runner, "isArrowKey", "isArrowKey(key)")) return;
  mt_hasParams(runner, "isArrowKey", "isArrowKey(key)", 1);

  var orHint = "Each side of || has to be a whole comparison:  key == \"ArrowLeft\" || key == \"ArrowRight\" || ...  " +
    "On its own, a word in quotes like \"ArrowRight\" counts as true, so every key passes.";

  function check(key, want) {
    return mt_returns(runner, "isArrowKey", [key], want, function (got) {
      if (want === false && (got === true || /^Arrow/.test(got))) return orHint;
      if (want === false && got === undefined) return "Nothing came back for a key that isn't an arrow. Add an else that returns false.";
      if (typeof got === "string" && (got === "true" || got === "false")) return "That's text. Return true or false with no quotes.";
      return "";
    });
  }

  runner.runTest("\"ArrowLeft\" is an arrow key", function () { return check("ArrowLeft", true); });
  runner.runTest("\"ArrowRight\" is an arrow key", function () { return check("ArrowRight", true); });
  runner.runTest("\"ArrowUp\" is an arrow key", function () { return check("ArrowUp", true); });
  runner.runTest("\"ArrowDown\" is an arrow key", function () { return check("ArrowDown", true); });
  runner.runTest("\"a\" is not an arrow key", function () { return check("a", false); });
  runner.runTest("\" \" (the space bar) is not an arrow key", function () { return check(" ", false); });
  runner.runTest("\"Enter\" is not an arrow key", function () { return check("Enter", false); });
}

// ============================================================================
// Invaders 3a: Both Positive
// ============================================================================
/*
 * Write a function:   function bothPositive(a, b)
 *   - it RETURNS true if a and b are BOTH greater than 0
 *   - otherwise it RETURNS false
 *
 * Example:  bothPositive(3, 5) gives back true
 *           bothPositive(3, -5) gives back false
 * (0 isn't greater than 0, so it doesn't count as positive.)
 */
function runTests_bothPositive(runner) {
  if (!mt_exists(runner, "bothPositive", "bothPositive(a, b)")) return;
  mt_hasParams(runner, "bothPositive", "bothPositive(a, b)", 2);

  function check(a, b, want) {
    return mt_returns(runner, "bothPositive", [a, b], want, function (got) {
      if (typeof got === "string") return "That's text. Return true or false with no quotes.";
      if (want === false && got === true && (a === 0 || b === 0)) return "0 isn't greater than 0. Use > 0, not >= 0.";
      if (want === false && got === true) return "Only one of them is positive. Did you use || (or) where you need && (and)?";
      if (want === false && got === undefined) return "Nothing came back. Add an else that returns false.";
      return "";
    });
  }

  runner.runTest("3 and 5 are both positive", function () { return check(3, 5, true); });
  runner.runTest("3 and -5 aren't both positive", function () { return check(3, -5, false); });
  runner.runTest("-3 and 5 aren't both positive", function () { return check(-3, 5, false); });
  runner.runTest("-3 and -5 aren't both positive", function () { return check(-3, -5, false); });
  runner.runTest("0 isn't positive: 0 and 5", function () { return check(0, 5, false); });
  runner.runTest("2.5 and 0.1 are both positive", function () { return check(2.5, 0.1, true); });
}

// ============================================================================
// Invaders 3b: Valid Mark
// ============================================================================
/*
 * Write a function:   function isValidMark(mark)
 *   - it RETURNS true if mark is from 0 to 100 (0 and 100 included)
 *   - it RETURNS false for anything below 0 or above 100
 *
 * Example:  isValidMark(85) gives back true
 *           isValidMark(120) gives back false
 */
function runTests_isValidMark(runner) {
  if (!mt_exists(runner, "isValidMark", "isValidMark(mark)")) return;
  mt_hasParams(runner, "isValidMark", "isValidMark(mark)", 1);

  // Does it say true for everything, the way 0 <= mark <= 100 does?
  function alwaysTrue() {
    var fn = runner.getFn("isValidMark");
    try { return fn(-50) === true && fn(500) === true; } catch (e) { return false; }
  }

  function check(mark, want) {
    return mt_returns(runner, "isValidMark", [mark], want, function (got) {
      if (typeof got === "string") return "That's text. Return true or false with no quotes.";
      if (want === false && got === true && alwaysTrue()) {
        return "It says true for everything. JavaScript can't check two comparisons at once, the way 0 <= mark <= 100 does" +
          " in math class: that always comes out true. Write two comparisons joined with &&:  mark >= 0 && mark <= 100";
      }
      if (want === false && got === true) return mark < 0 ? "Marks below 0 aren't valid." : "Marks above 100 aren't valid.";
      if (want === true && got === false && (mark === 0 || mark === 100)) return "Exactly " + mark + " is a valid mark. Use >= and <=, not > and <.";
      if (want === false && got === undefined) return "Nothing came back. Add an else that returns false.";
      return "";
    });
  }

  runner.runTest("85 is valid", function () { return check(85, true); });
  runner.runTest("120 isn't valid", function () { return check(120, false); });
  runner.runTest("-1 isn't valid", function () { return check(-1, false); });
  runner.runTest("exactly 0 is valid", function () { return check(0, true); });
  runner.runTest("exactly 100 is valid", function () { return check(100, true); });
  runner.runTest("101 isn't valid", function () { return check(101, false); });
  runner.runTest("99.5 is valid", function () { return check(99.5, true); });
}

// ============================================================================
// Invaders 3c: Ride Check
// ============================================================================
/*
 * A fairground ride has a height rule:
 *   - riders 120 cm or taller can always ride
 *   - riders from 100 cm up to 120 cm can ride, but only with an adult
 *   - riders under 100 cm can't ride at all
 *
 * Write a function:   function canRide(height, withAdult)
 *   - height is the rider's height in cm
 *   - withAdult is true if they're with an adult, and false if they aren't
 *   - it RETURNS true if they can ride, and false if they can't
 *
 * Example:  canRide(130, false) gives back true
 *           canRide(110, true) gives back true
 *           canRide(110, false) gives back false
 */
function runTests_canRide(runner) {
  if (!mt_exists(runner, "canRide", "canRide(height, withAdult)")) return;
  mt_hasParams(runner, "canRide", "canRide(height, withAdult)", 2);

  function check(height, withAdult, want) {
    return mt_returns(runner, "canRide", [height, withAdult], want, function (got) {
      if (typeof got === "string") return "That's text. Return true or false with no quotes.";
      if (want === true && got === false && height === 120) return "Exactly 120 cm is tall enough. Use >=, not >.";
      if (want === true && got === false && height === 100) return "Exactly 100 cm is tall enough with an adult. Use >=, not >.";
      if (want === true && got === false && withAdult === true && height < 120) return "With an adult, riders from 100 cm can ride.";
      if (want === false && got === true && height >= 100) return "Without an adult, " + height + " cm is too short: they need 120 cm.";
      if (want === false && got === true) return "Under 100 cm is too short, even with an adult.";
      if (want === false && got === undefined) return "Nothing came back. Add an else that returns false.";
      return "";
    });
  }

  runner.runTest("130 cm, on their own: yes", function () { return check(130, false, true); });
  runner.runTest("130 cm, with an adult: yes", function () { return check(130, true, true); });
  runner.runTest("exactly 120 cm, on their own: yes", function () { return check(120, false, true); });
  runner.runTest("110 cm, with an adult: yes", function () { return check(110, true, true); });
  runner.runTest("110 cm, on their own: no", function () { return check(110, false, false); });
  runner.runTest("exactly 100 cm, with an adult: yes", function () { return check(100, true, true); });
  runner.runTest("99 cm, with an adult: no", function () { return check(99, true, false); });
  runner.runTest("90 cm, on their own: no", function () { return check(90, false, false); });
}

// ============================================================================
// Invaders 3d: Microwave
// ============================================================================
/*
 * At the top of your file:
 *     var running = false;     // is the microwave running?
 *     var secondsLeft = 0;     // how many seconds it has left to run
 *
 * Write a function:   function startMicrowave(seconds)
 *   - if the microwave ISN'T running, it starts: running becomes true,
 *     and secondsLeft becomes seconds
 *   - if it's already running, pressing start again does nothing at all
 *
 * Example:  not running         -> startMicrowave(30) -> running = true, secondsLeft = 30
 *           running, 12 s left  -> startMicrowave(45) -> still running, still 12 s left
 *
 * It's fireBullet() from your game: only start something if it isn't already going.
 */
function runTests_startMicrowave(runner) {
  if (!mt_exists(runner, "startMicrowave", "startMicrowave(seconds)")) return;
  mt_hasParams(runner, "startMicrowave", "startMicrowave(seconds)", 1);

  mt_startsAt(runner, "startMicrowave", "running", "boolean", false, "var running = false;");
  mt_startsAt(runner, "startMicrowave", "secondsLeft", "number", 0, "var secondsLeft = 0;");

  function hints(g) {
    if (typeof g.running === "string") return "running became text, " + mt_show(g.running) + ". Write true and false with no quotes.";
    return "";
  }

  runner.runTest("not running: startMicrowave(30) starts it with 30 seconds", function () {
    return mt_scenario(runner, "startMicrowave", { running: false, secondsLeft: 0 }, [[30]], { running: true, secondsLeft: 30 }, function (g) {
      if (g.running === false && g.secondsLeft === 0) {
        return "Nothing changed. Check the if: it should start the microwave when running is false.";
      }
      return hints(g);
    });
  });

  runner.runTest("already running: startMicrowave(45) changes nothing", function () {
    return mt_scenario(runner, "startMicrowave", { running: true, secondsLeft: 12 }, [[45]], { running: true, secondsLeft: 12 }, function (g) {
      if (g.secondsLeft === 45) return "It started again while it was already running. Only start it if running is false.";
      return hints(g);
    });
  });

  runner.runTest("pressed twice: startMicrowave(30) then startMicrowave(10) keeps 30", function () {
    return mt_scenario(runner, "startMicrowave", { running: false, secondsLeft: 0 }, [[30], [10]], { running: true, secondsLeft: 30 }, function (g) {
      if (g.secondsLeft === 10) return "The second press changed it. Once it's running, start shouldn't do anything.";
      return hints(g);
    });
  });
}

// ============================================================================
// Invaders 4a: Distance
// ============================================================================
/*
 * Write a function:   function distance(x1, y1, x2, y2)
 *   - it RETURNS the straight-line distance between the points (x1, y1) and (x2, y2)
 *   - Pythagoras: the distance across is x2 - x1, the distance down is y2 - y1, and the
 *     straight-line distance is the square root of (across squared + down squared)
 *   - Math.sqrt(number) gives back the square root of a number.
 *     To square a number, multiply it by itself:  across * across
 *
 * Example:  distance(0, 0, 3, 4) gives back 5
 */
function runTests_distance(runner) {
  if (!mt_exists(runner, "distance", "distance(x1, y1, x2, y2)")) return;
  mt_hasParams(runner, "distance", "distance(x1, y1, x2, y2)", 4);

  function check(x1, y1, x2, y2) {
    var across = x2 - x1, down = y2 - y1;
    var want = Math.sqrt(across * across + down * down);
    return mt_returns(runner, "distance", [x1, y1, x2, y2], want, function (got) {
      if (mt_close(got, across * across + down * down) && want > 1) return "That's the distance squared. Put Math.sqrt( ... ) around it.";
      if (mt_close(got, Math.abs(across) + Math.abs(down)) || mt_close(got, across + down)) {
        return "You added the distance across to the distance down. Square them both, add them, then take the square root.";
      }
      if (mt_close(got, Math.sqrt(Math.abs((across ^ 2) + (down ^ 2))))) {
        return "In JavaScript, ^ doesn't mean \"to the power of\". Multiply each one by itself instead:  across * across";
      }
      if (typeof got === "number" && isNaN(got)) return "NaN means some maths was done with something that isn't a number. Check the spelling: Math.sqrt.";
      return "";
    });
  }

  runner.runTest("(0, 0) to (3, 4) is 5", function () { return check(0, 0, 3, 4); });
  runner.runTest("(1, 1) to (4, 5) is 5", function () { return check(1, 1, 4, 5); });
  runner.runTest("backwards: (3, 4) to (0, 0) is still 5", function () { return check(3, 4, 0, 0); });
  runner.runTest("a point to itself is 0", function () { return check(2, 3, 2, 3); });
  runner.runTest("(0, 0) to (1, 1) has decimals", function () { return check(0, 0, 1, 1); });
  runner.runTest("two random points", function () {
    return check(mt_randomInt(-50, 50), mt_randomInt(-50, 50), mt_randomInt(-50, 50), mt_randomInt(-50, 50));
  });
}

// ============================================================================
// Invaders 4b: Point in a Rectangle
// ============================================================================
/*
 * Write a function:   function pointInRectangle(px, py, x, y, width, height)
 *   - (px, py) is a point
 *   - the rectangle's top left corner is (x, y), and it's width wide and height tall:
 *     the same rectangle as fillRect(x, y, width, height)
 *   - it RETURNS true if the point is inside the rectangle or on its edge,
 *     and false if it's outside
 *
 * Example:  pointInRectangle(15, 15, 10, 10, 20, 20) gives back true
 *           pointInRectangle(35, 15, 10, 10, 20, 20) gives back false
 */
function runTests_pointInRectangle(runner) {
  var shape = "pointInRectangle(px, py, x, y, width, height)";
  if (!mt_exists(runner, "pointInRectangle", shape)) return;
  mt_hasParams(runner, "pointInRectangle", shape, 6);

  // the rectangle 10, 10, 20, 20 goes from x = 10 to 30, and from y = 10 to 30
  function check(px, py, want, rect) {
    rect = rect || [10, 10, 20, 20];
    return mt_returns(runner, "pointInRectangle", [px, py].concat(rect), want, function (got) {
      if (typeof got === "string") return "That's text. Return true or false with no quotes.";
      if (want === true && got === false && (px === rect[0] || py === rect[1] || px === rect[0] + rect[2] || py === rect[1] + rect[3])) {
        return "A point on the edge counts as inside. Use <= and >=, not < and >.";
      }
      if (want === false && got === true && px >= rect[0] && px <= rect[0] + rect[2]) {
        return "The point is outside the rectangle top to bottom. Check y as well as x: py has to be from y to y + height.";
      }
      if (want === false && got === true && px > rect[0] + rect[2]) return "The rectangle's right edge is at x + width.";
      if (want === false && got === undefined) return "Nothing came back. Add an else that returns false.";
      return "";
    });
  }

  runner.runTest("(15, 15) is inside", function () { return check(15, 15, true); });
  runner.runTest("(5, 15) is outside, to the left", function () { return check(5, 15, false); });
  runner.runTest("(35, 15) is outside, to the right", function () { return check(35, 15, false); });
  runner.runTest("(15, 5) is outside, above", function () { return check(15, 5, false); });
  runner.runTest("(15, 35) is outside, below", function () { return check(15, 35, false); });
  runner.runTest("(10, 15) is on the left edge: inside", function () { return check(10, 15, true); });
  runner.runTest("(30, 30) is on the bottom right corner: inside", function () { return check(30, 30, true); });
  runner.runTest("a wide rectangle: (100, 100) in 50, 80, 100, 40", function () { return check(100, 100, true, [50, 80, 100, 40]); });
  runner.runTest("a wide rectangle: (100, 130) is below 50, 80, 100, 40", function () { return check(100, 130, false, [50, 80, 100, 40]); });
}

// ============================================================================
// Invaders 4c: Overlap on a Line
// ============================================================================
/*
 * Two ranges on a number line. The first goes from start1 to end1, and the second goes
 * from start2 to end2. (Each range's start is smaller than its end.)
 *
 * Write a function:   function rangesOverlap(start1, end1, start2, end2)
 *   - it RETURNS true if the two ranges overlap, and false if they don't
 *   - ranges that only touch (one ends exactly where the other starts) DON'T overlap
 *
 * Example:  rangesOverlap(0, 10, 5, 15) gives back true
 *           rangesOverlap(0, 10, 10, 20) gives back false   (they only touch)
 *
 * This is the x half of your game's overlaps() function.
 */
function runTests_rangesOverlap(runner) {
  var shape = "rangesOverlap(start1, end1, start2, end2)";
  if (!mt_exists(runner, "rangesOverlap", shape)) return;
  mt_hasParams(runner, "rangesOverlap", shape, 4);

  function check(s1, e1, s2, e2, want) {
    return mt_returns(runner, "rangesOverlap", [s1, e1, s2, e2], want, function (got) {
      if (typeof got === "string") return "That's text. Return true or false with no quotes.";
      if (want === false && got === true && (e1 === s2 || e2 === s1)) return "Ranges that only touch don't overlap. Use < and >, not <= and >=.";
      if (want === true && got === false) {
        return "They do overlap. Two ranges overlap when each one starts before the other one ends - whichever way round they are," +
          " and even if one is completely inside the other.";
      }
      if (want === false && got === undefined) return "Nothing came back. Add an else that returns false.";
      return "";
    });
  }

  runner.runTest("0-10 and 5-15 overlap", function () { return check(0, 10, 5, 15, true); });
  runner.runTest("5-15 and 0-10 overlap (the other way round)", function () { return check(5, 15, 0, 10, true); });
  runner.runTest("0-10 and 20-30 don't overlap", function () { return check(0, 10, 20, 30, false); });
  runner.runTest("20-30 and 0-10 don't overlap", function () { return check(20, 30, 0, 10, false); });
  runner.runTest("0-10 and 10-20 only touch: no", function () { return check(0, 10, 10, 20, false); });
  runner.runTest("10-20 and 0-10 only touch: no", function () { return check(10, 20, 0, 10, false); });
  runner.runTest("40-60 is inside 0-100: yes", function () { return check(0, 100, 40, 60, true); });
  runner.runTest("0-100 is around 40-60: yes", function () { return check(40, 60, 0, 100, true); });
}

// ============================================================================
// Invaders 4d: Circles Touch
// ============================================================================
/*
 * Two circles. The first has its centre at (x1, y1) and radius r1; the second has its
 * centre at (x2, y2) and radius r2.
 *
 * Write a function:   function circlesTouch(x1, y1, r1, x2, y2, r2)
 *   - it RETURNS true if the circles overlap or touch, and false if there's a gap between them
 *   - they touch when the distance between their centres is no more than r1 + r2
 *   - you can use your distance() function from Part A (it has to be in the same file)
 *
 * Example:  circlesTouch(0, 0, 5, 8, 0, 5) gives back true
 *           circlesTouch(0, 0, 5, 11, 0, 5) gives back false
 */
function runTests_circlesTouch(runner) {
  var shape = "circlesTouch(x1, y1, r1, x2, y2, r2)";
  if (!mt_exists(runner, "circlesTouch", shape)) return;
  mt_hasParams(runner, "circlesTouch", shape, 6);

  function check(x1, y1, r1, x2, y2, r2, want) {
    return mt_returns(runner, "circlesTouch", [x1, y1, r1, x2, y2, r2], want, function (got) {
      var gap = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
      if (typeof got === "string") return "That's text. Return true or false with no quotes.";
      if (want === true && got === false && mt_close(gap, r1 + r2)) return "Exactly touching counts. Use <=, not <.";
      if (got !== want) {
        return "The centres are " + gap + " apart, and the two radii add up to " + (r1 + r2) + ". Compare the distance with r1 + r2.";
      }
      return "";
    });
  }

  runner.runTest("centres 8 apart, radii 5 and 5: they overlap", function () { return check(0, 0, 5, 8, 0, 5, true); });
  runner.runTest("centres 10 apart, radii 5 and 5: exactly touching", function () { return check(0, 0, 5, 10, 0, 5, true); });
  runner.runTest("centres 11 apart, radii 5 and 5: a gap", function () { return check(0, 0, 5, 11, 0, 5, false); });
  runner.runTest("centres 50 apart, radii 10 and 40: exactly touching", function () { return check(0, 0, 10, 30, 40, 40, true); });
  runner.runTest("centres 50 apart, radii 10 and 30: a gap", function () { return check(0, 0, 10, 30, 40, 30, false); });
  runner.runTest("the same centre: they overlap", function () { return check(3, 3, 1, 3, 3, 4, true); });
}

// ============================================================================
// Invaders 5a: Roll a Die
// ============================================================================
/*
 * Write a function:   function rollDie()
 *   - it RETURNS a random whole number from 1 to 6, like rolling a die
 *   - every number from 1 to 6 should be just as likely as the others
 *   - Math.random() gives back a random decimal from 0 up to (but not including) 1
 *   - Math.floor(number) rounds a number down
 */
function runTests_rollDie(runner) {
  if (!mt_exists(runner, "rollDie", "rollDie()")) return;

  // 3000 rolls: each number should come up about 500 times
  var rolls = [], crash = null;
  try {
    for (var i = 0; i < 3000; i++) rolls.push(runner.getFn("rollDie")());
  } catch (e) {
    crash = mt_explain("rollDie", e, runner.getFn("rollDie"));
  }
  function bad(test) {
    for (var i = 0; i < rolls.length; i++) if (test(rolls[i])) return rolls[i];
    return undefined;
  }
  var counts = [0, 0, 0, 0, 0, 0, 0, 0];
  rolls.forEach(function (r) { if (r >= 0 && r <= 7 && r === Math.floor(r)) counts[r] += 1; });

  runner.runTest("it gives back numbers", function () {
    if (crash) return [false, crash];
    var notNumber = bad(function (r) { return typeof r !== "number"; });
    if (notNumber === undefined && rolls.every(function (r) { return typeof r === "number"; })) return [true, "3000 rolls, all numbers"];
    if (rolls[0] === undefined) return [false, "rollDie() gave back nothing. Put return in front of the roll."];
    return [false, "rollDie() gave back " + mt_show(notNumber) + ", which isn't a number."];
  });
  if (crash) return;

  runner.runTest("only whole numbers", function () {
    var decimal = bad(function (r) { return typeof r === "number" && r !== Math.floor(r); });
    return decimal === undefined
      ? [true, "No decimals in 3000 rolls"]
      : [false, "It gave back " + decimal + ". Round it down to a whole number with Math.floor( ... )."];
  });

  runner.runTest("always from 1 to 6", function () {
    if (counts[0] > 0) return [false, "It gave back 0. Math.floor(Math.random() * 6) gives 0 to 5, so add 1 to it."];
    if (counts[7] > 0) return [false, "It gave back 7. Math.round can round up past 6: use Math.floor(Math.random() * 6) + 1."];
    var outside = bad(function (r) { return r < 1 || r > 6; });
    return outside === undefined ? [true, "Every roll was from 1 to 6"] : [false, "It gave back " + outside + "."];
  });

  runner.runTest("every number from 1 to 6 comes up", function () {
    var missing = [1, 2, 3, 4, 5, 6].filter(function (n) { return counts[n] === 0; });
    if (missing.length === 0) return [true, "All six came up in 3000 rolls"];
    var seen = [1, 2, 3, 4, 5, 6].filter(function (n) { return counts[n] > 0; });
    if (seen.length === 1) {
      return [false, "It gave back " + seen[0] + " every time. Roll inside the function, so every call makes a new roll."];
    }
    return [false, missing.join(" and ") + (missing.length === 1 ? " never came up" : " never came up") + " in 3000 rolls."];
  });

  runner.runTest("each number is about as likely as the others", function () {
    var uneven = [1, 2, 3, 4, 5, 6].filter(function (n) { return counts[n] < 400 || counts[n] > 600; });
    var spread = [1, 2, 3, 4, 5, 6].map(function (n) { return n + ": " + counts[n]; }).join(", ");
    if (uneven.length === 0) return [true, "In 3000 rolls - " + spread];
    if (counts[1] < 400 && counts[6] < 400) {
      return [false, "1 and 6 come up about half as often as the others (" + spread + "). That's what Math.round does." +
        " Use Math.floor(Math.random() * 6) + 1."];
    }
    return [false, "Some numbers come up much more often than others. In 3000 rolls - " + spread];
  });
}

// ============================================================================
// Invaders 5b: Random Between
// ============================================================================
/*
 * Write a function:   function randomBetween(low, high)
 *   - it RETURNS a random number from low up to (but not including) high
 *   - decimals are fine: randomBetween(1, 3) might give back 2.4817...
 *   - Math.random() * something gives a random number from 0 up to that something
 *
 * Example:  randomBetween(5, 10) gives back something like 7.31
 *
 * It's how your game picks the wait before the next bomb.
 */
function runTests_randomBetween(runner) {
  if (!mt_exists(runner, "randomBetween", "randomBetween(low, high)")) return;
  mt_hasParams(runner, "randomBetween", "randomBetween(low, high)", 2);

  function sample(low, high) {
    var out = [];
    try {
      for (var i = 0; i < 1000; i++) out.push(runner.getFn("randomBetween")(low, high));
    } catch (e) {
      return { crash: mt_explain("randomBetween", e, runner.getFn("randomBetween")) };
    }
    return { values: out };
  }

  function checkRange(low, high) {
    var s = sample(low, high);
    if (s.crash) return [false, s.crash];
    var v = s.values;
    if (v[0] === undefined) return [false, "randomBetween(" + low + ", " + high + ") gave back nothing. Put return in front of the answer."];
    var notNumber = v.filter(function (x) { return typeof x !== "number" || isNaN(x); });
    if (notNumber.length) return [false, "randomBetween(" + low + ", " + high + ") gave back " + mt_show(notNumber[0]) + ", which isn't a number."];
    var smallest = Math.min.apply(null, v), biggest = Math.max.apply(null, v);
    var range = "From 1000 calls, the smallest was " + smallest + " and the biggest was " + biggest + ".";
    if (smallest >= 0 && biggest < high - low && low > 0) {
      return [false, range + " They're all from 0 to " + (high - low) + ": add low to move them up to start at " + low + "."];
    }
    if (smallest >= low && biggest >= high && biggest < 2 * high - low + 1) {
      return [false, range + " Some are " + high + " or more. Multiply Math.random() by (high - low), not by high."];
    }
    if (smallest < low || biggest >= high) return [false, range + " Every number should be from " + low + " up to (not including) " + high + "."];
    var width = high - low;
    if (smallest > low + width * 0.1 || biggest < high - width * 0.1) {
      return [false, range + " The numbers should spread out over the whole range, from " + low + " to " + high + "."];
    }
    return [true, "randomBetween(" + low + ", " + high + ") x 1000: all from " + low + " up to " + high + ", spread right across"];
  }

  runner.runTest("randomBetween(5, 10) stays from 5 up to 10", function () { return checkRange(5, 10); });
  runner.runTest("randomBetween(-3, 3) works with negative numbers", function () { return checkRange(-3, 3); });
  runner.runTest("randomBetween(100, 101) works for a narrow range", function () { return checkRange(100, 101); });
  runner.runTest("it gives decimals, not just whole numbers", function () {
    var s = sample(1, 3);
    if (s.crash) return [false, s.crash];
    var decimals = s.values.filter(function (x) { return typeof x === "number" && x !== Math.floor(x); });
    return decimals.length > 0
      ? [true, "For example, " + decimals[0]]
      : [false, "Every answer was a whole number. Leave out Math.floor: decimals are fine here."];
  });
  runner.runTest("it's different every time", function () {
    var s = sample(0, 100);
    if (s.crash) return [false, s.crash];
    var first = s.values[0];
    return s.values.some(function (x) { return x !== first; })
      ? [true, "1000 different-looking numbers"]
      : [false, "It gave back " + first + " every time. Call Math.random() inside the function, so every call is new."];
  });
}

// ============================================================================
// Invaders 5c: Countdown
// ============================================================================
/*
 * At the top of your file:
 *     var timeLeft = 10;       // how many seconds are left on the timer
 *     var finished = false;    // has the timer run out?
 *
 * Write a function:   function countDown(seconds)
 *   - it takes seconds away from timeLeft
 *   - if that brings timeLeft to 0 or below, timeLeft becomes exactly 0, and finished becomes true
 *
 * Example:  timeLeft = 10 -> countDown(3) -> timeLeft = 7, finished = false
 *           timeLeft = 2  -> countDown(5) -> timeLeft = 0 (not -3), finished = true
 */
function runTests_countDown(runner) {
  if (!mt_exists(runner, "countDown", "countDown(seconds)")) return;
  mt_hasParams(runner, "countDown", "countDown(seconds)", 1);

  mt_startsAt(runner, "countDown", "timeLeft", "number", 10, "var timeLeft = 10;");
  mt_startsAt(runner, "countDown", "finished", "boolean", false, "var finished = false;");

  function hints(start) {
    return function (g) {
      if (typeof g.finished === "string") return "finished became text. Write true and false with no quotes.";
      if (g.timeLeft === start) return "timeLeft didn't change. Take the seconds away from it: timeLeft -= seconds.";
      if (g.timeLeft < 0) return "It went below 0. When timeLeft is 0 or less, set it to exactly 0.";
      if (g.timeLeft === 0 && g.finished === false) return "The time has run out, so finished should be true.";
      if (g.timeLeft > 0 && g.finished === true) return "There's still time left, so finished should still be false.";
      return "";
    };
  }

  runner.runTest("10 seconds, countDown(3): 7 left", function () {
    return mt_scenario(runner, "countDown", { timeLeft: 10, finished: false }, [[3]], { timeLeft: 7, finished: false }, hints(10));
  });
  runner.runTest("7 seconds, countDown(7): exactly 0, finished", function () {
    return mt_scenario(runner, "countDown", { timeLeft: 7, finished: false }, [[7]], { timeLeft: 0, finished: true }, hints(7));
  });
  runner.runTest("2 seconds, countDown(5): 0, not -3, finished", function () {
    return mt_scenario(runner, "countDown", { timeLeft: 2, finished: false }, [[5]], { timeLeft: 0, finished: true }, hints(2));
  });
  runner.runTest("1 second, countDown(0.5): half a second left", function () {
    return mt_scenario(runner, "countDown", { timeLeft: 1, finished: false }, [[0.5]], { timeLeft: 0.5, finished: false }, hints(1));
  });
  runner.runTest("5 seconds, countDown(2) twice: 1 left", function () {
    return mt_scenario(runner, "countDown", { timeLeft: 5, finished: false }, [[2], [2]], { timeLeft: 1, finished: false }, hints(5));
  });
}

// ============================================================================
// Invaders 5d: Traffic Light
// ============================================================================
/*
 * A traffic light goes green, then yellow, then red, then back to green.
 *
 * Write a function:   function nextLight(light)
 *   - light is "green", "yellow" or "red"
 *   - it RETURNS the colour that comes next: "green" gives back "yellow",
 *     "yellow" gives back "red", and "red" gives back "green"
 *
 * Your game's gameState works the same way: one variable, and rules for what comes next.
 */
function runTests_nextLight(runner) {
  if (!mt_exists(runner, "nextLight", "nextLight(light)")) return;
  mt_hasParams(runner, "nextLight", "nextLight(light)", 1);

  function check(light, want) {
    return mt_returns(runner, "nextLight", [light], want, function (got) {
      if (got === light) return "It gave back the same colour. It should give back the one that comes next.";
      return "";
    });
  }

  runner.runTest("green -> yellow", function () { return check("green", "yellow"); });
  runner.runTest("yellow -> red", function () { return check("yellow", "red"); });
  runner.runTest("red -> green", function () { return check("red", "green"); });
  runner.runTest("three changes from green get back to green", function () {
    var fn = runner.getFn("nextLight"), light = "green", seen = ["green"];
    try {
      for (var i = 0; i < 3; i++) { light = fn(light); seen.push(light); }
    } catch (e) { return [false, mt_explain("nextLight", e, fn)]; }
    return light === "green"
      ? [true, seen.map(mt_show).join(" -> ")]
      : [false, seen.map(mt_show).join(" -> ") + ". It should end up back at \"green\"."];
  });
}

// ============================================================================
// Invaders 6a: A Pet
// ============================================================================
/*
 * At the top of your file, make an OBJECT called pet, with three properties:
 *     name      - your pet's name, as text (make one up if you like)
 *     species   - what kind of animal it is, as text: "dog", "cat", "goldfish"...
 *     age       - how old it is, as a whole number
 *
 * Example:  var pet = { name: "Rex", species: "dog", age: 3 };
 */
function runTests_pet(runner) {
  var pet = runner.getFn("pet");

  runner.runTest("pet is an object", function () {
    if (typeof pet === "undefined") {
      var near = mt_nearMiss(runner, "pet");
      if (near) return [false, "Found " + near + ", but the tester looks for pet. Names have to match exactly, capitals included."];
      return [false, "Couldn't find a variable called pet. Put  var pet = { name: \"Rex\", species: \"dog\", age: 3 };" +
        "  at the top of your file, outside any function."];
    }
    if (typeof pet === "string") return [false, "pet holds text. An object goes in curly brackets:  { name: \"Rex\", species: \"dog\", age: 3 }"];
    if (Array.isArray(pet)) return [false, "pet is a list, in [square brackets]. An object goes in {curly brackets}, with a name for each property."];
    if (!pet || typeof pet !== "object") return [false, "pet should be an object in {curly brackets}, but it holds " + mt_show(pet) + "."];
    return [true, "pet = " + mt_show(pet)];
  });
  if (!pet || typeof pet !== "object" || Array.isArray(pet)) return;

  function property(name, kind, example) {
    if (!Object.prototype.hasOwnProperty.call(pet, name)) {
      var other = Object.keys(pet).filter(function (k) { return k.toLowerCase() === name; })[0];
      if (other) return [false, "pet has a property called " + other + ", but the tester looks for " + name + ", all small letters."];
      return [false, "pet has no property called " + name + ". Add one inside the { }, like  " + example];
    }
    var value = pet[name];
    if (kind === "string" && typeof value !== "string") return [false, "pet." + name + " should be text in \"quotes\", but it's " + mt_show(value) + "."];
    if (kind === "string" && value.trim() === "") return [false, "pet." + name + " is empty text."];
    if (kind === "number" && typeof value === "string") return [false, "pet." + name + " is text, " + mt_show(value) + ". Numbers don't have quotes."];
    if (kind === "number" && (typeof value !== "number" || value !== Math.floor(value) || value < 0)) {
      return [false, "pet." + name + " should be a whole number, like 3, but it's " + mt_show(value) + "."];
    }
    return [true, "pet." + name + " = " + mt_show(value)];
  }

  runner.runTest("pet has a name (text)", function () { return property("name", "string", "name: \"Rex\""); });
  runner.runTest("pet has a species (text)", function () { return property("species", "string", "species: \"dog\""); });
  runner.runTest("pet has an age (a whole number)", function () { return property("age", "number", "age: 3"); });
}

// ============================================================================
// Invaders 6b: Describe a Pet
// ============================================================================
/*
 * Write a function:   function describePet(pet)
 *   - pet is an object like the one in Part A
 *   - it RETURNS a sentence about that pet, like this:
 *         "Rex is a 3 year old dog."
 *     (the name, " is a ", the age, " year old ", the species, and a full stop)
 *
 * The tester sends in its own pets, so use the parameter, not your pet from Part A.
 */
function runTests_describePet(runner) {
  if (!mt_exists(runner, "describePet", "describePet(pet)")) return;
  mt_hasParams(runner, "describePet", "describePet(pet)", 1);

  function describe(p) { return p.name + " is a " + p.age + " year old " + p.species + "."; }
  var mine = runner.getFn("pet");

  function check(p) {
    return mt_returns(runner, "describePet", [p], describe(p), function (got) {
      if (typeof got !== "string") return "";
      if (mine && typeof mine === "object" && got === describe(mine) && got !== describe(p)) {
        return "That's your pet from Part A. Use the pet that's sent in: the parameter.";
      }
      if (/undefined/.test(got)) return "undefined means a property name doesn't match: name, species and age, all small letters.";
      if (got === describe(p).slice(0, -1)) return "Don't forget the full stop at the end.";
      if (got.replace(/\s+/g, "") === describe(p).replace(/\s+/g, "")) return "Check the spaces between the words.";
      return "";
    });
  }

  runner.runTest("Rex, a 3 year old dog", function () { return check({ name: "Rex", species: "dog", age: 3 }); });
  runner.runTest("Goldie, a 1 year old goldfish", function () { return check({ name: "Goldie", species: "goldfish", age: 1 }); });
  runner.runTest("a pet the tester makes up", function () {
    var names = ["Biscuit", "Pickles", "Luna", "Ziggy"], kinds = ["cat", "hamster", "parrot", "tortoise"];
    return check({ name: names[mt_randomInt(0, 3)], species: kinds[mt_randomInt(0, 3)], age: mt_randomInt(2, 40) });
  });
}

// ============================================================================
// Invaders 6c: Birthday
// ============================================================================
/*
 * Write a function:   function haveBirthday(pet)
 *   - it adds 1 to the age of the pet that's sent in
 *   - it CHANGES the object; it doesn't need to return anything
 *
 * Example:  var rex = { name: "Rex", species: "dog", age: 3 };
 *           haveBirthday(rex);      // now rex.age is 4
 */
function runTests_haveBirthday(runner) {
  if (!mt_exists(runner, "haveBirthday", "haveBirthday(pet)")) return;
  mt_hasParams(runner, "haveBirthday", "haveBirthday(pet)", 1);

  function check(age, times) {
    var p = { name: "Rex", species: "dog", age: age };
    var mine = runner.getFn("pet"), mineAge = mine && typeof mine === "object" ? mine.age : undefined;
    var fn = runner.getFn("haveBirthday"), returned;
    try { for (var i = 0; i < times; i++) returned = fn(p); }
    catch (e) { return [false, mt_explain("haveBirthday", e, fn)]; }
    var want = age + times;
    var what = (times === 1 ? "One birthday" : times + " birthdays") + " for a pet aged " + age;
    if (p.age === want && p.name === "Rex" && p.species === "dog") return [true, what + ": now " + p.age];
    if (p.age === want) return [false, what + ": the age is right, but the name or species changed too. Only change age."];
    if (mine && typeof mine === "object" && mine.age !== mineAge) {
      mine.age = mineAge;
      return [false, what + ": it changed your pet from Part A instead. Change the pet that's sent in: the parameter."];
    }
    if (p.age === age && returned === age + 1) {
      return [false, what + ": it gave back " + returned + ", but the pet's age is still " + age + ". Change the object itself:  pet.age += 1"];
    }
    if (typeof p.age === "string") return [false, what + ": age became text, " + mt_show(p.age) + ". Add the number 1, not \"1\"."];
    if (p.age === age) return [false, what + ": its age is still " + age + ". Add 1 to it:  pet.age += 1"];
    return [false, what + ": its age should be " + want + ", but it's " + mt_show(p.age) + "."];
  }

  runner.runTest("a 3 year old becomes 4", function () { return check(3, 1); });
  runner.runTest("two birthdays: 7 becomes 9", function () { return check(7, 2); });
  runner.runTest("a pet the tester makes up", function () { return check(mt_randomInt(10, 30), 1); });
}

// ============================================================================
// Invaders 6d: Make a Rectangle
// ============================================================================
/*
 * Write a function:   function makeRectangle(x, y, width, height)
 *   - it RETURNS a brand-new object with four properties, x, y, width and height,
 *     holding the four numbers that were sent in
 *
 * Example:  makeRectangle(10, 20, 30, 40) gives back { x: 10, y: 20, width: 30, height: 40 }
 *
 * Your game's makeInvader() works the same way.
 */
function runTests_makeRectangle(runner) {
  var shape = "makeRectangle(x, y, width, height)";
  if (!mt_exists(runner, "makeRectangle", shape)) return;
  mt_hasParams(runner, "makeRectangle", shape, 4);

  function check(x, y, width, height) {
    return mt_returns(runner, "makeRectangle", [x, y, width, height], { x: x, y: y, width: width, height: height }, function (got) {
      if (Array.isArray(got)) return "That's a list, in [square brackets]. An object goes in {curly brackets}, with a name for each property.";
      if (got && typeof got === "object") {
        var missing = ["x", "y", "width", "height"].filter(function (k) { return !Object.prototype.hasOwnProperty.call(got, k); });
        if (missing.length) return "It has no property called " + missing[0] + ". The four names are x, y, width and height, all small letters.";
        var extra = Object.keys(got).filter(function (k) { return ["x", "y", "width", "height"].indexOf(k) < 0; });
        if (extra.length) return "It has an extra property, " + extra[0] + ". Just the four: x, y, width and height.";
        return "Check which number goes in which property.";
      }
      return "";
    });
  }

  runner.runTest("makeRectangle(10, 20, 30, 40)", function () { return check(10, 20, 30, 40); });
  runner.runTest("makeRectangle(0, 0, 800, 600)", function () { return check(0, 0, 800, 600); });
  runner.runTest("random numbers", function () { return check(mt_randomInt(0, 99), mt_randomInt(0, 99), mt_randomInt(1, 99), mt_randomInt(1, 99)); });
  runner.runTest("a new object every time", function () {
    var fn = runner.getFn("makeRectangle"), a, b;
    try { a = fn(1, 2, 3, 4); b = fn(5, 6, 7, 8); } catch (e) { return [false, mt_explain("makeRectangle", e, fn)]; }
    if (!a || !b || typeof a !== "object") return [false, "Make the other tests pass first."];
    if (a === b || a.x === 5) {
      return [false, "Both calls gave back the same object, so making the second rectangle changed the first." +
        " Make a new object each time: put the { } inside the function, after return."];
    }
    return [true, "Two calls, two separate rectangles"];
  });
}

// ============================================================================
// Invaders 7a: Count to Ten
// ============================================================================
/*
 * This part is a whole program, not a function. Somewhere in your file, OUTSIDE any
 * function, write a loop that prints the numbers 1 to 10, one on each line:
 *     1
 *     2
 *     ...
 *     10
 *
 * Use a for loop, not ten console.log lines. Nothing else in your file should print
 * anything when it runs.
 */
function runTests_countToTen(runner) {
  var want = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  runner.runTest("prints 1 to 10, one on each line", function () {
    var got = runner.output().map(function (l) { return String(l).trim(); });
    var result = runner.checkOutput(want);
    if (result[0]) return result;
    var hint = "";
    if (got.length === 0 && /function[^{]*\{[^}]*\bfor\s*\(/.test(runner.source().replace(/\s+/g, " "))) {
      hint = "\nIf your loop is inside a function, nothing runs until something calls it. Put the loop outside any function.";
    } else if (got[0] === "0") {
      hint = "\nStart counting at 1, not 0.";
    } else if (got.length === 9 && got[8] === "9") {
      hint = "\n10 is missing. Keep going while i <= 10 (or i < 11).";
    } else if (got.length > 10) {
      hint = "\nIf you printed other things while testing, take those lines out.";
    }
    return [false, result[1] + hint];
  });

  runner.runTest("uses a loop, not ten console.log lines", function () {
    var logs = (runner.source().match(/console\.log\s*\(/g) || []).length;
    return logs >= 10
      ? [false, "Your file has " + logs + " console.log lines. Print the numbers with one console.log inside a for loop."]
      : [true, "Done with a loop"];
  });
}

// ============================================================================
// Invaders 7b: Total
// ============================================================================
/*
 * Write a function:   function total(numbers)
 *   - numbers is a list of numbers, like [4, 10, 3]
 *   - it RETURNS all of them added up
 *   - an empty list, [], adds up to 0
 *
 * Example:  total([4, 10, 3]) gives back 17
 */
function runTests_total(runner) {
  if (!mt_exists(runner, "total", "total(numbers)")) return;
  mt_hasParams(runner, "total", "total(numbers)", 1);

  function sum(list) { var t = 0; for (var i = 0; i < list.length; i++) t += list[i]; return t; }
  function check(list) {
    return mt_returns(runner, "total", [list.slice()], sum(list), function (got) {
      if (list.length > 1 && got === list[list.length - 1]) {
        return "It gave back only the last number. Keep a running total: start at 0, and add each number to it (+=).";
      }
      if (list.length > 1 && got === list.length && sum(list) !== list.length) return "That's how many numbers there are, not their total.";
      if (list.length > 1 && mt_close(got, sum(list) - list[0])) return "It missed the first number. Start the loop at 0: list[0] is the first one.";
      if (list.length > 1 && mt_close(got, sum(list) - list[list.length - 1])) return "It missed the last number. Keep going while i < numbers.length.";
      if (typeof got === "number" && isNaN(got)) {
        return "NaN: the loop went one past the end. numbers[numbers.length] doesn't exist, and adding it gives NaN. Use <, not <=.";
      }
      if (typeof got === "string") return "It joined the numbers together as text. Start the total at 0, not \"\".";
      return "";
    });
  }

  runner.runTest("total([4, 10, 3]) is 17", function () { return check([4, 10, 3]); });
  runner.runTest("total([7]) is 7", function () { return check([7]); });
  runner.runTest("an empty list adds up to 0", function () { return check([]); });
  runner.runTest("negative numbers: total([-5, 5, 10]) is 10", function () { return check([-5, 5, 10]); });
  runner.runTest("decimals: total([0.5, 0.25]) is 0.75", function () { return check([0.5, 0.25]); });
  runner.runTest("a random list", function () {
    var list = [];
    for (var i = 0; i < 8; i++) list.push(mt_randomInt(1, 50));
    return check(list);
  });
}

// ============================================================================
// Invaders 7c: Count Passing
// ============================================================================
/*
 * Write a function:   function countPassing(marks)
 *   - marks is a list of marks, like [40, 75, 50]
 *   - it RETURNS HOW MANY of them are 50 or more
 *
 * Example:  countPassing([40, 75, 50]) gives back 2
 */
function runTests_countPassing(runner) {
  if (!mt_exists(runner, "countPassing", "countPassing(marks)")) return;
  mt_hasParams(runner, "countPassing", "countPassing(marks)", 1);

  function check(list) {
    var want = 0, passingTotal = 0;
    for (var i = 0; i < list.length; i++) if (list[i] >= 50) { want += 1; passingTotal += list[i]; }
    return mt_returns(runner, "countPassing", [list.slice()], want, function (got) {
      if (list.indexOf(50) >= 0 && got === want - 1) return "A mark of exactly 50 passes. Use >=, not >.";
      if (got === passingTotal && want > 1) return "You added the marks up. Count them instead: add 1 each time you find a passing mark.";
      if (got === list.length && want !== list.length) return "That's how many marks there are, passing or not.";
      return "";
    });
  }

  runner.runTest("countPassing([40, 75, 50]) is 2", function () { return check([40, 75, 50]); });
  runner.runTest("an empty list: 0", function () { return check([]); });
  runner.runTest("nobody passed: [10, 20, 30]", function () { return check([10, 20, 30]); });
  runner.runTest("everybody passed: [100, 99, 50]", function () { return check([100, 99, 50]); });
  runner.runTest("49.5 doesn't pass: [49.5, 50]", function () { return check([49.5, 50]); });
  runner.runTest("a random list", function () {
    var list = [];
    for (var i = 0; i < 10; i++) list.push(mt_randomInt(20, 100));
    return check(list);
  });
}

// ============================================================================
// Invaders 7d: Biggest
// ============================================================================
/*
 * Write a function:   function largest(numbers)
 *   - numbers is a list with at least one number in it
 *   - it RETURNS the biggest number in the list
 *   - work it out with a loop: don't use Math.max
 *
 * Example:  largest([3, 9, 2]) gives back 9
 */
function runTests_largest(runner) {
  if (!mt_exists(runner, "largest", "largest(numbers)")) return;
  mt_hasParams(runner, "largest", "largest(numbers)", 1);

  function check(list) {
    var want = list[0];
    for (var i = 1; i < list.length; i++) if (list[i] > want) want = list[i];
    return mt_returns(runner, "largest", [list.slice()], want, function (got) {
      if (got === 0 && list.indexOf(0) < 0) {
        return "It gave back 0, which isn't even in the list. Start with the first number, numbers[0], instead of 0.";
      }
      if (list.length > 1 && got === list[list.length - 1]) {
        return "It gave back the last number. Only replace your biggest-so-far when you find a number that's bigger than it.";
      }
      if (list.length > 1 && got === list[0]) return "It gave back the first number. Check every number in the list, all the way to the end.";
      return "";
    });
  }

  runner.runTest("largest([3, 9, 2]) is 9", function () { return check([3, 9, 2]); });
  runner.runTest("the biggest first: [9, 3, 2]", function () { return check([9, 3, 2]); });
  runner.runTest("the biggest last: [2, 3, 9]", function () { return check([2, 3, 9]); });
  runner.runTest("all negative: [-5, -2, -9]", function () { return check([-5, -2, -9]); });
  runner.runTest("just one number: [7]", function () { return check([7]); });
  runner.runTest("a random list", function () {
    var list = [];
    for (var i = 0; i < 10; i++) list.push(mt_randomInt(-100, 100));
    return check(list);
  });
  runner.runTest("works it out with a loop, not Math.max", function () {
    var code = String(runner.getFn("largest"));
    if (/Math\.max/.test(code)) return [false, "This one's for practising loops, so don't use Math.max. Go through the list with a for loop."];
    return /\b(for|while)\s*\(/.test(code) ? [true, "Done with a loop"] : [false, "Go through the list with a for loop."];
  });
}

// ============================================================================
// Invaders 8a: Cart Total
// ============================================================================
/*
 * A shopping cart is a list of objects, one for each item:
 *     [ { name: "apple", price: 0.5, quantity: 6 },
 *       { name: "bread", price: 3.25, quantity: 1 } ]
 *
 * Write a function:   function cartTotal(items)
 *   - it RETURNS the total cost: each item's price times its quantity, all added up
 *   - an empty cart costs 0
 *
 * Example:  the cart above gives back 6.25   (0.5 x 6 + 3.25 x 1)
 */
function runTests_cartTotal(runner) {
  if (!mt_exists(runner, "cartTotal", "cartTotal(items)")) return;
  mt_hasParams(runner, "cartTotal", "cartTotal(items)", 1);

  function copy(items) { return items.map(function (it) { return { name: it.name, price: it.price, quantity: it.quantity }; }); }
  function check(items) {
    var want = 0, prices = 0, quantities = 0;
    items.forEach(function (it) { want += it.price * it.quantity; prices += it.price; quantities += it.quantity; });
    return mt_returns(runner, "cartTotal", [copy(items)], want, function (got) {
      if (mt_close(got, prices) && !mt_close(prices, want)) return "You added up the prices. Multiply each item's price by its quantity first.";
      if (mt_close(got, quantities) && !mt_close(quantities, want)) return "You added up the quantities. Multiply each item's price by its quantity.";
      if (typeof got === "number" && isNaN(got)) return "NaN: a property name doesn't match (price and quantity, small letters), or the loop went past the end.";
      return "";
    });
  }

  runner.runTest("apples and bread: 6.25", function () {
    return check([{ name: "apple", price: 0.5, quantity: 6 }, { name: "bread", price: 3.25, quantity: 1 }]);
  });
  runner.runTest("an empty cart: 0", function () { return check([]); });
  runner.runTest("two bottles of milk at 4: 8", function () { return check([{ name: "milk", price: 4, quantity: 2 }]); });
  runner.runTest("a bigger cart", function () {
    return check([{ name: "pens", price: 1.5, quantity: 4 }, { name: "binder", price: 6, quantity: 1 },
      { name: "paper", price: 8.75, quantity: 2 }, { name: "eraser", price: 0.25, quantity: 3 }]);
  });
  runner.runTest("a random cart", function () {
    var items = [];
    for (var i = 0; i < 5; i++) items.push({ name: "item" + i, price: mt_randomInt(1, 20), quantity: mt_randomInt(1, 5) });
    return check(items);
  });
}

// ============================================================================
// Invaders 8b: Find a Price
// ============================================================================
/*
 * Write a function:   function findPrice(items, name)
 *   - items is a shopping cart like Part A's
 *   - it RETURNS the price of the item with that name
 *   - if no item has that name, it RETURNS -1
 *
 * Example:  findPrice(cart, "bread") gives back 3.25
 *           findPrice(cart, "cheese") gives back -1
 */
function runTests_findPrice(runner) {
  if (!mt_exists(runner, "findPrice", "findPrice(items, name)")) return;
  mt_hasParams(runner, "findPrice", "findPrice(items, name)", 2);

  function cart() {
    return [{ name: "apple", price: 0.5, quantity: 6 }, { name: "bread", price: 3.25, quantity: 1 },
      { name: "milk", price: 4, quantity: 2 }, { name: "jam", price: 5.5, quantity: 1 }];
  }
  // Does it only ever find the first item? That's a return -1 inside the loop.
  function onlyFirst() {
    var fn = runner.getFn("findPrice");
    try { return fn(cart(), "apple") === 0.5 && fn(cart(), "jam") === -1; } catch (e) { return false; }
  }
  function check(items, name, want) {
    return mt_returns(runner, "findPrice", [items, name], want, function (got) {
      if (got === -1 && want !== -1 && onlyFirst()) {
        return "Your loop gives up after the first item. Only return -1 after the loop has checked every item.";
      }
      if (got === undefined && want === -1) return "Nothing came back. After the loop, return -1.";
      if (got && typeof got === "object") return "That's the whole item. Give back just its price:  items[i].price";
      return "";
    });
  }

  runner.runTest("the first item: apple costs 0.5", function () { return check(cart(), "apple", 0.5); });
  runner.runTest("a middle item: bread costs 3.25", function () { return check(cart(), "bread", 3.25); });
  runner.runTest("the last item: jam costs 5.5", function () { return check(cart(), "jam", 5.5); });
  runner.runTest("not in the cart: cheese gives -1", function () { return check(cart(), "cheese", -1); });
  runner.runTest("an empty cart gives -1", function () { return check([], "apple", -1); });
  runner.runTest("names have to match exactly: Bread gives -1", function () { return check(cart(), "Bread", -1); });
}

// ============================================================================
// Invaders 8c: Rectangle of Stars
// ============================================================================
/*
 * Write a function:   function printRectangle(rows, columns)
 *   - it PRINTS a rectangle of stars: rows lines, with columns stars on each line
 *   - printRectangle(2, 4) prints:
 *         ****
 *         ****
 *   - build each line as text first (start with "" and add "*" to it), then print the whole line
 */
function runTests_printRectangle(runner) {
  if (!mt_exists(runner, "printRectangle", "printRectangle(rows, columns)")) return;
  mt_hasParams(runner, "printRectangle", "printRectangle(rows, columns)", 2);

  function check(rows, columns) {
    var want = [];
    for (var r = 0; r < rows; r++) want.push(new Array(columns + 1).join("*"));
    var out = mt_capture(runner, "printRectangle", [rows, columns]);
    if (out.crash) return [false, out.crash];
    var result = runner.checkOutput(want, out.logs);
    if (result[0]) return [true, "printRectangle(" + rows + ", " + columns + ") printed:\n" + (want.length ? want.join("\n") : "(nothing)")];
    var hint = "";
    if (out.logs.length === rows * columns && rows * columns > rows && out.logs.every(function (l) { return l === "*"; })) {
      hint = "\nIt printed one star on each line. Build each line as text first (line += \"*\"), then print the whole line.";
    } else if (out.logs.length === columns && rows !== columns && out.logs[0] && out.logs[0].length === rows) {
      hint = "\nRows and columns are swapped: rows is how many lines, and columns is how many stars on each line.";
    }
    return [false, "printRectangle(" + rows + ", " + columns + "): " + result[1] + hint];
  }

  runner.runTest("printRectangle(2, 4)", function () { return check(2, 4); });
  runner.runTest("printRectangle(3, 1)", function () { return check(3, 1); });
  runner.runTest("printRectangle(1, 5)", function () { return check(1, 5); });
  runner.runTest("printRectangle(4, 3)", function () { return check(4, 3); });
  runner.runTest("printRectangle(0, 3) prints nothing", function () { return check(0, 3); });
}

// ============================================================================
// Invaders 8d: Times Table
// ============================================================================
/*
 * Write a function:   function printTimesTable(size)
 *   - it PRINTS a times table with size rows and size columns
 *   - row 1 is 1 x 1, 1 x 2, 1 x 3 ...; row 2 is 2 x 1, 2 x 2, 2 x 3 ...; and so on
 *   - the numbers in a row are separated by one space
 *   - printTimesTable(3) prints:
 *         1 2 3
 *         2 4 6
 *         3 6 9
 */
function runTests_printTimesTable(runner) {
  if (!mt_exists(runner, "printTimesTable", "printTimesTable(size)")) return;
  mt_hasParams(runner, "printTimesTable", "printTimesTable(size)", 1);

  function check(size) {
    var want = [];
    for (var r = 1; r <= size; r++) {
      var row = [];
      for (var c = 1; c <= size; c++) row.push(r * c);
      want.push(row.join(" "));
    }
    var out = mt_capture(runner, "printTimesTable", [size]);
    if (out.crash) return [false, out.crash];
    var result = runner.checkOutput(want, out.logs);
    if (result[0]) return [true, "printTimesTable(" + size + ") printed:\n" + want.join("\n")];
    var hint = "";
    if (out.logs.length === size * size && size > 1) hint = "\nIt printed one number on each line. Build each row as text first, then print the whole row.";
    else if (out.logs.length && /^0/.test(String(out.logs[0]).trim())) hint = "\nStart counting at 1, not 0.";
    return [false, "printTimesTable(" + size + "): " + result[1] + hint];
  }

  runner.runTest("printTimesTable(3)", function () { return check(3); });
  runner.runTest("printTimesTable(1)", function () { return check(1); });
  runner.runTest("printTimesTable(5)", function () { return check(5); });
}

// ============================================================================
// Invaders 9a: Even Numbers
// ============================================================================
/*
 * Write a function:   function evensUpTo(n)
 *   - it RETURNS a new list of the even numbers from 2 up to n (n included, if it's even)
 *   - start with an empty list, [], and push each even number onto it
 *
 * Example:  evensUpTo(10) gives back [2, 4, 6, 8, 10]
 *           evensUpTo(9) gives back [2, 4, 6, 8]
 *           evensUpTo(1) gives back []   (there are no even numbers from 2 up to 1)
 */
function runTests_evensUpTo(runner) {
  if (!mt_exists(runner, "evensUpTo", "evensUpTo(n)")) return;
  mt_hasParams(runner, "evensUpTo", "evensUpTo(n)", 1);

  function check(n) {
    var want = [];
    for (var i = 2; i <= n; i += 2) want.push(i);
    return mt_returns(runner, "evensUpTo", [n], want, function (got) {
      if (!Array.isArray(got)) return got === undefined ? "Nothing came back. Return the list at the end." : "It should give back a list, in [square brackets].";
      if (got[0] === 0) return "It starts at 0. Start at 2.";
      if (got.some(function (x) { return x % 2 !== 0; })) return "There are odd numbers in it. Go up by 2 each time (i += 2).";
      if (n % 2 === 0 && n >= 2 && got.indexOf(n) < 0) return n + " is even, so it belongs at the end. Keep going while i <= n.";
      return "";
    });
  }

  runner.runTest("evensUpTo(10)", function () { return check(10); });
  runner.runTest("evensUpTo(9)", function () { return check(9); });
  runner.runTest("evensUpTo(2)", function () { return check(2); });
  runner.runTest("evensUpTo(1) is an empty list", function () { return check(1); });
  runner.runTest("evensUpTo(20)", function () { return check(20); });
}

// ============================================================================
// Invaders 9b: Passing Marks
// ============================================================================
/*
 * Write a function:   function passingMarks(marks)
 *   - it RETURNS a NEW list holding only the marks that are 50 or more, in the same order
 *   - it doesn't change the list that was sent in
 *
 * Example:  passingMarks([40, 75, 50, 10]) gives back [75, 50]
 */
function runTests_passingMarks(runner) {
  if (!mt_exists(runner, "passingMarks", "passingMarks(marks)")) return;
  mt_hasParams(runner, "passingMarks", "passingMarks(marks)", 1);

  function check(list) {
    var want = list.filter(function (m) { return m >= 50; });
    return mt_returns(runner, "passingMarks", [list.slice()], want, function (got) {
      if (typeof got === "number") return "That's a number. Give back a list of the passing marks: push each one onto a new list.";
      if (Array.isArray(got) && list.indexOf(50) >= 0 && got.indexOf(50) < 0) return "A mark of exactly 50 passes. Use >=, not >.";
      return "";
    });
  }

  runner.runTest("passingMarks([40, 75, 50, 10]) is [75, 50]", function () { return check([40, 75, 50, 10]); });
  runner.runTest("an empty list gives an empty list", function () { return check([]); });
  runner.runTest("nobody passed: [10, 20, 49]", function () { return check([10, 20, 49]); });
  runner.runTest("everybody passed: [90, 50, 66]", function () { return check([90, 50, 66]); });
  runner.runTest("the list that's sent in doesn't change", function () {
    var marks = [40, 75, 50, 10], fn = runner.getFn("passingMarks");
    try { fn(marks); } catch (e) { return [false, mt_explain("passingMarks", e, fn)]; }
    return mt_same(marks, [40, 75, 50, 10])
      ? [true, "marks is still [40, 75, 50, 10]"]
      : [false, "The list that was sent in changed to " + mt_show(marks) + ". Make a new, empty list, push the passing marks onto it, and leave marks alone."];
  });
}

// ============================================================================
// Invaders 9c: Remove All
// ============================================================================
/*
 * Write a function:   function removeAll(list, value)
 *   - it takes every copy of value out of list
 *   - it CHANGES the list that was sent in (use splice); it doesn't need to return anything
 *
 * Example:  var numbers = [1, 2, 3, 2];
 *           removeAll(numbers, 2);      // now numbers is [1, 3]
 *
 * Watch out for two copies next to each other, like [2, 2, 5].
 */
function runTests_removeAll(runner) {
  if (!mt_exists(runner, "removeAll", "removeAll(list, value)")) return;
  mt_hasParams(runner, "removeAll", "removeAll(list, value)", 2);

  function check(list, value) {
    var before = list.slice(), want = list.filter(function (x) { return x !== value; });
    var fn = runner.getFn("removeAll"), returned;
    try { returned = fn(list, value); } catch (e) { return [false, mt_explain("removeAll", e, fn)]; }
    var call = "removeAll(" + mt_show(before) + ", " + mt_show(value) + ")";
    if (mt_same(list, want)) return [true, call + ": the list is now " + mt_show(list)];
    var msg = call + ": the list should be " + mt_show(want) + ", but it's " + mt_show(list) + ".";
    if (mt_same(list, before) && mt_same(returned, want)) {
      msg += " It gave back the right list, but the one that was sent in didn't change. Take the values out of it with list.splice(i, 1).";
    } else if (mt_same(list, before)) {
      msg += " Nothing was taken out. list.splice(i, 1) takes out the item at index i.";
    } else if (list.indexOf(value) >= 0) {
      msg += " There's still a " + mt_show(value) + " in it. Going forwards, taking an item out makes the loop skip the item after it." +
        " Go through the list backwards instead, like removeDone() in your game.";
    }
    return [false, msg];
  }

  runner.runTest("[1, 2, 3, 2] without the 2s", function () { return check([1, 2, 3, 2], 2); });
  runner.runTest("two in a row: [2, 2, 5] without the 2s", function () { return check([2, 2, 5], 2); });
  runner.runTest("nothing to take out: [4, 5] without 9", function () { return check([4, 5], 9); });
  runner.runTest("everything goes: [7, 7, 7] without the 7s", function () { return check([7, 7, 7], 7); });
  runner.runTest("an empty list stays empty", function () { return check([], 1); });
  runner.runTest("text works too: [\"a\", \"b\", \"a\"] without \"a\"", function () { return check(["a", "b", "a"], "a"); });
}

// ============================================================================
// Invaders 9d: No Duplicates
// ============================================================================
/*
 * Write a function:   function noDuplicates(list)
 *   - it RETURNS a new list with every value from list, but each value only once,
 *     in the order they first appear
 *   - it doesn't change the list that was sent in
 *   - newList.includes(value) gives back true if value is already in newList
 *
 * Example:  noDuplicates([1, 2, 1, 3, 2]) gives back [1, 2, 3]
 */
function runTests_noDuplicates(runner) {
  if (!mt_exists(runner, "noDuplicates", "noDuplicates(list)")) return;
  mt_hasParams(runner, "noDuplicates", "noDuplicates(list)", 1);

  function check(list) {
    var want = [];
    list.forEach(function (x) { if (want.indexOf(x) < 0) want.push(x); });
    return mt_returns(runner, "noDuplicates", [list.slice()], want, function (got) {
      if (Array.isArray(got) && got.length === want.length && mt_same(got.slice().sort(), want.slice().sort())) {
        return "The right values, in the wrong order. Keep the first copy of each value, in the order they first appear.";
      }
      if (Array.isArray(got) && got.length > want.length) return "Some values are still in it twice. Before you push a value, check that it isn't already in the new list.";
      return "";
    });
  }

  runner.runTest("noDuplicates([1, 2, 1, 3, 2]) is [1, 2, 3]", function () { return check([1, 2, 1, 3, 2]); });
  runner.runTest("an empty list gives an empty list", function () { return check([]); });
  runner.runTest("all the same: [5, 5, 5] is [5]", function () { return check([5, 5, 5]); });
  runner.runTest("no duplicates to start with: [3, 1, 2]", function () { return check([3, 1, 2]); });
  runner.runTest("text: [\"red\", \"blue\", \"red\", \"green\"]", function () { return check(["red", "blue", "red", "green"]); });
  runner.runTest("the list that's sent in doesn't change", function () {
    var list = [1, 2, 1, 3, 2], fn = runner.getFn("noDuplicates");
    try { fn(list); } catch (e) { return [false, mt_explain("noDuplicates", e, fn)]; }
    return mt_same(list, [1, 2, 1, 3, 2])
      ? [true, "The list is still [1, 2, 1, 3, 2]"]
      : [false, "The list that was sent in changed to " + mt_show(list) + ". Build a new list instead, and leave this one alone."];
  });
}

// ============================================================================
// Node: run whichever parts the student's file defines (or TASK=name / TASK=all)
// ============================================================================
function runTests(runner) {
  var defines = function (name) { return function () { return typeof runner.getFn(name) === "function"; }; };
  var tasks = [
    ["playerName", runTests_threeVariables, function () {
      return typeof runner.getFn("playerName") !== "undefined" || typeof runner.getFn("lives") !== "undefined";
    }],
    ["printWelcome", runTests_printWelcome],
    ["showHighScore", runTests_showHighScore],
    ["printScore", runTests_printScore],
    ["minutesToSeconds", runTests_minutesToSeconds],
    ["distanceTravelled", runTests_distanceTravelled],
    ["walk", runTests_walk],
    ["average", runTests_average],
    ["passOrFail", runTests_passOrFail],
    ["togglePause", runTests_togglePause],
    ["healthColour", runTests_healthColour, function () {
      return typeof runner.getFn("healthColour") === "function" || typeof runner.getFn("healthColor") === "function";
    }],
    ["isArrowKey", runTests_isArrowKey],
    ["bothPositive", runTests_bothPositive],
    ["isValidMark", runTests_isValidMark],
    ["canRide", runTests_canRide],
    ["startMicrowave", runTests_startMicrowave],
    ["distance", runTests_distance],
    ["pointInRectangle", runTests_pointInRectangle],
    ["rangesOverlap", runTests_rangesOverlap],
    ["circlesTouch", runTests_circlesTouch],
    ["rollDie", runTests_rollDie],
    ["randomBetween", runTests_randomBetween],
    ["countDown", runTests_countDown],
    ["nextLight", runTests_nextLight],
    ["pet", runTests_pet, function () { return typeof runner.getFn("pet") !== "undefined"; }],
    ["describePet", runTests_describePet],
    ["haveBirthday", runTests_haveBirthday],
    ["makeRectangle", runTests_makeRectangle],
    ["countToTen", runTests_countToTen, function () {
      // A whole program: found by the rest of a lesson 7 file, or by printing a run of numbers.
      // (Any file can print something while a student tests it, so printing alone isn't enough.)
      var lines = runner.output();
      var counting = lines.length >= 5 && lines.every(function (l) { return /^\s*-?\d+\s*$/.test(l); });
      return counting || ["total", "countPassing", "largest"].some(function (n) { return typeof runner.getFn(n) === "function"; });
    }],
    ["total", runTests_total],
    ["countPassing", runTests_countPassing],
    ["largest", runTests_largest],
    ["cartTotal", runTests_cartTotal],
    ["findPrice", runTests_findPrice],
    ["printRectangle", runTests_printRectangle],
    ["printTimesTable", runTests_printTimesTable],
    ["evensUpTo", runTests_evensUpTo],
    ["passingMarks", runTests_passingMarks],
    ["removeAll", runTests_removeAll],
    ["noDuplicates", runTests_noDuplicates]
  ];
  var choice = (typeof process !== "undefined" && process.env) ? process.env.TASK : null;
  var toRun = tasks.filter(function (t) {
    if (choice === "all") return true;
    if (choice) return t[0] === choice;
    return (t[2] || defines(t[0]))();
  });
  if (toRun.length === 0) toRun = [tasks[0]]; // nothing found: run one for its friendly "couldn't find" messages
  toRun.forEach(function (t) { t[1](runner); });
}

if (typeof module !== "undefined" && module.exports) { module.exports = { runTests: runTests }; }
else if (typeof registerTask === "function") {
  registerTask("Invaders 0a: Three Variables", function (r) { runTests_threeVariables(r); });
  registerTask("Invaders 0b: Welcome Message", function (r) { runTests_printWelcome(r); });
  registerTask("Invaders 0c: Print a Variable", function (r) { runTests_showHighScore(r); });
  registerTask("Invaders 0d: Score Text", function (r) { runTests_printScore(r); });
  registerTask("Invaders 1a: Minutes to Seconds", function (r) { runTests_minutesToSeconds(r); });
  registerTask("Invaders 1b: Distance Travelled", function (r) { runTests_distanceTravelled(r); });
  registerTask("Invaders 1c: Walk", function (r) { runTests_walk(r); });
  registerTask("Invaders 1d: Average of Three", function (r) { runTests_average(r); });
  registerTask("Invaders 2a: Pass or Fail", function (r) { runTests_passOrFail(r); });
  registerTask("Invaders 2b: Pause Button", function (r) { runTests_togglePause(r); });
  registerTask("Invaders 2c: Health Colour", function (r) { runTests_healthColour(r); });
  registerTask("Invaders 2d: Arrow Keys", function (r) { runTests_isArrowKey(r); });
  registerTask("Invaders 3a: Both Positive", function (r) { runTests_bothPositive(r); });
  registerTask("Invaders 3b: Valid Mark", function (r) { runTests_isValidMark(r); });
  registerTask("Invaders 3c: Ride Check", function (r) { runTests_canRide(r); });
  registerTask("Invaders 3d: Microwave", function (r) { runTests_startMicrowave(r); });
  registerTask("Invaders 4a: Distance", function (r) { runTests_distance(r); });
  registerTask("Invaders 4b: Point in a Rectangle", function (r) { runTests_pointInRectangle(r); });
  registerTask("Invaders 4c: Overlap on a Line", function (r) { runTests_rangesOverlap(r); });
  registerTask("Invaders 4d: Circles Touch", function (r) { runTests_circlesTouch(r); });
  registerTask("Invaders 5a: Roll a Die", function (r) { runTests_rollDie(r); });
  registerTask("Invaders 5b: Random Between", function (r) { runTests_randomBetween(r); });
  registerTask("Invaders 5c: Countdown", function (r) { runTests_countDown(r); });
  registerTask("Invaders 5d: Traffic Light", function (r) { runTests_nextLight(r); });
  registerTask("Invaders 6a: A Pet", function (r) { runTests_pet(r); });
  registerTask("Invaders 6b: Describe a Pet", function (r) { runTests_describePet(r); });
  registerTask("Invaders 6c: Birthday", function (r) { runTests_haveBirthday(r); });
  registerTask("Invaders 6d: Make a Rectangle", function (r) { runTests_makeRectangle(r); });
  registerTask("Invaders 7a: Count to Ten", function (r) { runTests_countToTen(r); });
  registerTask("Invaders 7b: Total", function (r) { runTests_total(r); });
  registerTask("Invaders 7c: Count Passing", function (r) { runTests_countPassing(r); });
  registerTask("Invaders 7d: Biggest", function (r) { runTests_largest(r); });
  registerTask("Invaders 8a: Cart Total", function (r) { runTests_cartTotal(r); });
  registerTask("Invaders 8b: Find a Price", function (r) { runTests_findPrice(r); });
  registerTask("Invaders 8c: Rectangle of Stars", function (r) { runTests_printRectangle(r); });
  registerTask("Invaders 8d: Times Table", function (r) { runTests_printTimesTable(r); });
  registerTask("Invaders 9a: Even Numbers", function (r) { runTests_evensUpTo(r); });
  registerTask("Invaders 9b: Passing Marks", function (r) { runTests_passingMarks(r); });
  registerTask("Invaders 9c: Remove All", function (r) { runTests_removeAll(r); });
  registerTask("Invaders 9d: No Duplicates", function (r) { runTests_noDuplicates(r); });
}
