# JavaScript Mini Task Suite

**September 24 additions:** a new task file, `clicker_parts_bin.test.js`, holds the mini tasks
for the optional Parts Bin cards: **Random Rewards: Get Reward** (`getReward(roll)`),
**Upgrades A: Buy Tools** (`buyTools`), and **Upgrades B: Coins Per Second**
(`getCoinsPerSecond`, with a farms-only multiplier). It has its own line in `tests/manifest.js`
under *Clicker Game - Parts Bin*. The Get Reward check briefly replaces the student file's
`Math.random` with a counter, so a `getReward` that rolls its own number is caught every run;
the original is always put back. `node scripts/verify_clicker_parts_bin.cjs` checks the two
cards' snapshots and these tasks the same way the Lesson 6–7 script does.

**September 19 additions:** `clicker_unit1.test.js` now includes **Lesson 6a: Clamp Food**
(`clampFood`), **Lesson 6b: Bar Width** (`updateBar`), and **Lesson 7: Choose Tab**
(`chooseTab`). Their instructions are in the corresponding Clicker Lessons drafts and the
test-file comments. The existing manifest already includes this task file. These are local
additions; publishing still uses the process below.

From the course workspace, `node scripts/verify_clicker_lessons_6_7.cjs` checks the lesson
snapshots with a small DOM substitute, the three mini tasks with correct and deliberately
incorrect solutions, browser task registration, and the existing single-file/batch CLI.
It does not check visual rendering in a browser.

The JavaScript counterpart to the Python `test.py` suite. Students write a small,
**self-contained `.js` file** containing a plain function; it gets checked against a set of
tests. Students self-check on a **website** (a link on D2L — nothing to download); you
batch-test submissions with Node.

## Files
| File | Who | What |
|------|-----|------|
| `harness.js` | shared | The test engine. Works in Node *and* the browser. Don't edit per-task. |
| `runner.html` | **students** | The tester page. On the website it lists every published task in a dropdown; students pick a task, pick their `.js`, click Run. |
| `index.html` | website | Just forwards the site's short address to `runner.html`. Never edit. |
| `tests/*.test.js` | shared | One file per task: the description (top comment) + the tests. |
| `tests/manifest.js` | **teacher** | **The list of task files the website shows.** One line per file. |
| `test.js` | **teacher** | Node command-line runner, with a batch mode. |
| `examples/` | teacher | Sample correct/buggy solutions + a `submissions_demo/` folder for batch. **Not published** (see `.gitignore`). |
| `.gitignore`, `.nojekyll` | website | Keep `examples/` out of the public repo; tell GitHub Pages to serve the files as-is. |

**Distribution model:** this folder *is* the website (hosted on GitHub Pages — see
[Publishing](#publishing-the-website-github-pages)). Students never download the suite. Adding a
task means adding its `.test.js` to `tests/`, adding one line to `tests/manifest.js`, and pushing.
Everything runs in the student's browser; their file never leaves their machine.

## How students use it
1. Write your solution in a single `.js` file (e.g. `lesson2.js`) as a **named function**:
   ```js
   function isLeapYear(year) { ... }
   ```
2. Open the tester link from D2L. If the link was for a specific task, it is already chosen;
   otherwise pick the task from the **Task** dropdown.
3. Choose **your `.js`** file — or drag it onto the page.
4. Click **Run Tests**. Green = pass, red = fail with the expected-vs-got message.
   Fix, save, click Run again — it re-reads your file every run. (In Chrome/Edge this Just
   Works via a live file handle; in other browsers, if it says a file "changed on disk,"
   re-pick the file and run again.)

> Students hand in just their `.js` file (D2L). One function per task, no extra boilerplate.

**Opened from a folder instead of the website?** The dropdown can't load (browsers won't let a
page read files beside it), so the page shows a *task file* picker instead: choose the task's
`.test.js` yourself, exactly as before. That is also how you try a new test before publishing it.

## Publishing the website (GitHub Pages)

**One-time setup**
1. On github.com, create a new **public** repository (e.g. `js-mini-tasks`). Leave it empty —
   no README, no .gitignore.
2. In this folder:
   ```bash
   git init
   git add .
   git commit -m "Mini task tester"
   git branch -M main
   git remote add origin https://github.com/<you>/js-mini-tasks.git
   git push -u origin main
   ```
   (`examples/` is skipped automatically — `.gitignore` lists it.)
3. On the repo page: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch `main`, folder `/ (root)`, Save. A minute later the site is at
   `https://<you>.github.io/js-mini-tasks/` — put that link on D2L.
4. Check the link from a **student** device on the school network once. School filters
   sometimes block `github.io` even when they allow `github.com`.

**Adding or changing a task** — edit or add the `.test.js`, add its line to `tests/manifest.js`
if it's new, then:
```bash
git add .
git commit -m "Add lesson 6 task"
git push
```
The site updates within a couple of minutes. (You can also edit files straight on github.com —
the pencil icon — which is handy at school.)

**Linking straight to one task** — on the website, choose the task in the dropdown, then copy the
address bar: it reads `.../runner.html?task=Lesson+2a:+Buy+a+Farm`. Put that link in the
lesson and the tester opens with that task already chosen. The match is forgiving: any unique
start of the name works, e.g. `?task=Lesson+2a`.

**Trying the website before pushing** — a page opened from a folder can't load the task list, so
serve the folder instead. Either of these, run in this folder, then open the address it prints:
```bash
python -m http.server 8000      # → http://localhost:8000/
npx serve .
```

**What is public:** everything in this folder except `examples/` — including this README and
every `.test.js`. Test files are handouts anyway; keep solutions out of `tests/`.

## How you use it (Node — single + batch)
```bash
# one student, one task
node test.js path/to/student.js tests/leap_year.test.js

# a whole folder of submissions against one task  → a score table
node test.js --batch path/to/submissions tests/leap_year.test.js
```
Batch output looks like:
```
alice.js   9/9  (100%)
bob.js     7/9  (78%)
carol.js   1/9  (11%)
```
Tip: name a task's submissions folder per task, drop everyone's `.js` in, run `--batch`.

### Multi-task files (Conditionals, Loops, Dragon) in Node
Those three test files bundle several sub-tasks; in the browser the dropdown picks one.
In Node, the runner **auto-detects**: it runs whichever sub-tasks the student's file actually
defines (a file defining only `sumTo` is graded only on the sumTo tests). To force one
sub-task — e.g. batch-marking a specific assignment — set the `TASK` environment variable
to the function name:
```powershell
$env:TASK = "sumTo"; node test.js --batch subs tests/loops.test.js
```
```bash
TASK=sumTo node test.js --batch subs tests/loops.test.js   # bash equivalent
```
`TASK=all` runs every sub-task in the file. (Remember `Remove-Item Env:TASK` /
`$env:TASK = $null` afterward, or it will silently constrain the next run.)

## How to write a new task
Copy an existing file in `tests/` and change three things: the description comment, the
function name, and the test cases. The pattern:

```js
/* Task: <name> — write function myFunc(...) that returns ... */
function runTests(runner) {
  // Test 1: it exists (always start here — gives a clear message if missing)
  runner.runTest("myFunc exists", function () {
    return typeof runner.getFn("myFunc") === "function"
      ? [true, "Found myFunc"] : [false, "Define it as: function myFunc(...) { ... }"];
  });
  if (typeof runner.getFn("myFunc") !== "function") return;

  // The easy way to assert a return value (handles numbers, strings, arrays, objects):
  runner.runTest("does the thing", function () { return runner.checkReturns("myFunc", [input], expected); });

  // A custom check, when you need one — return [passed, message]:
  runner.runTest("custom", function () {
    var got = runner.getFn("myFunc")(42);
    return got > 0 ? [true, "positive"] : [false, "expected a positive number, got " + JSON.stringify(got)];
  });
}

// Leave this footer exactly as-is — it makes the file work in BOTH Node and the browser:
if (typeof module !== "undefined" && module.exports) { module.exports = { runTests: runTests }; }
else if (typeof registerTask === "function") { registerTask("My Task", runTests); }
```
Then add one line for the file to `tests/manifest.js` and push — the website's dropdown picks it
up. (A file can register several parts — see `conditionals.test.js` — and each part becomes its
own dropdown entry under the file's `group` heading.) `node test.js` takes the file by path and
doesn't use the manifest.

To try a test before publishing it: open the tester (locally or on the site), expand
*"Have a task file that isn't in the list?"*, and choose your `.test.js`. The dropdown switches
to that file's parts, and the file is re-read on every Run while you edit it.

### Console output capture (for tasks that test print/log behavior)

The harness now supports capturing `console.log()` output, just like the Python suite captures `print()`:

```js
runner.runTest("function prints the right thing", function () {
  var fn = runner.getFn("printMultiplesOf3");
  var [logs, result] = runner.captureConsole(fn, [5]);
  // logs is an array of lines, each line is what was console.log'd
  // result is the function's return value
  return logs.length === 5 ? [true, "Printed 5 lines"] : [false, "Got " + logs.length];
});
```

Available methods:
- `runner.captureConsole(fn, args)` → returns `[logs, result]`
- `runner.getConsoleLogs()` → get current logs (resets after each `runTest()`)
- `runner.resetConsole()` → clear the log buffer
- Console capture is **automatic**: `runTest()` resets logs before each test, so no cleanup needed

### Tasks with no parameters or return value (early lessons)

Before students have met parameters and `return`, a task can still be tested the way their game
works: `var`s at the top of the file, and a function with empty `()` that changes them. The test
**sets** the variables, **calls** the function, and **reads** the variables back.
`clicker_unit1.test.js` does this for Clicker Lessons 1-5; copy its `mt_*` helpers
(`mt_scenario` does set / call / compare in one line, with a hook for mistake-specific hints; it also
takes argument lists such as `[[5], [10]]`, and `mt_returns` checks a return value the same way).

The student's `var`s live on their file's global object, and any function they wrote can reach it,
with no change to the harness. This works in Node and in `runner.html`:

```js
var g = runner.getFn("buyFarm").constructor("return this")();
g.coins = 25;               // set up
runner.getFn("buyFarm")();  // call
g.coins                     // -> 15
```

Limits worth telling students:
- The tester **cannot see `let` or `const` variables**, so anything that changes must be `var`.
  (A `const` the function only *reads*, like a fixed price increase, works fine.)
- There is **no page**: `document.getElementById` in a mini task file crashes (in Node,
  `document is not defined`; in the browser, `Cannot set properties of null`).
- `test.js`'s sandbox has no `setInterval`, so a tick-style task should have the test call
  `tick()` itself rather than the student starting a timer. (If a student's file starts one anyway,
  `runner.html` still passes it, but `test.js` stops with `setInterval is not defined`.)

### Design tips (same as the Python suite)
- **Start with "does it exist"** so a missing/misnamed function gives a friendly message.
- **Build from simple to edge cases**; always test boundaries (0, empty array, the `>=` vs `>` line).
- **Helpful messages**: `checkReturns` already prints `expected X but got Y`.
- **One anti-cheat check** is nice for value tasks (see `building_production.test.js` — a random
  input so students can't hard-code the example answer).
- **For console-output tasks**, test both the content AND the line count (see `loops.test.js`).

## Requirement for student code
The harness finds functions by name, so solutions must use a **top-level function declaration**
(`function isLeapYear(year) { ... }`), not an arrow assigned to `const`. This is exactly what
the lessons teach, so it's not an extra burden — just say it once.

## Starter tasks included

**Classic "programming for accountants" exercises with tiered difficulty:**

- `conditionals` — **Easy/Medium/Hard** three tasks on if/else:
  - Easy: Pass/fail classifier (grade ≥ 70)
  - Medium: Voter eligibility (age ≥ 18)
  - Hard: Number sign classifier (positive/negative/zero)
- `loops` — **Easy/Medium/Hard** three tasks on loops:
  - Easy: Print first N multiples of 3
  - Medium: Sum integers from 1 to N
  - Hard: Print a multiplication table (1×N through 12×N)

**Older tasks:**
- `leap_year` — decisions, modulo (mirrors the Python one for easy comparison)
- `fizzbuzz` — decisions, modulo, returning strings
- `letter_grade` — `if/else if`, boundary conditions (`>=` vs `>`)
- `building_production` — **arrays of objects (JSON) + loops** — a direct warm-up for the clicker game
- `clicker_unit1` — one or two tiny parts per Clicker lesson (L1-L5 so far), each using only what that lesson has taught; the early parts use the no-parameter technique above
