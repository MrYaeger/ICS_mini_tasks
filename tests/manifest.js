// tests/manifest.js - the list of task files the tester website offers.
//
// runner.html reads this list, loads each file from tests/, and lists every part
// the file registers under the section ("group") given here.
//
//   To add a task file:  put its .test.js in tests/ and add one line here.
//   Order:               the order of the lines below.
//
// Which tasks students actually SEE is chosen separately, with the settings page
// on your computer (teacher/Choose Tasks.cmd), which saves tests/enabled.json.
// A newly added task stays hidden until you tick it there.
//
// Files that share a "group" share one section. Leave "group" out and the
// file's parts appear under "Other tasks" (a multi-part file then gets a
// section named after its file).
//
// Only runner.html and the settings page use this file; node test.js ignores it.
var TASK_FILES = [
  { file: "invaders_unit2.test.js",      group: "Invaders Game - Unit 2" },
  { file: "clicker_unit1.test.js",       group: "Clicker Game - Unit 1" },
  { file: "clicker_parts_bin.test.js",   group: "Clicker Game - Parts Bin" },
  { file: "dragon_unit1.test.js",        group: "Dragon Game - Unit 1" },
  { file: "first_programs.test.js",      group: "First Programs" },
  { file: "conditionals.test.js",        group: "Conditionals" },
  { file: "loops.test.js",               group: "Loops" },
  { file: "leap_year.test.js",           group: "Practice" },
  { file: "fizzbuzz.test.js",            group: "Practice" },
  { file: "letter_grade.test.js",        group: "Practice" },
  { file: "building_production.test.js", group: "Practice" }
];
