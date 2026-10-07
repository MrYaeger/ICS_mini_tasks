/*
 * catalog.js - the website's list of tasks. Shared by runner.html (students) and
 * teacher/admin.html (the teacher's page for choosing which tasks students see,
 * which runs on the teacher's computer only).
 *
 *   tests/manifest.js   which task files exist, in order, and the section ("group") each is in
 *   tests/enabled.json  which tasks students can see - written by teacher/admin.html
 *
 * A task is identified by its file and its name, e.g. "clicker_unit1.test.js" +
 * "Lesson 1a: Say Hello". Renaming a task in its test file hides it again until
 * it's ticked again in the settings page, and starts students' ticks for it afresh.
 */
(function () {
  "use strict";

  var SETTINGS_FILE = "tests/enabled.json";

  // A hidden iframe gives code a JavaScript global of its own, so a task file can't
  // clash with this page, with another task file, or with a student's file.
  function newFrame() {
    var frame = document.createElement("iframe");
    frame.style.display = "none";
    frame.setAttribute("aria-hidden", "true");
    document.body.appendChild(frame);
    return frame;
  }

  // Run a task file's code in a frame of its own and collect the parts it registers.
  // Returns { frame, win, tasks: [{ name, fn }] }; throws with a readable message.
  function loadTestCode(code) {
    var frame = newFrame();
    var win = frame.contentWindow;
    var tasks = [];
    win.console = window.console; // so the harness can capture what the tests print
    win.registerTask = function (name, fn) { tasks.push({ name: String(name), fn: fn }); };
    try {
      win.eval(code);
    } catch (e) {
      frame.remove();
      throw new Error("The task file could not run: " + e.message);
    }
    if (tasks.length === 0) {
      frame.remove();
      throw new Error("That task file didn't register any tasks - is it really a .test.js from the suite?");
    }
    return { frame: frame, win: win, tasks: tasks };
  }

  function partKey(file, name) { return file + "\n" + name; }

  // The parts one task file registers: [{ key, name, group, file, code }].
  function partsOf(file, group, code) {
    var loaded = loadTestCode(code);
    loaded.frame.remove(); // only the names are needed here; each run loads the file afresh
    return loaded.tasks.map(function (t) {
      return { key: partKey(file, t.name), name: t.name, group: group || "", file: file, code: code };
    });
  }

  // "clicker_unit1.test.js" -> "Clicker Unit1": the heading for a multi-part
  // file whose manifest line has no "group".
  function titleFromFile(file) {
    return file.replace(/\.test\.js$/, "").split(/[_\-\s]+/).map(function (w) {
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(" ");
  }

  // Load every file tests/manifest.js names. Resolves to
  // { parts: [...all parts, in manifest order], files: [...file names], problems: [...messages] }.
  function loadCatalog() {
    if (typeof TASK_FILES === "undefined" || !Array.isArray(TASK_FILES)) {
      return Promise.resolve({ parts: [], files: [], problems: ["tests/manifest.js is missing or broken"] });
    }
    var problems = [];
    return Promise.all(TASK_FILES.map(function (item) {
      return fetch("tests/" + item.file, { cache: "no-cache" })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.text();
        })
        .then(function (code) {
          var parts = partsOf(item.file, item.group, code);
          if (!item.group && parts.length > 1) {
            parts.forEach(function (p) { p.group = titleFromFile(item.file); });
          }
          return parts;
        })
        .catch(function (e) { problems.push(item.file + " (" + e.message + ")"); return []; });
    })).then(function (lists) {
      return {
        parts: [].concat.apply([], lists),
        files: TASK_FILES.map(function (item) { return item.file; }),
        problems: problems
      };
    });
  }

  // tests/enabled.json looks like
  //   { "enabled": { "clicker_unit1.test.js": ["Lesson 1a: Say Hello", ...], ... } }
  // Returns { enabled: Set of part keys, data: the parsed file }.
  function parseSettings(text) {
    var data = JSON.parse(text);
    var enabled = new Set();
    var map = data && data.enabled;
    if (map && typeof map === "object") {
      Object.keys(map).forEach(function (file) {
        (Array.isArray(map[file]) ? map[file] : []).forEach(function (name) {
          enabled.add(partKey(file, String(name)));
        });
      });
    }
    return { enabled: enabled, data: data };
  }

  // Resolves to { settings, problem }. settings is null when there's no settings
  // file - then every task is visible - or when it can't be read (with a problem).
  function loadSettings() {
    return fetch(SETTINGS_FILE, { cache: "no-cache" }).then(function (r) {
      if (r.status === 404) return { settings: null };
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text().then(function (text) { return { settings: parseSettings(text) }; });
    }).catch(function (e) {
      return { settings: null, problem: SETTINGS_FILE + " couldn't be read (" + e.message + ")" };
    });
  }

  // Can students see this part? Everything is visible when there's no settings file.
  function isOpen(settings, part) {
    return !settings || settings.enabled.has(part.key);
  }

  window.MiniTasks = {
    SETTINGS_FILE: SETTINGS_FILE,
    newFrame: newFrame,
    loadTestCode: loadTestCode,
    partKey: partKey,
    partsOf: partsOf,
    loadCatalog: loadCatalog,
    parseSettings: parseSettings,
    loadSettings: loadSettings,
    isOpen: isOpen
  };
})();
