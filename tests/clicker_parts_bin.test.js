/*
 * Task Set: Clicker Game — Parts Bin
 * ---
 * The mini tasks for the optional Parts Bin cards. Each card lists its own
 * prerequisites; these tasks use parameters and return, which the core lessons
 * teach before any card is attempted.
 *
 *   Random Rewards      getReward(roll)            running-total thresholds; the tester chooses the roll
 *   Upgrades A          buyTools()                 a one-time purchase remembered in a boolean
 *   Upgrades B          getCoinsPerSecond()        a multiplier that applies to farms only
 *   Abilities A         activateBoost()            cost, readiness, and starting two timers
 *   Abilities B         advanceAbility(seconds)    two timers counted down and clamped at zero
 *   Population A        recruit()                  a calculated limit, refused before payment
 *   Population B        changeJob(job, amount)     neither a job nor the idle count below zero
 *   Messages A          showMessage(text)          start a message: text, timer, opacity
 *   Messages B          fadeMessage(seconds)       count down, clamp, and work out the opacity
 *
 * HOW THE TASKS ARE CHECKED
 * getReward and getCoinsPerSecond are checked by what they RETURN. The others
 * look like a tiny version of the game: variables at the top of the file, and
 * a function that changes them. Each test SETS the variables, CALLS the
 * function, and READS the variables afterwards. For that to work the student must:
 *   - declare the variables at the top of the file with `var`
 *     (the tester cannot see variables made with `let` or `const`)
 *   - leave out document.getElementById - a mini task file has no page
 * They do not need to call their functions; the tester does.
 */

// ============================================================================
// Helpers shared by the tasks below. The same helpers as clicker_unit1.test.js
// (mt_checkVars also knows about booleans here): each task file runs in its own
// sandbox, so this file needs its own copy.
// The mt_ prefix keeps them from clashing with a student's own function names.
// ============================================================================

// The student's top-level `var`s live on their file's global object, and any
// function they wrote can lead us to it: a function made by that file's own
// Function constructor runs in that file's global scope. This works the same
// way in Node (test.js) and in the browser (runner.html).
function mt_globals(runner, fnName) {
  return runner.getFn(fnName).constructor("return this")();
}

function mt_show(value) {
  return typeof value === "string" ? JSON.stringify(value) : String(value);
}

// "coins = 25, farms = 0"
function mt_list(names, source) {
  return names.map(function (k) { return k + " = " + mt_show(source[k]); }).join(", ");
}

// Turn a crash inside the student's function into a message with a next step.
// Pass the function itself as `fn` so the hint can take its parameters into account.
function mt_explain(fnName, e, fn) {
  var msg = e && e.message ? e.message : String(e);
  if (!/[.!?]$/.test(msg)) msg += ".";
  var hint = "";
  if (/document|getElementById|innerText|innerHTML|of null/.test(msg)) {
    hint = " Mini task files have no page to change - take out any document.getElementById lines.";
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
function mt_exists(runner, fnName) {
  runner.runTest(fnName + " exists", function () {
    return typeof runner.getFn(fnName) === "function"
      ? [true, "Found " + fnName]
      : [false, "Define it as:  function " + fnName + "() { ... }  (check the spelling and the capital letters)"];
  });
  return typeof runner.getFn(fnName) === "function";
}

// A test that the function has at least `count` parameters. `example` shows the brackets filled in.
function mt_hasParams(runner, fnName, count, example) {
  runner.runTest(fnName + " takes " + (count === 1 ? "a parameter" : count + " parameters"), function () {
    return runner.getFn(fnName).length >= count
      ? [true, fnName + " has " + (count === 1 ? "a parameter" : count + " parameters")]
      : [false, fnName + " needs " + (count === 1 ? "a name" : count + " names") + " between its brackets:  function " + example + " { ... }"];
  });
}

// Check that each variable exists and holds the right kind of value.
// `types` looks like { coins: "number", message: "string", bought: "boolean" }.
function mt_checkVars(runner, fnName, types) {
  var g = mt_globals(runner, fnName);
  var names = Object.keys(types);
  for (var i = 0; i < names.length; i++) {
    var name = names[i], want = types[name], got = g[name];
    if (typeof got === "undefined") {
      var start = want === "string" ? "\"\"" : want === "boolean" ? "false" : "0";
      return [false, "Couldn't find a variable called " + name + ". Put  var " + name + " = " + start +
        ";  at the top of your file, outside any function." +
        " (The tester can't see variables made with let or const, so use var.)"];
    }
    if (typeof got !== want) {
      var fix = (want === "number" && typeof got === "string") ? " That's text - take the quotes off the number."
              : (want === "string" && typeof got === "number") ? " Text needs \"quotes\"."
              : (want === "boolean" && typeof got === "string") ? " true and false are written without quotes."
              : "";
      return [false, name + " should hold a " + want + ", but it holds " + mt_show(got) + "." + fix];
    }
  }
  return [true, "Found " + names.join(", ")];
}

// Set the variables in `before`, call the student's function, then compare the
// variables in `expect`. `calls` is how many times to call it with no arguments,
// or a list of argument lists: [[5], [10]] calls fnName(5) then fnName(10).
// `hint(g)` can explain a known mistake.
function mt_scenario(runner, fnName, before, calls, expect, hint) {
  var g = mt_globals(runner, fnName);
  var missing = Object.keys(expect).filter(function (k) { return typeof g[k] === "undefined"; });
  if (missing.length > 0) {
    return [false, "Couldn't find a variable called " + missing[0] + " that the tester can change. Declare it at the top" +
      " of your file with var - not let, and not const (a const can never change)."];
  }
  Object.keys(before).forEach(function (k) { g[k] = before[k]; });
  var fn = runner.getFn(fnName);
  var argLists = [];
  if (typeof calls === "number") {
    for (var n = 0; n < calls; n++) argLists.push([]);
  } else {
    argLists = calls;
  }
  for (var i = 0; i < argLists.length; i++) {
    try { fn.apply(null, argLists[i]); }
    catch (e) { return [false, mt_explain(fnName, e, fn)]; }
  }
  var start = "Start: " + mt_list(Object.keys(before), before);
  var call = typeof calls !== "number"
    ? argLists.map(function (a) { return fnName + "(" + a.map(mt_show).join(", ") + ")"; }).join(" then ")
    : (calls === 1 ? fnName + "()" : fnName + "() " + calls + " times");
  var names = Object.keys(expect);
  var ok = names.every(function (k) { return g[k] === expect[k]; });
  if (ok) return [true, start + "  ->  after " + call + ": " + mt_list(names, g)];
  var extra = hint ? hint(g) : "";
  return [false, start + ". After " + call + " it should be " + mt_list(names, expect) +
    ", but it is " + mt_list(names, g) + "." + (extra ? " " + extra : "")];
}

// Set the variables in `before`, call fnName(...args), and check what it RETURNS.
// Also fails if the function changed any of those variables along the way.
// `hint(got)` can explain a known wrong answer.
function mt_returns(runner, fnName, before, args, expected, hint) {
  var g = mt_globals(runner, fnName);
  var names = Object.keys(before);
  var missing = names.filter(function (k) { return typeof g[k] === "undefined"; });
  if (missing.length > 0) {
    return [false, "Couldn't find a variable called " + missing[0] + ". Declare it at the top of your file with var."];
  }
  names.forEach(function (k) { g[k] = before[k]; });
  var fn = runner.getFn(fnName), out;
  try { out = runner.captureConsole(fn, args); }
  catch (e) { return [false, mt_explain(fnName, e, fn)]; }
  var logs = out[0], got = out[1];
  var call = (names.length ? "With " + mt_list(names, before) + ", " : "") + fnName + "(" + args.map(mt_show).join(", ") + ")";
  var changed = names.filter(function (k) { return g[k] !== before[k]; });
  if (got === expected && changed.length === 0) return [true, call + " gave back " + mt_show(got)];
  if (got === expected) {
    return [false, call + " gave back the right answer, but it also changed " + mt_list(changed, g) +
      ". A function that works out an answer shouldn't change the game."];
  }
  var msg = call + " should give back " + mt_show(expected) + ", but it gave back " + mt_show(got) + ".";
  if (got === undefined && logs.length > 0) {
    msg += " It printed " + mt_show(logs[0]) + " instead. console.log shows the answer to YOU; return gives it back to the code.";
  } else if (got === undefined) {
    msg += " Nothing came back - put return in front of the answer.";
  } else if (typeof got === "string") {
    msg += " That's text, not a number.";
  } else if (hint) {
    var extra = hint(got);
    if (extra) msg += " " + extra;
  }
  return [false, msg];
}

// ============================================================================
// Random Rewards: Get Reward
// ============================================================================
/*
 * Write a function:   function getReward(roll)
 *   roll is a number from 0 up to (not including) 1. RETURNS:
 *       roll below 0.1                     ->  20
 *       roll from 0.1 up to (not incl.) 0.4 ->  5
 *       roll 0.4 or more                   ->  1
 *   - uses the roll it is given: does NOT call Math.random() itself
 *   - doesn't print anything or change any variables
 *
 * Example:  getReward(0.25) returns 5
 */
function runTests_getReward(runner) {
  if (!mt_exists(runner, "getReward")) return;
  mt_hasParams(runner, "getReward", 1, "getReward(roll)");

  function correct(roll) {
    if (roll < 0.1) return 20;
    if (roll < 0.4) return 5;
    return 1;
  }

  // Call getReward(0.05) with a Math.random that counts its calls, so a
  // getReward that rolls its own number is caught every time instead of
  // failing now and then. Returns { rolls, got } or { crash }.
  function tryWithCountedRolls() {
    var fn = runner.getFn("getReward");
    var studentMath = mt_globals(runner, "getReward").Math;
    var original = studentMath.random, rolls = 0, got;
    studentMath.random = function () { rolls++; return 0.5; };
    try { got = runner.captureConsole(fn, [0.05])[1]; }
    catch (e) { return { crash: mt_explain("getReward", e, fn) }; }
    finally { studentMath.random = original; }
    return { rolls: rolls, got: got };
  }
  var ownRoll = "getReward called Math.random() itself, so it ignores the roll the tester gives it." +
    " Use the roll parameter instead: the game rolls once and passes the number in.";
  var first = tryWithCountedRolls();
  var rollsItsOwn = !first.crash && first.rolls > 0;

  runner.runTest("uses the roll it is given (the game does the rolling)", function () {
    if (first.crash) return [false, first.crash];
    if (rollsItsOwn) return [false, ownRoll];
    return first.got === 20
      ? [true, "getReward(0.05) gave back 20 without rolling again"]
      : [false, "getReward(0.05) should give back 20, but it gave back " + mt_show(first.got) + "."];
  });

  function check(roll) {
    return mt_returns(runner, "getReward", {}, [roll], correct(roll), function (got) {
      if (rollsItsOwn) return ownRoll;
      if (roll === 0.1 && got === 20) {
        return "A roll of exactly 0.1 is not below 0.1, so it's a pouch. Use < for each threshold, not <=.";
      }
      if (roll === 0.4 && got === 5) {
        return "A roll of exactly 0.4 is not below 0.4, so it's ordinary. Use < for each threshold, not <=.";
      }
      if (roll >= 0.3 && roll < 0.4 && got === 1) {
        return "The thresholds are running totals: the 30% pouch starts at 0.1 and ends at 0.1 + 0.3 = 0.4.";
      }
      if (roll < 0.1 && got === 5) {
        return "Rolls below 0.1 should give 20. Check the smallest threshold first: an else if only runs when the checks above it were false.";
      }
      if (roll >= 0.1 && got === 20) {
        return "Is a threshold written as a percentage? The roll is a decimal from 0 to 1, so 10% is 0.1 and 40% is 0.4.";
      }
      return "Below 0.1 gives 20, from 0.1 up to 0.4 gives 5, and anything else gives 1.";
    });
  }

  runner.runTest("0 -> 20 (the lowest possible roll)", function () { return check(0); });
  runner.runTest("0.05 -> 20", function () { return check(0.05); });
  runner.runTest("0.0999 -> 20 (just below 0.1)", function () { return check(0.0999); });
  runner.runTest("0.1 -> 5 (exactly on the first threshold)", function () { return check(0.1); });
  runner.runTest("0.25 -> 5", function () { return check(0.25); });
  runner.runTest("0.35 -> 5 (the thresholds are running totals)", function () { return check(0.35); });
  runner.runTest("0.3999 -> 5 (just below 0.4)", function () { return check(0.3999); });
  runner.runTest("0.4 -> 1 (exactly on the second threshold)", function () { return check(0.4); });
  runner.runTest("0.75 -> 1", function () { return check(0.75); });
  runner.runTest("0.9999 -> 1 (close to the top)", function () { return check(0.9999); });
}

// ============================================================================
// Upgrades A: Buy Tools
// ============================================================================
/*
 * Variables at the top of your file:
 *     var coins = 0;
 *     var toolsPurchased = false;
 *     var farmMultiplier = 1;
 *
 * Write a function:   function buyTools()
 *   - better tools cost 50 coins
 *   - if toolsPurchased is false AND there are at least 50 coins:
 *       change toolsPurchased to true, take away 50 coins, set farmMultiplier to 2
 *   - otherwise, change nothing
 *
 * The card's first version (Sept 24) remembered the purchase in a string instead:
 *     var toolsUpgrade = "available";   // becomes "bought"
 * A file written that way (with no toolsPurchased) is still marked, against the
 * rules it was written for, so work handed in before the change keeps its result.
 */
function runTests_buyTools(runner) {
  if (!mt_exists(runner, "buyTools")) return;

  var g = mt_globals(runner, "buyTools");
  var legacy = typeof g.toolsPurchased === "undefined" && typeof g.toolsUpgrade !== "undefined";
  var state = legacy ? "toolsUpgrade" : "toolsPurchased";
  var NOT_BOUGHT = legacy ? "available" : false;
  var BOUGHT = legacy ? "bought" : true;
  var types = { coins: "number", farmMultiplier: "number" };
  types[state] = legacy ? "string" : "boolean";

  runner.runTest("coins, " + state + " and farmMultiplier are variables", function () {
    return mt_checkVars(runner, "buyTools", types);
  });

  function hintFor(start) {
    return function (g) {
      var now = g[state], was = start[state];
      if (typeof now !== typeof NOT_BOUGHT) {
        return state + " was changed to " + mt_show(now) + ". Inside an if, compare with == (one = changes the variable)." +
          (legacy ? "" : " true and false are written without quotes.");
      }
      if (legacy && now !== NOT_BOUGHT && now !== BOUGHT) {
        return "toolsUpgrade should only ever be \"available\" or \"bought\": lowercase, spelled the same everywhere.";
      }
      if (g.coins < 0) return "coins went below zero. Check that there are at least 50 coins before paying.";
      if (g.coins === start.coins - 100) {
        return "It charged twice. After the first purchase " + state + " is " + mt_show(BOUGHT) +
          ", so the second click should change nothing.";
      }
      if (g.farmMultiplier > 2) {
        return "farmMultiplier went past 2, so the upgrade was applied more than once. Check " + state +
          " before buying, and set the multiplier to 2.";
      }
      if (was === BOUGHT) {
        return "It was already bought, so a click should change nothing. Check " + state + " as well as the coins.";
      }
      if (was === NOT_BOUGHT && now === BOUGHT && g.coins === start.coins) {
        return legacy
          ? "The upgrade was given away free. Take 50 away from coins."
          : "toolsPurchased became true without any coins being paid. If your if says  toolsPurchased = true, that one =" +
            " changes it; write  if (toolsPurchased)  or compare with ==.";
      }
      if (start.coins < 50) return "With fewer than 50 coins, nothing should change.";
      if (start.coins === 50 && now === NOT_BOUGHT) return "Exactly 50 coins is enough. Use >= 50, not > 50.";
      if (g.coins === 0 && start.coins > 50) return "Take away the price: coins -= 50, rather than setting coins to 0.";
      if (now === NOT_BOUGHT) {
        return "After a purchase, " + state + " should be " + mt_show(BOUGHT) + ". Change it in the same branch where the coins are paid.";
      }
      if (g.farmMultiplier !== 2) return "After a purchase, farmMultiplier should be 2.";
      return "";
    };
  }

  function vars(coins, bought, multiplier) {
    var v = { coins: coins, farmMultiplier: multiplier };
    v[state] = bought ? BOUGHT : NOT_BOUGHT;
    return v;
  }
  function scenario(start, clicks, expect) {
    return mt_scenario(runner, "buyTools", start, clicks, expect, hintFor(start));
  }

  runner.runTest("49 coins: can't afford it, nothing changes", function () {
    return scenario(vars(49, false, 1), 1, vars(49, false, 1));
  });
  runner.runTest("0 coins: nothing changes", function () {
    return scenario(vars(0, false, 1), 1, vars(0, false, 1));
  });
  runner.runTest("exactly 50 coins: buys it", function () {
    return scenario(vars(50, false, 1), 1, vars(0, true, 2));
  });
  runner.runTest("120 coins: buys it, 70 left", function () {
    return scenario(vars(120, false, 1), 1, vars(70, true, 2));
  });
  runner.runTest("120 coins, clicked twice: buys it only once", function () {
    return scenario(vars(120, false, 1), 2, vars(70, true, 2));
  });
  runner.runTest("already bought, 500 coins: nothing changes", function () {
    return scenario(vars(500, true, 2), 1, vars(500, true, 2));
  });
  runner.runTest("does NOT hard-code the examples (random check)", function () {
    var coins = 51 + Math.floor(Math.random() * 500);
    return scenario(vars(coins, false, 1), 1, vars(coins - 50, true, 2));
  });
}

// ============================================================================
// Upgrades B: Coins Per Second
// ============================================================================
/*
 * Variables at the top of your file (as well as the Part A ones):
 *     var farms = 0;
 *     var mines = 0;
 *
 * Write a function:   function getCoinsPerSecond()
 *   - RETURNS the total: each farm makes 2 coins per second, multiplied by farmMultiplier;
 *     each mine makes 10 coins per second, and farmMultiplier doesn't affect mines
 *   - doesn't change any variables, and doesn't print anything
 *
 * Example:  farms = 3, mines = 2, farmMultiplier = 2 -> getCoinsPerSecond() returns 32
 */
function runTests_getCoinsPerSecond(runner) {
  if (!mt_exists(runner, "getCoinsPerSecond")) return;

  runner.runTest("farms, mines and farmMultiplier are variables", function () {
    return mt_checkVars(runner, "getCoinsPerSecond", { farms: "number", mines: "number", farmMultiplier: "number" });
  });

  function check(farms, mines, multiplier) {
    var before = { farms: farms, mines: mines, farmMultiplier: multiplier };
    return mt_returns(runner, "getCoinsPerSecond", before, [], farms * 2 * multiplier + mines * 10, function (got) {
      if (got === (farms * 2 + mines * 10) * multiplier) {
        return "The multiplier was applied to the mines too. Multiplication happens before addition, so" +
          "  farms * 2 * farmMultiplier + mines * 10  needs no brackets.";
      }
      if (got === farms * 2 + mines * 10) return "The multiplier wasn't used. Multiply the farms' part by farmMultiplier.";
      if (got === farms * 2 + mines * 10 * multiplier) return "The multiplier went on the mines. Tools only help farms.";
      if (got === farms * 10 * multiplier + mines * 2) return "The rates are swapped: each farm makes 2, and each mine makes 10.";
      return "";
    });
  }

  runner.runTest("no buildings -> 0", function () { return check(0, 0, 1); });
  runner.runTest("3 farms, no tools -> 6", function () { return check(3, 0, 1); });
  runner.runTest("3 farms, with tools -> 12", function () { return check(3, 0, 2); });
  runner.runTest("2 mines, with tools -> 20 (tools don't help mines)", function () { return check(0, 2, 2); });
  runner.runTest("3 farms and 2 mines, with tools -> 32", function () { return check(3, 2, 2); });
  runner.runTest("5 farms and 1 mine, no tools -> 20", function () { return check(5, 1, 1); });
  runner.runTest("4 farms and 3 mines, multiplier 1.5 -> 42", function () { return check(4, 3, 1.5); });
  runner.runTest("does NOT hard-code the examples (random check)", function () {
    return check(1 + Math.floor(Math.random() * 20), 1 + Math.floor(Math.random() * 20), 2);
  });
}

// ============================================================================
// Abilities A: Activate Boost
// ============================================================================
/*
 * Variables at the top of your file:
 *     var coins = 0;
 *     var boostTimeLeft = 0;
 *     var boostCooldownLeft = 0;
 *
 * Write a function:   function activateBoost()
 *   - a boost costs 20 coins, lasts 5 seconds, and has a 30-second cooldown
 *     that starts when the boost starts
 *   - if boostCooldownLeft is 0 AND there are at least 20 coins:
 *       take away 20 coins, set boostTimeLeft to 5, set boostCooldownLeft to 30
 *   - otherwise, change nothing
 */
function runTests_activateBoost(runner) {
  if (!mt_exists(runner, "activateBoost")) return;

  runner.runTest("coins, boostTimeLeft and boostCooldownLeft are variables", function () {
    return mt_checkVars(runner, "activateBoost", { coins: "number", boostTimeLeft: "number", boostCooldownLeft: "number" });
  });

  function vars(coins, timeLeft, cooldownLeft) {
    return { coins: coins, boostTimeLeft: timeLeft, boostCooldownLeft: cooldownLeft };
  }
  function hintFor(start) {
    return function (g) {
      if (g.coins < 0) return "coins went below zero. Check that there are at least 20 coins before paying.";
      if (g.coins === start.coins - 40) {
        return "It charged twice. After the first boost, boostCooldownLeft is 30, so the second click should change nothing.";
      }
      if (start.boostCooldownLeft > 0 && g.coins !== start.coins) {
        return "The boost is still recovering, so nothing should change. Check that boostCooldownLeft is 0 before paying.";
      }
      if (start.boostCooldownLeft > 0) return "While the cooldown is running, a click changes nothing.";
      if (start.coins < 20) return "With fewer than 20 coins, nothing should change.";
      if (start.coins === 20 && g.coins === 20) return "Exactly 20 coins is enough. Use >= 20, not > 20.";
      if (g.coins === start.coins) return "The boost was free. Take 20 away from coins.";
      if (g.boostTimeLeft !== 5) return "A boost lasts 5 seconds: set boostTimeLeft to 5.";
      if (g.boostCooldownLeft !== 30) return "The cooldown starts when the boost starts: set boostCooldownLeft to 30.";
      return "";
    };
  }
  function scenario(start, clicks, expect) {
    return mt_scenario(runner, "activateBoost", start, clicks, expect, hintFor(start));
  }

  runner.runTest("ready, exactly 20 coins: starts a boost", function () {
    return scenario(vars(20, 0, 0), 1, vars(0, 5, 30));
  });
  runner.runTest("ready, 19 coins: nothing changes", function () {
    return scenario(vars(19, 0, 0), 1, vars(19, 0, 0));
  });
  runner.runTest("ready, 100 coins, clicked twice: only one boost", function () {
    return scenario(vars(100, 0, 0), 2, vars(80, 5, 30));
  });
  runner.runTest("active (3 seconds left): nothing changes", function () {
    return scenario(vars(100, 3, 28), 1, vars(100, 3, 28));
  });
  runner.runTest("recovering (12 seconds left): nothing changes", function () {
    return scenario(vars(100, 0, 12), 1, vars(100, 0, 12));
  });
  runner.runTest("nearly ready (0.25 seconds left): still nothing changes", function () {
    return scenario(vars(100, 0, 0.25), 1, vars(100, 0, 0.25));
  });
  runner.runTest("does NOT hard-code the examples (random check)", function () {
    var coins = 21 + Math.floor(Math.random() * 300);
    return scenario(vars(coins, 0, 0), 1, vars(coins - 20, 5, 30));
  });
}

// ============================================================================
// Abilities B: Advance Timers
// ============================================================================
/*
 * The Part A variables, and a function:   function advanceAbility(seconds)
 *   - takes seconds away from BOTH boostTimeLeft and boostCooldownLeft
 *   - neither may go below 0
 *   - doesn't change coins, and doesn't round anything
 *
 * Example:  5 and 30 left -> advanceAbility(0.25) -> 4.75 and 29.75
 */
function runTests_advanceAbility(runner) {
  if (!mt_exists(runner, "advanceAbility")) return;
  mt_hasParams(runner, "advanceAbility", 1, "advanceAbility(seconds)");

  runner.runTest("coins, boostTimeLeft and boostCooldownLeft are variables", function () {
    return mt_checkVars(runner, "advanceAbility", { coins: "number", boostTimeLeft: "number", boostCooldownLeft: "number" });
  });

  function hintFor(start, steps) {
    var total = steps.reduce(function (a, b) { return a + b; }, 0);
    return function (g) {
      if (g.coins !== start.coins) return "advanceAbility only moves the timers on; don't change coins.";
      if (g.boostTimeLeft < 0 || g.boostCooldownLeft < 0) {
        return "A timer went below zero. After subtracting, set any timer below 0 back to 0.";
      }
      if (g.boostTimeLeft === start.boostTimeLeft && g.boostCooldownLeft === start.boostCooldownLeft) {
        return "Neither timer changed. Take seconds away from both:  boostTimeLeft -= seconds;";
      }
      if (g.boostTimeLeft === start.boostTimeLeft || g.boostCooldownLeft === start.boostCooldownLeft) {
        if (start.boostTimeLeft > 0 && start.boostCooldownLeft > 0) return "Only one timer changed. Count BOTH timers down.";
      }
      if (total !== steps.length && (g.boostTimeLeft === Math.max(0, start.boostTimeLeft - steps.length) ||
          g.boostCooldownLeft === Math.max(0, start.boostCooldownLeft - steps.length))) {
        return "It took away 1 instead of the seconds it was given. Use the parameter:  -= seconds";
      }
      if (g.boostTimeLeft % 1 === 0 && g.boostCooldownLeft % 1 === 0 && total % 1 !== 0) {
        return "The timers were rounded. Keep the decimals; only the display rounds.";
      }
      return "";
    };
  }
  function check(timeLeft, cooldownLeft, steps, expectTime, expectCooldown) {
    var start = { coins: 37, boostTimeLeft: timeLeft, boostCooldownLeft: cooldownLeft };
    return mt_scenario(runner, "advanceAbility", start, steps.map(function (s) { return [s]; }),
      { coins: 37, boostTimeLeft: expectTime, boostCooldownLeft: expectCooldown }, hintFor(start, steps));
  }

  runner.runTest("5 and 30, 1 second -> 4 and 29", function () { return check(5, 30, [1], 4, 29); });
  runner.runTest("5 and 30, 0.25 seconds -> 4.75 and 29.75 (no rounding)", function () { return check(5, 30, [0.25], 4.75, 29.75); });
  runner.runTest("5 and 30, 0.5 seconds twice -> 4 and 29", function () { return check(5, 30, [0.5, 0.5], 4, 29); });
  runner.runTest("0.5 and 25.5, 1 second -> 0 and 24.5 (stops at 0)", function () { return check(0.5, 25.5, [1], 0, 24.5); });
  runner.runTest("0 and 10, 0.25 seconds -> 0 and 9.75", function () { return check(0, 10, [0.25], 0, 9.75); });
  runner.runTest("5 and 30, 5 seconds -> 0 and 25 (the boost ends exactly)", function () { return check(5, 30, [5], 0, 25); });
  runner.runTest("5 and 30, 45 seconds -> 0 and 0 (longer than both)", function () { return check(5, 30, [45], 0, 0); });
  runner.runTest("0 and 0, 1 second -> 0 and 0", function () { return check(0, 0, [1], 0, 0); });
  runner.runTest("does NOT hard-code the examples (random check)", function () {
    var seconds = (1 + Math.floor(Math.random() * 16)) / 4;   // 0.25 to 4, exact in binary
    return check(5, 30, [seconds], 5 - seconds, 30 - seconds);
  });
}

// ============================================================================
// Population A: Recruit
// ============================================================================
/*
 * Variables at the top of your file:
 *     var coins = 0;
 *     var houses = 0;
 *     var villagers = 0;
 *
 * Write a function:   function recruit()
 *   - each house has room for 3 villagers; recruiting one costs 10 coins
 *   - if there's room (fewer villagers than houses * 3) AND at least 10 coins:
 *       take away 10 coins, add 1 villager
 *   - otherwise, change nothing. A full village never takes coins.
 */
function runTests_recruit(runner) {
  if (!mt_exists(runner, "recruit")) return;

  runner.runTest("coins, houses and villagers are variables", function () {
    return mt_checkVars(runner, "recruit", { coins: "number", houses: "number", villagers: "number" });
  });

  function vars(coins, houses, villagers) { return { coins: coins, houses: houses, villagers: villagers }; }
  function hintFor(start) {
    return function (g) {
      var room = start.houses * 3;
      if (g.houses !== start.houses) return "recruit() shouldn't change houses.";
      if (g.coins < 0) return "coins went below zero. Check that there are at least 10 coins before paying.";
      if (g.villagers > room) {
        return "There are more villagers than the houses have room for. Each house holds 3: check  villagers < houses * 3.";
      }
      if (g.coins !== start.coins && g.villagers === start.villagers) {
        return "Coins were taken but nobody moved in. Check for room BEFORE paying.";
      }
      if (g.villagers === start.villagers + 2) return "It recruited twice. The second click had no room left.";
      if (start.villagers >= room) return "The village is full, so nothing should change.";
      if (start.coins < 10) return "With fewer than 10 coins, nothing should change.";
      if (g.villagers === start.villagers + 1 && g.coins === start.coins) return "The villager was free. Take 10 away from coins.";
      if (g.villagers === start.villagers && start.villagers === room - 1) {
        return "There was room for one more: " + start.villagers + " villagers is fewer than " + start.houses +
          " houses * 3. Each house holds 3, and the last space counts.";
      }
      if (start.coins === 10 && g.villagers === start.villagers) return "Exactly 10 coins is enough. Use >= 10, not > 10.";
      return "";
    };
  }
  function scenario(start, clicks, expect) {
    return mt_scenario(runner, "recruit", start, clicks, expect, hintFor(start));
  }

  runner.runTest("1 house, nobody yet, exactly 10 coins: recruits", function () {
    return scenario(vars(10, 1, 0), 1, vars(0, 1, 1));
  });
  runner.runTest("no houses, 100 coins: no room, nothing changes", function () {
    return scenario(vars(100, 0, 0), 1, vars(100, 0, 0));
  });
  runner.runTest("1 house, 3 villagers, 100 coins: full, nothing changes", function () {
    return scenario(vars(100, 1, 3), 1, vars(100, 1, 3));
  });
  runner.runTest("2 houses, 5 villagers: the last space is filled", function () {
    return scenario(vars(100, 2, 5), 1, vars(90, 2, 6));
  });
  runner.runTest("2 houses, 5 villagers, clicked twice: only one fits", function () {
    return scenario(vars(100, 2, 5), 2, vars(90, 2, 6));
  });
  runner.runTest("1 house, 1 villager, 9 coins: nothing changes", function () {
    return scenario(vars(9, 1, 1), 1, vars(9, 1, 1));
  });
  runner.runTest("does NOT hard-code the examples (random check)", function () {
    var houses = 1 + Math.floor(Math.random() * 6);
    var villagers = Math.floor(Math.random() * houses * 3);
    var coins = 10 + Math.floor(Math.random() * 200);
    return scenario(vars(coins, houses, villagers), 1, vars(coins - 10, houses, villagers + 1));
  });
}

// ============================================================================
// Population B: Change Job
// ============================================================================
/*
 * Variables at the top of your file (as well as the Part A ones):
 *     var hunters = 0;
 *     var fishers = 0;
 *
 * Write a function:   function changeJob(job, amount)
 *   - job is "hunter" or "fisher"; amount is 1 or -1
 *   - idle villagers are  villagers - hunters - fishers
 *   - change that job's count by amount, UNLESS the job's count or the idle
 *     count would go below zero; then change nothing
 *   - never change villagers
 */
function runTests_changeJob(runner) {
  if (!mt_exists(runner, "changeJob")) return;
  mt_hasParams(runner, "changeJob", 2, "changeJob(job, amount)");

  runner.runTest("villagers, hunters and fishers are variables", function () {
    return mt_checkVars(runner, "changeJob", { villagers: "number", hunters: "number", fishers: "number" });
  });

  function vars(villagers, hunters, fishers) { return { villagers: villagers, hunters: hunters, fishers: fishers }; }
  function hintFor(start, calls) {
    var jobs = calls.map(function (c) { return c[0]; });
    return function (g) {
      if (g.villagers !== start.villagers) return "changeJob should never change villagers: a new job doesn't add or remove anyone.";
      if (g.hunters < 0 || g.fishers < 0) {
        return "A job went below zero. Before taking a villager off a job, check that the job's count + amount won't be below 0.";
      }
      if (g.hunters + g.fishers > g.villagers) {
        return "Now more villagers have jobs than there are villagers. Before adding, check that" +
          " villagers - hunters - fishers (the idle count) - amount won't be below 0.";
      }
      if (jobs.indexOf("hunter") === -1 && g.hunters !== start.hunters) return "Only the job that was named should change, but hunters changed.";
      if (jobs.indexOf("fisher") === -1 && g.fishers !== start.fishers) return "Only the job that was named should change, but fishers changed.";
      if (g.hunters === start.hunters && g.fishers === start.fishers) {
        return "Nothing changed. Compare job with \"hunter\" and \"fisher\" (spelled exactly), and add amount to that job's count.";
      }
      return "Add amount to the named job: amount is -1 when a villager is taken off.";
    };
  }
  function check(start, calls, expect) {
    return mt_scenario(runner, "changeJob", start, calls, expect, hintFor(start, calls));
  }

  runner.runTest("3 idle villagers: hunter +1", function () {
    return check(vars(3, 0, 0), [["hunter", 1]], vars(3, 1, 0));
  });
  runner.runTest("3 idle villagers: fisher +1", function () {
    return check(vars(3, 0, 0), [["fisher", 1]], vars(3, 0, 1));
  });
  runner.runTest("nobody idle: hunter +1 is refused", function () {
    return check(vars(2, 1, 1), [["hunter", 1]], vars(2, 1, 1));
  });
  runner.runTest("no hunters: hunter -1 is refused", function () {
    return check(vars(2, 0, 2), [["hunter", -1]], vars(2, 0, 2));
  });
  runner.runTest("no fishers: fisher -1 is refused", function () {
    return check(vars(1, 1, 0), [["fisher", -1]], vars(1, 1, 0));
  });
  runner.runTest("taking a hunter off: hunter -1", function () {
    return check(vars(4, 2, 1), [["hunter", -1]], vars(4, 1, 1));
  });
  runner.runTest("switching: hunter -1 then fisher +1", function () {
    return check(vars(2, 2, 0), [["hunter", -1], ["fisher", 1]], vars(2, 1, 1));
  });
  runner.runTest("the last idle villager: fisher +1", function () {
    return check(vars(3, 1, 1), [["fisher", 1]], vars(3, 1, 2));
  });
  runner.runTest("3 idle villagers, hunter +1 four times: only 3 fit", function () {
    return check(vars(3, 0, 0), [["hunter", 1], ["hunter", 1], ["hunter", 1], ["hunter", 1]], vars(3, 3, 0));
  });
  runner.runTest("does NOT hard-code the examples (random check)", function () {
    var hunters = Math.floor(Math.random() * 5), fishers = Math.floor(Math.random() * 5);
    var villagers = hunters + fishers + 1 + Math.floor(Math.random() * 5);
    return check(vars(villagers, hunters, fishers), [["fisher", 1]], vars(villagers, hunters, fishers + 1));
  });
}

// ============================================================================
// Messages A: Show Message
// ============================================================================
/*
 * Variables at the top of your file:
 *     var message = "";
 *     var messageTimer = 0;
 *     var messageOpacity = 0;
 *
 * Write a function:   function showMessage(text)
 *   - sets message to text, messageTimer to 5, and messageOpacity to 1
 */
function runTests_showMessage(runner) {
  if (!mt_exists(runner, "showMessage")) return;
  mt_hasParams(runner, "showMessage", 1, "showMessage(text)");

  runner.runTest("message, messageTimer and messageOpacity are variables", function () {
    return mt_checkVars(runner, "showMessage", { message: "string", messageTimer: "number", messageOpacity: "number" });
  });

  function hintFor(text) {
    return function (g) {
      if (g.message === "text") return "message became the word \"text\". Use the parameter without quotes:  message = text;";
      if (g.message !== text) return "Set message to the text that was passed in.";
      if (g.messageTimer !== 5) return "A new message gets the full 5 seconds: set messageTimer to 5.";
      if (g.messageOpacity !== 1) return "A new message starts completely solid: set messageOpacity to 1.";
      return "";
    };
  }
  function check(start, texts) {
    var last = texts[texts.length - 1];
    return mt_scenario(runner, "showMessage", start, texts.map(function (t) { return [t]; }),
      { message: last, messageTimer: 5, messageOpacity: 1 }, hintFor(last));
  }

  runner.runTest("showMessage(\"Hello\") from nothing", function () {
    return check({ message: "", messageTimer: 0, messageOpacity: 0 }, ["Hello"]);
  });
  runner.runTest("a new message replaces a fading one", function () {
    return check({ message: "Old news", messageTimer: 0.5, messageOpacity: 0.25 }, ["You hired a farmer!"]);
  });
  runner.runTest("two messages in a row: the second one shows", function () {
    return check({ message: "", messageTimer: 0, messageOpacity: 0 }, ["First", "Second"]);
  });
  runner.runTest("does NOT hard-code the examples (random check)", function () {
    return check({ message: "", messageTimer: 2, messageOpacity: 1 }, ["Message number " + Math.floor(Math.random() * 1000)]);
  });
}

// ============================================================================
// Messages B: Fade Message
// ============================================================================
/*
 * The Part A variables, and a function:   function fadeMessage(seconds)
 *   - takes seconds away from messageTimer, but not below 0
 *   - messageOpacity is 1 while more than 2 seconds are left; otherwise messageTimer / 2
 *   - doesn't change message
 *
 * Example:  2 seconds left -> fadeMessage(0.5) -> messageTimer 1.5, messageOpacity 0.75
 */
function runTests_fadeMessage(runner) {
  if (!mt_exists(runner, "fadeMessage")) return;
  mt_hasParams(runner, "fadeMessage", 1, "fadeMessage(seconds)");

  runner.runTest("message, messageTimer and messageOpacity are variables", function () {
    return mt_checkVars(runner, "fadeMessage", { message: "string", messageTimer: "number", messageOpacity: "number" });
  });

  function hintFor(start, steps) {
    var total = steps.reduce(function (a, b) { return a + b; }, 0);
    var timer = Math.max(0, start.messageTimer - total);
    return function (g) {
      if (g.message !== start.message) return "fadeMessage shouldn't change message.";
      if (g.messageTimer < 0) return "messageTimer went below zero. After subtracting, set it back to 0 if it's below 0.";
      if (g.messageTimer === start.messageTimer) return "messageTimer didn't change. Take seconds away from it:  messageTimer -= seconds;";
      if (g.messageTimer !== timer) return "messageTimer should go down by exactly the seconds it was given, and stop at 0.";
      if (g.messageOpacity > 1) return "The opacity went above 1. While more than 2 seconds are left, it stays at 1.";
      if (g.messageOpacity < 0) return "The opacity went below 0. Clamp the timer at 0 before working out the opacity.";
      if (timer <= 2 && g.messageOpacity === timer) return "Divide by the fade time: messageOpacity = messageTimer / 2.";
      if (timer <= 2 && g.messageOpacity === 1) {
        return "With " + timer + " seconds left the message should be fading: messageOpacity = messageTimer / 2 once 2 or fewer seconds are left.";
      }
      if (timer > 2 && g.messageOpacity !== 1) return "With more than 2 seconds left, the message is still solid: messageOpacity = 1.";
      return "Work out the opacity AFTER counting the timer down.";
    };
  }
  function check(timer, steps, expectTimer, expectOpacity) {
    var start = { message: "Hi", messageTimer: timer, messageOpacity: 1 };
    return mt_scenario(runner, "fadeMessage", start, steps.map(function (s) { return [s]; }),
      { message: "Hi", messageTimer: expectTimer, messageOpacity: expectOpacity }, hintFor(start, steps));
  }

  runner.runTest("5 seconds left, 1 second passes -> 4 left, solid", function () { return check(5, [1], 4, 1); });
  runner.runTest("5 left, 2.5 seconds pass -> 2.5 left, solid", function () { return check(5, [2.5], 2.5, 1); });
  runner.runTest("3 left, 1 second passes -> 2 left, still solid (the fade starts now)", function () { return check(3, [1], 2, 1); });
  runner.runTest("2 left, 0.5 seconds pass -> 1.5 left, opacity 0.75", function () { return check(2, [0.5], 1.5, 0.75); });
  runner.runTest("1 left, 0.5 seconds pass -> 0.5 left, opacity 0.25", function () { return check(1, [0.5], 0.5, 0.25); });
  runner.runTest("3 left, 0.5 seconds pass twice -> 2 left, solid", function () { return check(3, [0.5, 0.5], 2, 1); });
  runner.runTest("0.5 left, 1 second passes -> 0 left, invisible (stops at 0)", function () { return check(0.5, [1], 0, 0); });
  runner.runTest("0 left, 1 second passes -> 0 left, invisible", function () { return check(0, [1], 0, 0); });
  runner.runTest("does NOT hard-code the examples (random check)", function () {
    var seconds = (1 + Math.floor(Math.random() * 12)) / 4;   // 0.25 to 3, exact in binary
    var left = 5 - seconds;
    return check(5, [seconds], left, left > 2 ? 1 : left / 2);
  });
}

function runTests(runner) {
  var tasks = [
    ["getReward", runTests_getReward],
    ["buyTools", runTests_buyTools],
    ["getCoinsPerSecond", runTests_getCoinsPerSecond],
    ["activateBoost", runTests_activateBoost],
    ["advanceAbility", runTests_advanceAbility],
    ["recruit", runTests_recruit],
    ["changeJob", runTests_changeJob],
    ["showMessage", runTests_showMessage],
    ["fadeMessage", runTests_fadeMessage],
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
  registerTask("Random Rewards: Get Reward", function (r) { runTests_getReward(r); });
  registerTask("Upgrades A: Buy Tools", function (r) { runTests_buyTools(r); });
  registerTask("Upgrades B: Coins Per Second", function (r) { runTests_getCoinsPerSecond(r); });
  registerTask("Abilities A: Activate Boost", function (r) { runTests_activateBoost(r); });
  registerTask("Abilities B: Advance Timers", function (r) { runTests_advanceAbility(r); });
  registerTask("Population A: Recruit", function (r) { runTests_recruit(r); });
  registerTask("Population B: Change Job", function (r) { runTests_changeJob(r); });
  registerTask("Messages A: Show Message", function (r) { runTests_showMessage(r); });
  registerTask("Messages B: Fade Message", function (r) { runTests_fadeMessage(r); });
}
