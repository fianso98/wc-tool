"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const extra_typings_1 = require("@commander-js/extra-typings");
const fs = require('fs');
const program = new extra_typings_1.Command()
    .version('1.0.0')
    .description('The wc utility displays the number of lines, words, and bytes contained in each input file, or standard input (if no file is specified) to the standard output.  A line is defined as a string of characters delimited by a ⟨newline⟩ character.  Characters beyond the final ⟨newline⟩ character will not be included in the line count.')
    // .argument('<string>', 'file')
    .option('-c', 'The number of bytes in each input file is written to the standard output.')
    .option('-l', 'The number of lines in each input file is written to the standard output.')
    .option('-w', 'The number of words in each input file is written to the standard output.')
    .option('-m', 'The number of characters in each input file is written to the standard output.');
program.parse();
const options = program.opts();
const filePath = program.args[0];
var InputType;
(function (InputType) {
    InputType[InputType["STDIN"] = 0] = "STDIN";
    InputType[InputType["ARGS"] = 1] = "ARGS";
})(InputType || (InputType = {}));
if (!filePath) {
    perfomActionsBasedOnInputType(InputType.STDIN);
}
else {
    perfomActionsBasedOnInputType(InputType.ARGS);
}
function perfomActionsBasedOnInputType(inputType) {
    return __awaiter(this, void 0, void 0, function* () {
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
        if (inputType === InputType.ARGS) {
            readFileAndExec(filePath, executionPipe);
        }
        if (inputType === InputType.STDIN) {
            const fileContent = yield readStdin();
            console.log(...executionPipe.map((fn) => fn(fileContent)));
        }
    });
}
function perfomActionsBasedOnStdin() {
    readStdin().then((data) => {
        try {
            if (!options.c &&
                !options.l &&
                !options.w &&
                !options.m) {
                console.log(countLines(data), countWords(data), getFileSize(data));
            }
            if (options.c) {
                console.log(getFileSize(data));
            }
            if (options.l) {
                console.log(countLines(data));
            }
            if (options.w) {
                console.log(countWords(data));
            }
            if (options.m) {
                const currentLocale = process.env.LANG || process.env.LANGUAGE;
                if (currentLocale && currentLocale.includes("UTF-8")) {
                    console.log(countCharacters(data));
                }
                else {
                    console.log(getFileSize(data));
                }
            }
            // Perform operations with data
        }
        catch (error) {
            console.error('Error parsing input:', error.message);
        }
    });
}
function performActionsBasedOnArgs() {
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
}
function readFileAndExec(filePath, execArray) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error("Error reading file", err);
        }
        Promise.all(execArray.map((fn) => fn(data)))
            .then((value) => console.log(...value, filePath));
    });
}
function getFileSize(data) {
    return Buffer.from(data).length;
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
function readStdin() {
    return new Promise((resolve) => {
        process.stdin.setEncoding('utf8');
        let inputData = '';
        process.stdin.on('readable', () => {
            const chunk = process.stdin.read();
            if (chunk !== null) {
                inputData += chunk;
            }
        });
        process.stdin.on('end', () => {
            resolve(inputData);
        });
    });
}
