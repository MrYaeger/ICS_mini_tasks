/*
 * Task Set: Clicker Game — Unit 1
 * ---
 * One or two tiny tasks per lesson. Every task uses ONLY what the lessons have
 * taught by that point, so there are no parameters and no `return` until the
 * lessons cover them.
 *
 *   Lesson 1a  sayHello()       a function that prints something
 *   Lesson 1b  addClick()       a variable that a function changes
 *   Lesson 2a  buyFarm()        if / else, >=, a string message
 *   Lesson 2b  checkHarvest()   else if, comparing strings with ==
 *   Lesson 3a  buyHouse()       a named cost that rises after each purchase
 *   Lesson 3b  buyCastle()      two conditions joined with &&
 *   Lesson 4a  addCoins(amount)        a parameter
 *   Lesson 4b  getCoinsPerSecond()     return
 *   Lesson 4 bonus  afterClick() / afterHit()   two parameters and a return
 *   Lesson 5a  tick()           Date.now() and delta time (the tester calls tick itself)
 *   Lesson 5b  prettify(number) Math.floor, one decimal place under 100
 *   Lesson 6a  clampFood()      keep a resource between zero and its maximum
 *   Lesson 6b  updateBar()      percentage text, including zero capacity
 *   Lesson 7   chooseTab(name)  reset two displays and show the selected one
 *
 * HOW THE TASKS ARE CHECKED
 * Most tasks look like a tiny version of the game:
 * variables at the top of the file, and a function with empty () that changes
 * them. Each test SETS the variables, CALLS the function, and READS the
 * variables afterwards. For that to work the student must:
 *   - declare the variables at the top of the file with `var` (`let` works
 *     too, but not `const`: the tester changes them)
 *   - leave out document.getElementById - a mini task file has no page
 * They do not need to call their function; the tester does.
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

// Check that each variable exists and holds the right kind of value.
// `types` looks like { coins: "number", message: "string" }.
function mt_checkVars(runner, fnName, types) {
  var g = mt_globals(runner, fnName);
  var names = Object.keys(types);
  for (var i = 0; i < names.length; i++) {
    var name = names[i], want = types[name], got = g[name];
    if (typeof got === "undefined") {
      return [false, "Couldn't find a variable called " + name + ". Put  var " + name + " = " +
        (want === "string" ? "\"\"" : "0") + ";  at the top of your file, outside any function."];
    }
    if (typeof got !== want) {
      var fix = (want === "number" && typeof got === "string") ? " That's text - take the quotes off the number."
              : (want === "string" && typeof got === "number") ? " Text needs \"quotes\"." : "";
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

// Call a no-argument function and catch what it prints: { logs } or { crash }.
function mt_capture(runner, fnName) {
  try { return { logs: runner.captureConsole(runner.getFn(fnName), [])[0] }; }
  catch (e) { return { crash: mt_explain(fnName, e) }; }
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
// Lesson 1a: Say Hello
// ============================================================================
/*
 * Make a new file (for example lesson1.js) and write a function:
 *     function sayHello()
 *   - when it is called, it prints a message to the console with console.log
 *   - the message can say anything you like
 *
 * You don't need to call sayHello() yourself - the tester calls it.
 */
function runTests_sayHello(runner) {
  if (!mt_exists(runner, "sayHello")) return;

  runner.runTest("calling sayHello() prints something", function () {
    var out = mt_capture(runner, "sayHello");
    if (out.crash) return [false, out.crash];
    return out.logs.length > 0
      ? [true, "It printed " + out.logs.length + (out.logs.length === 1 ? " line" : " lines")]
      : [false, "sayHello() ran, but nothing was printed. Put a console.log(...) line inside the function's { braces }."];
  });

  runner.runTest("the message is real text", function () {
    var out = mt_capture(runner, "sayHello");
    if (out.crash) return [false, out.crash];
    var real = out.logs.filter(function (line) { return line.trim() !== "" && line !== "undefined"; });
    if (real.length > 0) return [true, "It printed: " + real[0]];
    if (out.logs.length === 0) return [false, "Nothing was printed, so there is no message to check yet."];
    return [false, "It printed " + mt_show(out.logs[0]) + ". Put your message inside the brackets, in quotes:  console.log(\"Hello!\");"];
  });
}

// ============================================================================
// Lesson 1b: Count Clicks
// ============================================================================
/*
 * In your file, make a variable and a function:
 *     var clicks = 0;          <- at the top of the file, outside any function
 *     function addClick()
 *   - every time addClick() is called, clicks goes up by 1
 *
 * This is your game's click function with the page taken out: no
 * document.getElementById, just the variable.
 */
function runTests_addClick(runner) {
  if (!mt_exists(runner, "addClick")) return;

  var unchanged = "clicks didn't change. Check that the line really changes it (clicks += 1, not just clicks + 1)," +
    " and that there is no var in front of it inside the function - var there makes a brand-new variable every time.";

  runner.runTest("clicks is a variable that starts at 0", function () {
    var found = mt_checkVars(runner, "addClick", { clicks: "number" });
    if (!found[0]) return found;
    var g = mt_globals(runner, "addClick");
    return g.clicks === 0
      ? [true, "clicks starts at 0"]
      : [false, "clicks should start at 0, but before the tester called anything it was " + mt_show(g.clicks) +
          ". (You don't need to call addClick() in your file - the tester does.)"];
  });

  runner.runTest("one click: 0 -> 1", function () {
    return mt_scenario(runner, "addClick", { clicks: 0 }, 1, { clicks: 1 }, function (g) {
      return g.clicks === 0 ? unchanged : "";
    });
  });

  runner.runTest("three clicks: 0 -> 3", function () {
    return mt_scenario(runner, "addClick", { clicks: 0 }, 3, { clicks: 3 }, function (g) {
      if (g.clicks === 0) return unchanged;
      if (g.clicks === 1) return "It got stuck at 1. The function has to ADD 1 to clicks (clicks += 1), not set it to 1.";
      return "";
    });
  });

  runner.runTest("keeps counting from wherever it is: 41 -> 42", function () {
    return mt_scenario(runner, "addClick", { clicks: 41 }, 1, { clicks: 42 }, function (g) {
      if (g.clicks === 41) return unchanged;
      if (g.clicks === 1) return "clicks went back to 1. The function has to ADD 1 to whatever clicks already is.";
      return "";
    });
  });
}

// ============================================================================
// Lesson 2a: Buy a Farm
// ============================================================================
/*
 * Variables at the top of your file:
 *     var coins = 0;      // how many coins the player has
 *     var farms = 0;      // how many farms the player owns
 *     var message = "";   // what the message box says
 *
 * Write a function:   function buyFarm()
 *   - a farm costs 10 coins
 *   - IF the player has enough coins: take 10 coins away and add 1 farm
 *   - ELSE: change nothing, except set message to "Not enough coins"
 *
 * Example:  coins = 25 -> buyFarm() -> coins = 15, farms = 1
 *           coins = 4  -> buyFarm() -> coins = 4,  farms = 0, message = "Not enough coins"
 *
 * (Yes, 10 is a magic number. The next lesson deals with that.)
 */
function runTests_buyFarm(runner) {
  if (!mt_exists(runner, "buyFarm")) return;

  runner.runTest("coins, farms and message are variables", function () {
    return mt_checkVars(runner, "buyFarm", { coins: "number", farms: "number", message: "string" });
  });

  runner.runTest("enough coins: 25 coins buys a farm", function () {
    return mt_scenario(runner, "buyFarm", { coins: 25, farms: 0, message: "" }, 1, { coins: 15, farms: 1 }, function (g) {
      if (g.coins === 25 && g.farms === 0) return "Nothing was bought. The player can afford a farm when coins >= 10.";
      if (g.coins === 0 && g.farms === 1) return "Did you write = instead of >= ? A single = PUTS 10 into coins instead of comparing.";
      return "";
    });
  });

  runner.runTest("exactly enough: 10 coins buys a farm", function () {
    return mt_scenario(runner, "buyFarm", { coins: 10, farms: 0, message: "" }, 1, { coins: 0, farms: 1 }, function (g) {
      return g.farms === 0 ? "Exactly 10 coins should be enough. Did you write > where you need >= ?" : "";
    });
  });

  runner.runTest("not enough: 9 coins buys nothing", function () {
    return mt_scenario(runner, "buyFarm", { coins: 9, farms: 0, message: "" }, 1, { coins: 9, farms: 0 }, function (g) {
      if (g.coins === 0 && g.farms === 1) return "Did you write = instead of >= ? A single = PUTS 10 into coins instead of comparing.";
      if (g.farms === 1) return "The farm was bought anyway. Taking the coins and adding the farm both belong inside the if's { braces }.";
      return "";
    });
  });

  runner.runTest("not enough: message says \"Not enough coins\"", function () {
    var g = mt_globals(runner, "buyFarm");
    g.coins = 4; g.farms = 0; g.message = "";
    try { runner.getFn("buyFarm")(); } catch (e) { return [false, mt_explain("buyFarm", e)]; }
    if (typeof g.message === "string" && /not enough/i.test(g.message)) return [true, "With 4 coins, message = " + mt_show(g.message)];
    if (g.farms !== 0) return [false, "With 4 coins, a farm was bought, so the else never ran. Fix the if first (look for a single =)."];
    if (g.message === "") return [false, "With 4 coins, message should become \"Not enough coins\", but it's still empty. Set it in an else."];
    return [false, "With 4 coins, message should be \"Not enough coins\", but it is " + mt_show(g.message) + "."];
  });

  runner.runTest("a farm that IS bought doesn't say \"Not enough coins\"", function () {
    var g = mt_globals(runner, "buyFarm");
    g.coins = 50; g.farms = 0; g.message = "";
    try { runner.getFn("buyFarm")(); } catch (e) { return [false, mt_explain("buyFarm", e)]; }
    return (typeof g.message === "string" && /not enough/i.test(g.message))
      ? [false, "With 50 coins, message says " + mt_show(g.message) + ". Setting that message belongs inside the else, not after the if."]
      : [true, "With 50 coins, message = " + mt_show(g.message)];
  });

  runner.runTest("five clicks with 35 coins: 3 farms, 5 coins left", function () {
    return mt_scenario(runner, "buyFarm", { coins: 35, farms: 0, message: "" }, 5, { coins: 5, farms: 3 }, function (g) {
      return g.coins < 0 ? "coins went below zero. The if has to check before every purchase." : "";
    });
  });
}

// ============================================================================
// Lesson 2b: Harvest Season
// ============================================================================
/*
 * Variables at the top of your file:
 *     var season = "spring";   // "spring", "summer", "autumn" or "winter"
 *     var harvest = 0;         // how much food the next harvest gives
 *
 * Write a function:   function checkHarvest()
 *   - if season is "summer", set harvest to 10
 *   - else if season is "winter", set harvest to 0
 *   - else (any other season), set harvest to 5
 *
 * Compare strings with ==, and remember the season names need "quotes".
 */
function runTests_checkHarvest(runner) {
  if (!mt_exists(runner, "checkHarvest")) return;

  runner.runTest("season and harvest are variables", function () {
    return mt_checkVars(runner, "checkHarvest", { season: "string", harvest: "number" });
  });

  function check(season, expected) {
    return mt_scenario(runner, "checkHarvest", { season: season, harvest: 99 }, 1, { season: season, harvest: expected }, function (g) {
      if (g.season !== season) return "season changed to " + mt_show(g.season) + "! Compare with == . A single = PUTS a value into season.";
      if (g.harvest === 99) return "harvest wasn't set for " + mt_show(season) + ". Every season must end up with a harvest - that's the job of the last else.";
      if (season === "summer" && g.harvest === 5) return "Summer gave 5. If you wrote two separate ifs, the else belongs only to the second one, so it runs in summer too. Make the second one an else if.";
      return "";
    });
  }

  runner.runTest("summer -> 10", function () { return check("summer", 10); });
  runner.runTest("winter -> 0", function () { return check("winter", 0); });
  runner.runTest("spring -> 5", function () { return check("spring", 5); });
  runner.runTest("autumn -> 5", function () { return check("autumn", 5); });
  runner.runTest("\"Summer\" with a capital S is not \"summer\" -> 5", function () { return check("Summer", 5); });
}

// ============================================================================
// Lesson 3a: Rising Prices
// ============================================================================
/*
 * Variables at the top of your file:
 *     var coins = 0;        // how many coins the player has
 *     var houses = 0;       // how many houses the player owns
 *     var houseCost = 10;   // what the NEXT house costs
 *
 * Write a function:   function buyHouse()
 *   - IF the player has at least houseCost coins:
 *       take houseCost coins away, add 1 house, and THEN make houseCost 5 bigger
 *   - otherwise nothing changes - not even the price
 *
 * No magic numbers: the price always comes from houseCost, never a bare 10.
 * The 5 never changes, so it can be a const:   const houseCostIncrease = 5;
 * (houseCost itself DOES change, so it must stay a var.)
 *
 * Example:  coins = 100 -> buyHouse() -> coins = 90, houses = 1, houseCost = 15
 *                       -> buyHouse() -> coins = 75, houses = 2, houseCost = 20
 */
function runTests_buyHouse(runner) {
  if (!mt_exists(runner, "buyHouse")) return;

  runner.runTest("coins, houses and houseCost are variables", function () {
    return mt_checkVars(runner, "buyHouse", { coins: "number", houses: "number", houseCost: "number" });
  });

  runner.runTest("first house: pay 10, then the price goes up to 15", function () {
    return mt_scenario(runner, "buyHouse", { coins: 100, houses: 0, houseCost: 10 }, 1, { coins: 90, houses: 1, houseCost: 15 }, function (g) {
      if (g.houses === 1 && g.houseCost === 10) return "The house was bought, but houseCost didn't go up. Add 5 to houseCost inside the if," +
        " and check there's no var houseCost inside the function (that makes a brand-new copy every time).";
      if (g.coins === 85) return "The player was charged 15 - the NEXT price. Take the coins first, then raise houseCost.";
      return "";
    });
  });

  runner.runTest("second house costs the new price (15)", function () {
    return mt_scenario(runner, "buyHouse", { coins: 100, houses: 0, houseCost: 10 }, 2, { coins: 75, houses: 2, houseCost: 20 }, function (g) {
      return g.coins === 80 ? "The second house cost 10 again. Use houseCost in the if AND in the subtraction, never a bare 10." : "";
    });
  });

  runner.runTest("the check uses houseCost: 30 coins can't buy a 40-coin house", function () {
    return mt_scenario(runner, "buyHouse", { coins: 30, houses: 0, houseCost: 40 }, 1, { coins: 30, houses: 0, houseCost: 40 }, function (g) {
      if (g.houses === 1) return "A 40-coin house was bought with 30 coins. Does your if say coins >= 10 instead of coins >= houseCost?";
      if (g.houseCost !== 40) return "Nothing was bought, but the price changed. Raising houseCost belongs inside the if.";
      return "";
    });
  });

  runner.runTest("exactly enough: 12 coins buys a 12-coin house", function () {
    return mt_scenario(runner, "buyHouse", { coins: 12, houses: 0, houseCost: 12 }, 1, { coins: 0, houses: 1, houseCost: 17 }, function (g) {
      if (g.houses === 0) return "Exactly enough should buy it. Did you write > where you need >= ?";
      if (g.coins === 2) return "10 coins were taken for a 12-coin house. Subtract houseCost, not a bare 10.";
      return "";
    });
  });

  runner.runTest("can't afford it: nothing changes, not even the price", function () {
    return mt_scenario(runner, "buyHouse", { coins: 5, houses: 2, houseCost: 20 }, 1, { coins: 5, houses: 2, houseCost: 20 }, function (g) {
      return g.houseCost === 25 ? "The price went up even though nothing was bought. Raising houseCost belongs inside the if." : "";
    });
  });

  runner.runTest("does NOT hard-code the examples (random check)", function () {
    var coins = 200 + Math.floor(Math.random() * 200);
    var houses = Math.floor(Math.random() * 10);
    var cost = 11 + Math.floor(Math.random() * 50);
    return mt_scenario(runner, "buyHouse", { coins: coins, houses: houses, houseCost: cost }, 1,
      { coins: coins - cost, houses: houses + 1, houseCost: cost + 5 });
  });
}

// ============================================================================
// Lesson 3b: Castle Requirements
// ============================================================================
/*
 * Variables at the top of your file:
 *     var coins = 0;     // how many coins the player has
 *     var houses = 0;    // how many houses the player owns
 *     var castles = 0;   // how many castles the player owns
 *
 * Write a function:   function buyCastle()
 *   - a castle costs 50 coins, AND the player must already own at least 3 houses
 *   - IF both are true: take 50 coins away and add 1 castle
 *     (the houses are NOT used up - the player keeps them)
 *   - otherwise nothing changes
 *
 * Check both in ONE if, joined with &&.
 * No magic numbers - these two never change, so make them consts:
 *     const castleCost = 50;
 *     const housesForCastle = 3;
 */
function runTests_buyCastle(runner) {
  if (!mt_exists(runner, "buyCastle")) return;

  runner.runTest("coins, houses and castles are variables", function () {
    return mt_checkVars(runner, "buyCastle", { coins: "number", houses: "number", castles: "number" });
  });

  var oneIf = " Both checks go in the same if, joined with && (&& means both must be true; || means either one is enough).";

  runner.runTest("100 coins and 3 houses: builds a castle and keeps the houses", function () {
    return mt_scenario(runner, "buyCastle", { coins: 100, houses: 3, castles: 0 }, 1, { coins: 50, houses: 3, castles: 1 }, function (g) {
      if (g.castles === 1 && g.houses !== 3) return "The houses were used up. A castle only needs them - don't subtract them.";
      if (g.castles === 0) return "Nothing was built, but the player had enough coins AND enough houses.";
      return "";
    });
  });

  runner.runTest("500 coins but only 2 houses: no castle", function () {
    return mt_scenario(runner, "buyCastle", { coins: 500, houses: 2, castles: 0 }, 1, { coins: 500, houses: 2, castles: 0 }, function (g) {
      return (g.castles !== 0 || g.coins !== 500) ? "The player only has 2 houses, but something changed." + oneIf : "";
    });
  });

  runner.runTest("10 houses but only 49 coins: no castle", function () {
    return mt_scenario(runner, "buyCastle", { coins: 49, houses: 10, castles: 0 }, 1, { coins: 49, houses: 10, castles: 0 }, function (g) {
      return (g.castles !== 0 || g.coins !== 49) ? "The player only has 49 coins, but something changed." + oneIf : "";
    });
  });

  runner.runTest("no coins and no houses: no castle", function () {
    return mt_scenario(runner, "buyCastle", { coins: 0, houses: 0, castles: 0 }, 1, { coins: 0, houses: 0, castles: 0 });
  });

  runner.runTest("exactly 50 coins and exactly 3 houses is enough", function () {
    return mt_scenario(runner, "buyCastle", { coins: 50, houses: 3, castles: 0 }, 1, { coins: 0, houses: 3, castles: 1 }, function (g) {
      return g.castles === 0 ? "Exactly enough of both should work. Check for > where you need >= ." : "";
    });
  });

  runner.runTest("four clicks with 175 coins and 3 houses: 3 castles", function () {
    return mt_scenario(runner, "buyCastle", { coins: 175, houses: 3, castles: 0 }, 4, { coins: 25, houses: 3, castles: 3 });
  });
}

// ============================================================================
// Lesson 4a: Add Coins
// ============================================================================
/*
 * A variable at the top of your file:
 *     var coins = 0;   // how many coins the player has
 *
 * Write a function:   function addCoins(amount)
 *   - adds amount to coins
 *
 * Example:  coins = 7 -> addCoins(10) -> coins = 17
 */
function runTests_addCoins(runner) {
  if (!mt_exists(runner, "addCoins")) return;

  runner.runTest("addCoins takes a parameter", function () {
    return runner.getFn("addCoins").length >= 1
      ? [true, "addCoins has a parameter"]
      : [false, "addCoins has empty brackets. Put a name for the amount between them:  function addCoins(amount) { ... }"];
  });

  runner.runTest("coins is a variable", function () {
    return mt_checkVars(runner, "addCoins", { coins: "number" });
  });

  function hintFor(start, amount) {
    return function (g) {
      if (typeof g.coins === "number" && isNaN(g.coins)) {
        return "coins became NaN (not a number). Inside the function, use the parameter's name, spelled exactly as it is in the brackets.";
      }
      if (g.coins === amount && start !== 0) return "coins was replaced by the amount instead of having it added. Use  coins += amount.";
      if (g.coins === start + 1 && amount !== 1) return "It added 1, not the amount it was given. Use the parameter:  coins += amount.";
      if (g.coins === start) return "coins didn't change. Add the parameter to it:  coins += amount.";
      return "";
    };
  }

  runner.runTest("addCoins(5) with 0 coins -> 5", function () {
    return mt_scenario(runner, "addCoins", { coins: 0 }, [[5]], { coins: 5 }, hintFor(0, 5));
  });
  runner.runTest("addCoins(10) with 7 coins -> 17", function () {
    return mt_scenario(runner, "addCoins", { coins: 7 }, [[10]], { coins: 17 }, hintFor(7, 10));
  });
  runner.runTest("addCoins(0.5) twice with 3 coins -> 4", function () {
    return mt_scenario(runner, "addCoins", { coins: 3 }, [[0.5], [0.5]], { coins: 4 }, hintFor(3, 0.5));
  });
  runner.runTest("does NOT hard-code the examples (random check)", function () {
    var start = Math.floor(Math.random() * 100), amount = 2 + Math.floor(Math.random() * 50);
    return mt_scenario(runner, "addCoins", { coins: start }, [[amount]], { coins: start + amount }, hintFor(start, amount));
  });
}

// ============================================================================
// Lesson 4b: Coins Per Second
// ============================================================================
/*
 * At the top of your file:
 *     var farms = 0;             // how many farms the player owns
 *     var mines = 0;             // how many mines the player owns
 *     const coinsPerFarm = 2;    // coins each farm makes per second
 *     const coinsPerMine = 10;   // coins each mine makes per second
 *
 * Write a function:   function getCoinsPerSecond()
 *   - RETURNS how many coins per second all the farms and mines make together
 *   - doesn't change any variables, and doesn't print anything
 *
 * Example:  farms = 3, mines = 2 -> getCoinsPerSecond() returns 26
 */
function runTests_getCoinsPerSecond(runner) {
  if (!mt_exists(runner, "getCoinsPerSecond")) return;

  runner.runTest("farms and mines are variables", function () {
    return mt_checkVars(runner, "getCoinsPerSecond", { farms: "number", mines: "number" });
  });

  function check(farms, mines) {
    return mt_returns(runner, "getCoinsPerSecond", { farms: farms, mines: mines }, [], farms * 2 + mines * 10, function (got) {
      if (got === farms * 10 + mines * 2) return "The rates are swapped: each farm makes 2, and each mine makes 10.";
      if (got === farms + mines) return "That's just the number of buildings. Multiply each count by its rate first.";
      return "";
    });
  }

  runner.runTest("no buildings -> 0", function () { return check(0, 0); });
  runner.runTest("3 farms -> 6", function () { return check(3, 0); });
  runner.runTest("2 mines -> 20", function () { return check(0, 2); });
  runner.runTest("3 farms and 2 mines -> 26", function () { return check(3, 2); });
  runner.runTest("does NOT hard-code the examples (random check)", function () {
    return check(1 + Math.floor(Math.random() * 20), 1 + Math.floor(Math.random() * 20));
  });
}

// ============================================================================
// Lesson 4 bonus: After Click  (two parameters and a return)
// ============================================================================
/*
 * Write a function:   function afterClick(current, perClick)
 *   - returns how much of the resource the player has AFTER one click
 *   - a click adds perClick to current
 *
 * Example:  afterClick(0, 1)   → 1
 *           afterClick(17, 5)  → 22
 */
function runTests_afterClick(runner) {
  runner.runTest("afterClick exists", function () {
    return typeof runner.getFn("afterClick") === "function"
      ? [true, "Found afterClick"]
      : [false, "Define it as:  function afterClick(current, perClick) { ... }"];
  });
  if (typeof runner.getFn("afterClick") !== "function") return;

  runner.runTest("first click: 0 + 1 -> 1", function () { return runner.checkReturns("afterClick", [0, 1], 1); });
  runner.runTest("17 + 5 -> 22", function () { return runner.checkReturns("afterClick", [17, 5], 22); });
  runner.runTest("a big click: 100 + 250 -> 350", function () { return runner.checkReturns("afterClick", [100, 250], 350); });
  runner.runTest("perClick of 0 changes nothing", function () { return runner.checkReturns("afterClick", [42, 0], 42); });
  runner.runTest("decimals work too: 1.5 + 0.25 -> 1.75", function () {
    var got = runner.getFn("afterClick")(1.5, 0.25);
    return Math.abs(got - 1.75) < 1e-9
      ? [true, "afterClick(1.5, 0.25) -> " + got]
      : [false, "Expected 1.75 but got " + JSON.stringify(got)];
  });
  runner.runTest("does NOT hard-code the example (random check)", function () {
    var fn = runner.getFn("afterClick");
    var a = Math.floor(Math.random() * 90) + 1, b = Math.floor(Math.random() * 9) + 1;
    var got = fn(a, b);
    return got === a + b
      ? [true, "Worked for a random click (" + a + " + " + b + ")"]
      : [false, "afterClick(" + a + ", " + b + "): expected " + (a + b) + " but got " + JSON.stringify(got)];
  });
}

// ============================================================================
// Lesson 4 bonus: After Hit  (two parameters and a return)
// ============================================================================
/*
 * Write a function:   function afterHit(health, damage)
 *   - returns the enemy's health AFTER being hit once
 *   - a hit subtracts damage from health
 *   - do NOT stop it going below zero: keeping a number inside limits is a
 *     separate job (Lesson 6). A health of -3 is a correct answer here.
 *
 * Example:  afterHit(10, 1)  → 9
 *           afterHit(2, 5)   → -3
 */
function runTests_afterHit(runner) {
  runner.runTest("afterHit exists", function () {
    return typeof runner.getFn("afterHit") === "function"
      ? [true, "Found afterHit"]
      : [false, "Define it as:  function afterHit(health, damage) { ... }"];
  });
  if (typeof runner.getFn("afterHit") !== "function") return;

  runner.runTest("first hit: 10 - 1 -> 9", function () { return runner.checkReturns("afterHit", [10, 1], 9); });
  runner.runTest("a big hit: 10 - 5 -> 5", function () { return runner.checkReturns("afterHit", [10, 5], 5); });
  runner.runTest("exactly dead: 1 - 1 -> 0", function () { return runner.checkReturns("afterHit", [1, 1], 0); });
  runner.runTest("overkill goes negative: 2 - 5 -> -3", function () { return runner.checkReturns("afterHit", [2, 5], -3); });
  runner.runTest("already negative: -3 - 1 -> -4", function () { return runner.checkReturns("afterHit", [-3, 1], -4); });
  runner.runTest("does NOT hard-code the example (random check)", function () {
    var fn = runner.getFn("afterHit");
    var h = Math.floor(Math.random() * 90) + 10, d = Math.floor(Math.random() * 9) + 1;
    var got = fn(h, d);
    return got === h - d
      ? [true, "Worked for a random hit (" + h + " - " + d + ")"]
      : [false, "afterHit(" + h + ", " + d + "): expected " + (h - d) + " but got " + JSON.stringify(got)];
  });
}

// ============================================================================
// Lesson 5a: Tick
// ============================================================================
/*
 * Variables at the top of your file:
 *     var coins = 0;               // how many coins the player has
 *     var coinsPerSecond = 4;      // how many coins the player makes every second
 *     var lastTick = Date.now();   // when tick() last ran, in milliseconds
 *
 * Write a function:   function tick()
 *   - works out how many SECONDS have passed since lastTick
 *   - adds coinsPerSecond x that many seconds to coins
 *   - sets lastTick to the current time, so the next tick only counts new time
 *
 * Do NOT start a timer: no setInterval in this file. The tester calls tick()
 * itself, after pretending that some time has passed.
 */

// Pretend `seconds` seconds have passed since the last tick, then call tick().
function mt_tickAfter(runner, seconds, perSecond, startCoins) {
  var g = mt_globals(runner, "tick");
  g.coins = startCoins;
  g.coinsPerSecond = perSecond;
  g.lastTick = Date.now() - seconds * 1000;
  try { runner.getFn("tick")(); }
  catch (e) { return { crash: mt_explain("tick", e) }; }
  return { g: g, added: g.coins - startCoins };
}

function mt_round3(x) { return Math.round(x * 1000) / 1000; }

// One tick after `seconds` seconds: did it add perSecond x seconds? (Allows a
// quarter of a second of slack for a slow computer.)
function mt_tickCheck(runner, seconds, perSecond) {
  var run = mt_tickAfter(runner, seconds, perSecond, 0);
  if (run.crash) return [false, run.crash];
  var want = perSecond * seconds, added = run.added, slack = perSecond * 0.25;
  var label = seconds + " seconds at " + perSecond + " coins per second";
  if (added >= want - 1e-9 && added <= want + slack) return [true, label + ": added " + mt_round3(added) + " coins"];
  var msg = label + " should add " + want + " coins, but it added " + mt_show(mt_round3(added)) + ".";
  if (typeof added !== "number" || isNaN(added)) {
    msg += " coins isn't a number anymore. Check that Date.now() has its brackets, and that every name is spelled the same everywhere.";
  } else if (added === 0) {
    msg += " Nothing was added. Is there a  var lastTick  inside tick()? That makes a brand-new lastTick, with no time passed.";
  } else if (Math.abs(added - want * 1000) <= slack * 1000) {
    msg += " That's 1000 times too many: Date.now() counts milliseconds. Divide by 1000 to get seconds.";
  } else if (added < 0) {
    msg += " coins went DOWN. The time that has passed is  now - lastTick, not  lastTick - now.";
  } else if (Math.abs(added - perSecond) < 1e-9) {
    msg += " It added coinsPerSecond once, no matter how much time had passed. Multiply it by the number of seconds.";
  }
  return [false, msg];
}

function runTests_tick(runner) {
  if (!mt_exists(runner, "tick")) return;

  runner.runTest("coins, coinsPerSecond and lastTick are variables", function () {
    var found = mt_checkVars(runner, "tick", { coins: "number", coinsPerSecond: "number", lastTick: "number" });
    if (!found[0]) return found;
    var g = mt_globals(runner, "tick");
    return Math.abs(Date.now() - g.lastTick) < 60000
      ? [true, "lastTick starts as the time from Date.now()"]
      : [false, "lastTick should start as Date.now() (the time right now, in milliseconds), but it is " + mt_show(g.lastTick) + "."];
  });

  runner.runTest("2 seconds at 4 coins per second adds 8 coins", function () { return mt_tickCheck(runner, 2, 4); });
  runner.runTest("half a second at 10 coins per second adds 5 coins", function () { return mt_tickCheck(runner, 0.5, 10); });

  runner.runTest("tick() moves lastTick up to the current time", function () {
    var run = mt_tickAfter(runner, 3, 1, 0);
    if (run.crash) return [false, run.crash];
    var behind = Date.now() - run.g.lastTick;
    return behind >= 0 && behind < 250
      ? [true, "lastTick was moved up to the current time"]
      : [false, "After tick(), lastTick is still " + mt_round3(behind / 1000) + " seconds behind. Set  lastTick = now  in tick()," +
          " so the next tick only counts new time."];
  });

  runner.runTest("a second tick straight afterwards adds (almost) nothing", function () {
    var run = mt_tickAfter(runner, 3, 10, 0);
    if (run.crash) return [false, run.crash];
    var afterFirst = run.g.coins;
    try { runner.getFn("tick")(); } catch (e) { return [false, mt_explain("tick", e)]; }
    var extra = run.g.coins - afterFirst;
    return extra >= 0 && extra < 2.5
      ? [true, "The second tick added " + mt_round3(extra) + " coins"]
      : [false, "The first tick added " + mt_round3(afterFirst) + " coins, and a second tick straight afterwards added " +
          mt_show(mt_round3(extra)) + " more. lastTick has to move forward every tick, or the same seconds get counted again."];
  });

  runner.runTest("does NOT hard-code the examples (random check)", function () {
    return mt_tickCheck(runner, 1 + Math.floor(Math.random() * 4), 2 + Math.floor(Math.random() * 8));
  });
}

// ============================================================================
// Lesson 5b: Prettify
// ============================================================================
/*
 * Write a function:   function prettify(number)
 *   - RETURNS the number rounded DOWN, ready to show on the page:
 *       under 100:    to one decimal place    prettify(12.34)  returns 12.3
 *       100 or more:  to a whole number       prettify(1234.5) returns 1234
 *   - doesn't print anything
 */
function runTests_prettify(runner) {
  if (!mt_exists(runner, "prettify")) return;

  function correct(n) { return n < 100 ? Math.floor(n * 10) / 10 : Math.floor(n); }

  function check(input) {
    var fn = runner.getFn("prettify"), out;
    try { out = runner.captureConsole(fn, [input]); }
    catch (e) { return [false, mt_explain("prettify", e, fn)]; }
    var got = out[1], want = correct(input);
    if (got === want) return [true, "prettify(" + input + ") -> " + got];
    var msg = "prettify(" + input + ") should give back " + want + ", but it gave back " + mt_show(got) + ".";
    if (got === undefined && out[0].length > 0) {
      msg += " It printed " + mt_show(out[0][0]) + " instead. return gives the answer back to the code.";
    } else if (got === undefined) {
      msg += " Nothing came back - put return in front of the answer.";
    } else if (typeof got === "string") {
      msg += " That's text, not a number.";
    } else if (input < 100 && got === Math.round(input * 10) / 10) {
      msg += " That rounded to the NEAREST tenth. Round DOWN, with Math.floor.";
    } else if (input >= 100 && got === Math.round(input)) {
      msg += " That rounded to the NEAREST whole number. Round DOWN, with Math.floor.";
    } else if (input < 100 && got === Math.floor(input)) {
      msg += " Numbers under 100 keep one decimal place:  Math.floor(number * 10) / 10";
    } else if (input >= 100 && got === Math.floor(input * 10) / 10) {
      msg += " Numbers from 100 up are shown as whole numbers.";
    }
    return [false, msg];
  }

  runner.runTest("1234.56 -> 1234 (big numbers are whole)", function () { return check(1234.56); });
  runner.runTest("150.9 -> 150 (rounds DOWN)", function () { return check(150.9); });
  runner.runTest("100.5 -> 100", function () { return check(100.5); });
  runner.runTest("99.99 -> 99.9 (under 100 keeps one decimal place)", function () { return check(99.99); });
  runner.runTest("12.34 -> 12.3", function () { return check(12.34); });
  runner.runTest("3.99 -> 3.9 (rounds DOWN)", function () { return check(3.99); });
  runner.runTest("7 -> 7", function () { return check(7); });
  runner.runTest("0.05 -> 0", function () { return check(0.05); });
  runner.runTest("does NOT hard-code the examples (random check)", function () {
    return check(Math.floor(Math.random() * 100000) / 100);
  });
}

// ============================================================================

// Lesson 6a: Clamp Food
// var food = 0; var maxFood = 100;
// clampFood() keeps food in [0, maxFood], without changing maxFood.
// maxFood is non-negative; food may have decimals.
function runTests_clampFood(runner) {
  if (!mt_exists(runner, "clampFood")) return;
  runner.runTest("food and maxFood are number variables", function () {
    return mt_checkVars(runner, "clampFood", { food: "number", maxFood: "number" });
  });
  var cases = [
    [-3, 100, 0], [0, 100, 0], [37.5, 100, 37.5],
    [100, 100, 100], [103, 100, 100], [900, 40, 40],
    [0, 0, 0], [8, 0, 0], [-2, 0, 0], [12.5, 12.5, 12.5],
    [20, 12.5, 12.5]
  ];
  cases.forEach(function (c) {
    runner.runTest("food " + c[0] + ", maximum " + c[1] + " -> " + c[2], function () {
      return mt_scenario(runner, "clampFood", { food: c[0], maxFood: c[1] }, 1,
        { food: c[2], maxFood: c[1] }, function () {
          return "Change food only when it is outside the limits. Use maxFood, not a fixed 100; keep fractions.";
        });
    });
  });
  runner.runTest("applying the limit repeatedly preserves valid food", function () {
    return mt_scenario(runner, "clampFood", { food: 42.5, maxFood: 80 }, 3,
      { food: 42.5, maxFood: 80 });
  });
}

// Lesson 6b: Bar Width
// var food = 0; var maxFood = 100; var barWidth = "0%";
// updateBar() changes only barWidth. Inputs already satisfy 0 <= food <= maxFood.
// Do not round. A zero maximum gives "0%".
function runTests_updateBar(runner) {
  if (!mt_exists(runner, "updateBar")) return;
  runner.runTest("food, maxFood and barWidth are variables", function () {
    return mt_checkVars(runner, "updateBar", { food: "number", maxFood: "number", barWidth: "string" });
  });
  var cases = [
    [35, 50, "70%"], [0, 100, "0%"], [100, 100, "100%"],
    [75, 300, "25%"], [75, 500, "15%"], [1, 8, "12.5%"],
    [0.5, 2, "25%"], [0, 0, "0%"]
  ];
  cases.forEach(function (c) {
    runner.runTest(c[0] + " / " + c[1] + " -> " + c[2], function () {
      return mt_scenario(runner, "updateBar", { food: c[0], maxFood: c[1], barWidth: "old" }, 1,
        { food: c[0], maxFood: c[1], barWidth: c[2] }, function () {
          return "Divide food by maxFood, multiply by 100, then join \"%\". For zero capacity use \"0%\". Don't change the resources.";
        });
    });
  });
}

// Lesson 7: Choose Tab
// var currentTab = "home"; var homeDisplay = "block"; var shopDisplay = "none";
// chooseTab(name) receives only "home" or "shop", remembers it, hides both,
// then sets the selected display to "block". There is no document in this task.
function runTests_chooseTab(runner) {
  if (!mt_exists(runner, "chooseTab")) return;
  runner.runTest("tab state variables hold strings", function () {
    return mt_checkVars(runner, "chooseTab", {
      currentTab: "string", homeDisplay: "string", shopDisplay: "string"
    });
  });
  var sequences = [
    ["home"], ["shop"], ["shop", "home"], ["home", "shop"],
    ["shop", "shop"], ["home", "home"], ["shop", "home", "shop", "home"]
  ];
  sequences.forEach(function (names) {
    runner.runTest("choose " + names.join(" then "), function () {
      var selected = names[names.length - 1];
      return mt_scenario(runner, "chooseTab",
        { currentTab: "home", homeDisplay: "block", shopDisplay: "block" },
        names.map(function (name) { return [name]; }),
        { currentTab: selected, homeDisplay: selected === "home" ? "block" : "none",
          shopDisplay: selected === "shop" ? "block" : "none" }, function () {
            return "Remember name, hide BOTH displays, then show the chosen one. Use lowercase strings \"block\" and \"none\".";
          });
    });
  });
}

function runTests(runner) {
  var tasks = [
    ["sayHello", runTests_sayHello],
    ["addClick", runTests_addClick],
    ["buyFarm", runTests_buyFarm],
    ["checkHarvest", runTests_checkHarvest],
    ["buyHouse", runTests_buyHouse],
    ["buyCastle", runTests_buyCastle],
    ["addCoins", runTests_addCoins],
    ["getCoinsPerSecond", runTests_getCoinsPerSecond],
    ["afterClick", runTests_afterClick],
    ["afterHit", runTests_afterHit],
    ["tick", runTests_tick],
    ["prettify", runTests_prettify],
    ["clampFood", runTests_clampFood],
    ["updateBar", runTests_updateBar],
    ["chooseTab", runTests_chooseTab],
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
  registerTask("Lesson 1a: Say Hello", function (r) { runTests_sayHello(r); });
  registerTask("Lesson 1b: Count Clicks", function (r) { runTests_addClick(r); });
  registerTask("Lesson 2a: Buy a Farm", function (r) { runTests_buyFarm(r); });
  registerTask("Lesson 2b: Harvest Season", function (r) { runTests_checkHarvest(r); });
  registerTask("Lesson 3a: Rising Prices", function (r) { runTests_buyHouse(r); });
  registerTask("Lesson 3b: Castle Requirements", function (r) { runTests_buyCastle(r); });
  registerTask("Lesson 4a: Add Coins", function (r) { runTests_addCoins(r); });
  registerTask("Lesson 4b: Coins Per Second", function (r) { runTests_getCoinsPerSecond(r); });
  registerTask("Lesson 4 bonus: After Click", function (r) { runTests_afterClick(r); });
  registerTask("Lesson 4 bonus: After Hit", function (r) { runTests_afterHit(r); });
  registerTask("Lesson 5a: Tick", function (r) { runTests_tick(r); });
  registerTask("Lesson 5b: Prettify", function (r) { runTests_prettify(r); });
  registerTask("Lesson 6a: Clamp Food", function (r) { runTests_clampFood(r); });
  registerTask("Lesson 6b: Bar Width", function (r) { runTests_updateBar(r); });
  registerTask("Lesson 7: Choose Tab", function (r) { runTests_chooseTab(r); });
}
