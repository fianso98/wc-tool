import { Command } from '@commander-js/extra-typings';
const fs = require('fs');

const program = new Command()
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
type ExecArray = Array<(data: any) => number>;
enum InputType  {
  STDIN,
  ARGS
}
if (!filePath) {
  perfomActionsBasedOnInputType(InputType.STDIN);
} else {
  perfomActionsBasedOnInputType(InputType.ARGS);
}

async function perfomActionsBasedOnInputType(inputType: InputType) {
  let executionPipe : ExecArray = []; 
  if(
    !options.c &&
    !options.l &&
    !options.w &&
    !options.m 
    ) {
      executionPipe = [countLines,countWords, getFileSize];
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
    } else {
      executionPipe.push(getFileSize);
    }
  }
  if (inputType === InputType.ARGS) {
    readFileAndExec(filePath, executionPipe);
  }

  if (inputType === InputType.STDIN) {
    const fileContent = await readStdin();
    console.log(...executionPipe.map((fn)=> fn(fileContent)));
  }

}

function readFileAndExec(filePath: string, execArray: ExecArray) : void{
  
    fs.readFile(filePath, 'utf-8', (err: any, data: any) => {
      if (err) {
        console.error("Error reading file", err);
      }
      Promise.all(execArray.map((fn) => fn(data)))
      .then((value) => console.log(...value, filePath));

    });
  
}
function getFileSize(data: any): number {
  return Buffer.from(data).length;
}

function countLines(data: any): number {  
  let lineCount = 0;
  for(let i = 0; i < data.length; i++) {
    if(data[i] === '\n') {
      lineCount ++;
    }
  }
  return lineCount; 
}

function countWords(data: any) : number { 
    return data ? data.match(/\S+/g).length : 0;
}

function countCharacters(data: any) : number {  
  let characterCount = 0;
  for (let i=0; i< data.length; i++) {
    characterCount += data[i].length;
  }
  return characterCount;
}

function readStdin(): Promise<string> {
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