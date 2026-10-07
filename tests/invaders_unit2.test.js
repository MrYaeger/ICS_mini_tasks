/*
 * Task Set: Invaders Game — Unit 2
 * ---
 * Four short practice tasks per lesson. They are ordinary programming exercises, not parts of
 * the game: each one practises an idea from the clicker unit (variables, printing, functions,
 * parameters and return, math, decisions) in a new setting. Parts a and b are quick; c and d
 * take a little more thought. None of them is meant to be hard.
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
 *
 * HOW THE TASKS ARE CHECKED
 * Students write one file per lesson (lesson0.js, lesson1.js, ...) holding all four parts, and
 * choose one part at a time in the tester. A task's variables must be declared at the top of
 * the file with `var` (`let` works too; a `const` can't change), and the file must not use
 * document or ctx: a mini task file has no page and no canvas. Students don't call their
 * functions; the tester does.
 *
 * In Node, test.js runs every part whose function the file defines (0a is found by its
 * variables). To force one part, set TASK to its function name, or to playerName for 0a.
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

function mt_show(value) {
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "function") return "a function";
  return String(value);
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
  var out = mt_capture(runner, fnName, args);
  if (out.crash) return [false, out.crash];
  var got = out.result;
  var call = fnName + "(" + args.map(mt_show).join(", ") + ")";
  if (got === expected || mt_close(got, expected)) return [true, call + " gave back " + mt_show(got)];
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
    ["isArrowKey", runTests_isArrowKey]
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
}
