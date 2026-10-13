# JavaScript Mini Task Suite

**October 7 additions:** `invaders_unit2.test.js` now has all 40 parts, **Invaders 0a** to
**Invaders 9d**, for Invaders Lessons 0-9. Parts 3a-5d practise decisions, geometry, random numbers
and timers; 6a-9d practise objects, lists and loops. 7a (*Count to Ten*) is a whole-program task, so
it uses `runner.output()` and `runner.checkOutput()`. The new parts start hidden, like any new
task: tick them in the settings page as each lesson opens. Sample solutions for every lesson are in
`examples/invaders_unit2/`. `node scripts/verify_invaders_lessons.cjs` checks them, 48 alternative
correct solutions and 144 planted mistakes, both ways. In Node, 7a is auto-detected from the rest of
a lesson 7 file (or a file that prints a run of numbers); `TASK=countToTen` forces it.

**October 6 tester changes:**
- **You choose which tasks students see.** Double-click `teacher/Choose Tasks.cmd`, tick tasks or
  whole sections, and click Publish. See [Choosing which tasks students see](#choosing-which-tasks-students-see).
  New tasks start hidden, and `tests/enabled.json` starts empty, so **students see no tasks until
  you publish some**.
- **Students pick a section, then a task**, from a list that ticks off what they've passed in that
  browser.
- **More kinds of tasks.** A test can check what a whole file prints (a lone
  `console.log("Hello World");` is testable), answer `prompt()`, and read and change `let` and
  `const` variables. See [Whole-program tasks](#whole-program-tasks-printing-let-and-const-prompt).
  `tests/first_programs.test.js` has three examples (hidden until you tick them).
- `let` now works wherever the lessons say `var`. A `const` that a test needs to change gets its
  own message: "coins was made with const, so it can't be changed".

**October 6 additions:** a new task file, `invaders_unit2.test.js`, holds the mini tasks for
Invaders Lessons 0–2: twelve parts (**Invaders 0a**–**Invaders 2d**), four per lesson. Unlike the
clicker tasks, they're ordinary practice exercises (variables, printing, parameters and return,
math, decisions), not pieces of the game. It's listed first in `tests/manifest.js` under
*Invaders Game - Unit 2*. Sample solutions are in `examples/invaders_unit2/`, and
`node scripts/verify_invaders_lessons.cjs` (from the course workspace) checks them, other correct
solutions and 63 planted mistakes, both the way `test.js` loads a file and the way `runner.html`
does. Note for batch marking: with no `TASK` set, a part whose function is misspelled is skipped
rather than failed, so use `TASK=all` (or the part's function name) when marking one part.

**September 29 additions:** `clicker_parts_bin.test.js` now has nine parts. New:
**Abilities A: Activate Boost** (`activateBoost`), **Abilities B: Advance Timers**
(`advanceAbility(seconds)`), **Population A: Recruit** (`recruit`), **Population B: Change Job**
(`changeJob(job, amount)`), **Messages A: Show Message** (`showMessage(text)`), and
**Messages B: Fade Message** (`fadeMessage(seconds)`). **Upgrades A** now expects a boolean,
`var toolsPurchased = false;`, to match the reworked card. A file written for the Sept 24 version
(`var toolsUpgrade = "available"`, and no `toolsPurchased`) is recognised and still marked against
the rules it was written for. The verify script covers all five cards and all nine parts.

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
| `runner.html` | **students** | The tester page: students pick a section and a task, pick their `.js`, click Run. |
| `catalog.js` | website | Loads the task list and the visibility settings for `runner.html` and the settings page. |
| `index.html` | website | Just forwards the site's short address to `runner.html`. Never edit. |
| `tests/*.test.js` | shared | One file per task: the description (top comment) + the tests. |
| `tests/manifest.js` | **teacher** | **The list of task files**, and the section each one is in. One line per file. |
| `tests/enabled.json` | **teacher** | **Which tasks students see.** Written by the settings page, so you don't edit it. |
| `test.js` | **teacher** | Node command-line runner, with a batch mode. |
| `teacher/` | **teacher** | The settings page for choosing what students see (`Choose Tasks.cmd`). Runs on your computer only. **Not published.** |
| `examples/` | teacher | Sample correct/buggy solutions + a `submissions_demo/` folder for batch. **Not published** (see `.gitignore`). |
| `.gitignore`, `.nojekyll` | website | Keep `examples/` and `teacher/` out of the public repo; tell GitHub Pages to serve the files as-is. |

**Distribution model:** this folder *is* the website (hosted on GitHub Pages — see
[Publishing](#publishing-the-website-github-pages)). Students never download the suite. Adding a
task means adding its `.test.js` to `tests/`, adding one line to `tests/manifest.js`, pushing,
and then ticking it in the settings page when students should see it.
Everything runs in the student's browser; their file never leaves their machine.

## How students use it
1. Write your solution in a single `.js` file (e.g. `lesson2.js`). Most tasks want a
   **named function**:
   ```js
   function isLeapYear(year) { ... }
   ```
   A whole-program task (like *Hello World*) just wants the program itself.
2. Open the tester link from D2L. If the link was for a specific task, it is already chosen.
   Otherwise choose a **Section** (e.g. *Clicker Game - Unit 1*), then click the task.
3. Choose **your `.js`** file — or drag it onto the page.
4. Click **Run Tests**. Green = pass, red = fail with the expected-vs-got message. Anything the
   file printed shows below the results.
   Fix, save, click Run again — it re-reads your file every run. (In Chrome/Edge this Just
   Works via a live file handle; in other browsers, if it says a file "changed on disk,"
   re-pick the file and run again.)

**Ticks.** A task gets a green tick once every test has passed, and a score such as *3/5* after an
attempt that didn't pass every test. Each section shows how many tasks are done. The ticks are
stored in that browser on that computer only (`localStorage`): another computer, a private window,
or clearing browsing data starts from nothing. They're for students to keep track of their own
work, not proof of completion, because a student can edit their own browser's storage.

> Students hand in just their `.js` file (D2L). One function per task, no extra boilerplate.

**Opened from a folder instead of the website?** The task list can't load (browsers won't let a
page read files beside it). Open **Teacher tools** at the bottom and choose the task's `.test.js`
yourself. That is also how you try a new test before publishing it.

## Choosing which tasks students see

Students only see the tasks you've ticked. Everything else is hidden, including new task files
when you add them, so you can add tasks ahead of time and open them as the course goes on.

1. Double-click **`teacher/Choose Tasks.cmd`** (in this folder). A black window opens, and the
   settings page opens in your browser.
2. Tick tasks, or tick a section's box to show or hide the whole section. Changed tasks are
   highlighted until you publish. The **try** link opens a task in the tester, even a hidden one.
3. Click **Publish**. This saves `tests/enabled.json`, commits that one file, and pushes it with
   the same git sign-in VS Code uses. The website shows the change within a minute or two.
4. Close the black window when you're done.

Notes:
- **It's local only.** The page is served from your computer at `http://127.0.0.1:…`, and nothing
  else can reach it. `teacher/` is in `.gitignore`, so there is no settings page on the website.
  That also means `teacher/` isn't backed up on GitHub, so keep it with your own files.
- **Publish commits only `tests/enabled.json`.** Other files you're editing are left alone. But
  the push also sends any *earlier* commits you've made and not pushed yet.
- **"GitHub has changes this computer doesn't have yet"** means something was changed on github.com.
  Click **Sync Changes** in VS Code's Source Control panel, then click Publish again. Your ticks are
  already saved.
- **Save only** writes the file without pushing it, so it can go out with your next commit.
- **Seeing hidden tasks yourself:** `runner.html?preview` (or *Teacher tools → See every task*)
  lists every task, with the hidden ones marked. A link to a hidden task, like
  `runner.html?task=Lesson+4+bonus`, tells students it "isn't open yet."
- **No settings file** (`tests/enabled.json` deleted) means every task is visible again.
- Renaming a task in its `.test.js` hides it again until you re-tick it, and students' ticks for it
  start over. The settings file stores tasks by file and name:
  ```json
  { "enabled": { "clicker_unit1.test.js": ["Lesson 1a: Say Hello", "Lesson 1b: Count Clicks"] } }
  ```

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
The site updates within a couple of minutes. A new task stays hidden until you tick it in the
settings page. (You can also edit files straight on github.com — the pencil icon — which is
handy at school. Click Sync Changes in VS Code afterwards, before your next push or Publish.)

**Linking straight to one task** — on the website, click the task, then copy the address bar: it
reads `.../runner.html?task=Lesson+2a:+Buy+a+Farm`. Put that link in the lesson and the tester
opens with that task already chosen. The match is forgiving: any unique start of the name works,
e.g. `?task=Lesson+2a`.

**Trying the website before pushing** — the settings page's black window also serves the whole
site, so with it open, `http://127.0.0.1:8765/runner.html` is the tester with your local files
(the address it prints may end in 8766 or higher if 8765 is busy). Or serve the folder yourself:
```bash
python -m http.server 8000      # → http://localhost:8000/
```

**What is public:** everything in this folder except `examples/` and `teacher/` — including this
README, every `.test.js`, and `tests/enabled.json`. Test files are handouts anyway; keep solutions
out of `tests/`.

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
Then add one line for the file to `tests/manifest.js`, push, and tick it in the settings page.
(A file can register several parts — see `conditionals.test.js` — and each part becomes its own
task in the list, in the file's `group` section.) `node test.js` takes the file by path and
doesn't use the manifest.

To try a test before publishing it: open the tester (locally or on the site), expand
**Teacher tools**, and choose your `.test.js`. The list switches to that file's parts, and the
file is re-read on every Run while you edit it.

### Whole-program tasks: printing, let and const, prompt

The tester runs the student's whole file before the tests start, the same way a web page runs a
script. So a test isn't limited to calling functions:

| In a test | What it gives |
|-----------|---------------|
| `runner.output()` | Every line the file printed while it ran (`console.log`, and `alert`), as an array of strings. |
| `runner.checkOutput(expected)` | `[passed, message]`: did the file print exactly these lines? `expected` is an array of lines or one string. Trailing spaces don't count. The message points at the first line that differs, with a hint (capitals, spaces, punctuation, `undefined`, `NaN`). `runner.checkOutput(expected, lines)` checks other lines instead, e.g. the logs from `captureConsole`. |
| `runner.run({ inputs: ["Sam"] })` | Runs the file again from the start, with `prompt()` answering from the list. Returns `{ output, prompts, error, get(name) }`. |
| `runner.globals()` | The file's top-level variables, `let` included: `g.coins = 25` sets one, `g.coins` reads it. Setting a `const` fails with "coins was made with const, so it can't be changed." |
| `runner.declaredWith(name)` | `"var"` (function declarations too), `"let"`, `"const"`, `"class"`, or `null`. |
| `runner.source()` | The student's code as text, for checks such as "joins the variable with +". |
| `runner.getFn(name)` | Now finds `let`/`const` names too, so `const add = (a, b) => a + b;` is found. |

The smallest whole-program test:
```js
function runTests(runner) {
  runner.runTest("prints Hello World", function () { return runner.checkOutput(["Hello World"]); });
}
```
`tests/first_programs.test.js` has three worked examples: *Hello World* (exact output, and a hint
when the `console.log` is stuck inside a function nobody calls), *About Me* (`const` and `let`,
printing them, and not typing the values in), and *Ask a Question* (`prompt()`, run twice with
different answers to catch a hard-coded name). In `runner.html`, `alert()`, `prompt()` and
`confirm()` never open a box: `alert` text counts as printed output, and `prompt` answers `null`
unless a test supplies inputs.

What still can't be tested: a file that never finishes (a loop that never ends) freezes the
browser tab, because the student's code runs on the page itself. `test.js` stops such a file
after 3 seconds.

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

`runner.globals()` reaches the student's top-level variables, in Node and in `runner.html`:

```js
var g = runner.globals();
g.coins = 25;               // set up
runner.getFn("buyFarm")();  // call
g.coins                     // -> 15
```
(The `mt_globals` helper in the clicker and invaders test files does this, and falls back to the
older `getFn(name).constructor("return this")()` trick, which only reaches `var`s.)

Limits worth telling students:
- Anything the tester changes must be `var` or `let`, not `const`: a `const` can never change.
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
The harness finds functions and variables by name, so they must be at the **top level** of the
file, not inside another function. A function declaration (`function isLeapYear(year) { ... }`)
is what the lessons teach; an arrow function assigned to `let` or `const` is found too.

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
- `first_programs` — whole-program examples: Hello World, About Me (`const` and `let`), Ask a Question (`prompt()`)
