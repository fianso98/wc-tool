"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extra_typings_1 = require("@commander-js/extra-typings");
const fs = require('fs');
const program = new extra_typings_1.Command()
    .version('1.0.0')
    .description('The wc utility displays the number of lines, words, and bytes contained in each input file, or standard input (if no file is specified) to the standard output.  A line is defined as a string of characters delimited by a ⟨newline⟩ character.  Characters beyond the final ⟨newline⟩ character will not be included in the line count.')
    .argument('<string>', 'file')
    .option('-c', 'The number of bytes in each input file is written to the standard output.')
    .option('-l', 'The number of lines in each input file is written to the standard output.')
    .option('-w', 'The number of words in each input file is written to the standard output.')
    .option('-m', 'The number of characters in each input file is written to the standard output.');
program.parse();
const options = program.opts();
const filePath = program.args[0];
let executionPipe = [];
if (!options.c &&
    !options.l &&
    !options.w &&
    !options.m) {
    executionPipe = [countLines, countWords, getFileSize];
}
if (options.c) {
    executionPipe.push(getFileSize);
}
if (options.l) {
    executionPipe.push(countLines);
}
if (options.w) {
    executionPipe.push(countWords);
}
if (options.m) {
    const currentLocale = process.env.LANG || process.env.LANGUAGE;
    if (currentLocale && currentLocale.includes("UTF-8")) {
        executionPipe.push(countCharacters);
    }
    else {
        executionPipe.push(getFileSize);
    }
}
readFileAndExec(filePath, executionPipe);
function readFileAndExec(filePath, execArray) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error("Error getting file number of words", err);
        }
        Promise.all(execArray.map((fn) => fn(data)))
            .then((value) => console.log(...value, filePath));
    });
}
function getFileSize(data) {
    return Buffer.from(data, 'utf-8').length;
}
function countLines(data) {
    let lineCount = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i] === '\n') {
            lineCount++;
        }
    }
    return lineCount;
}
function countWords(data) {
    return data ? data.match(/\S+/g).length : 0;
}
function countCharacters(data) {
    let characterCount = 0;
    for (let i = 0; i < data.length; i++) {
        characterCount += data[i].length;
    }
    return characterCount;
}
