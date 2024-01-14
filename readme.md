# ccwc - Coding Challenges Word Count Tool
### Overview
<p>
ccwc is a simple command-line tool written in TypeScript that mimics the behavior of the Unix wc command. It counts the number of lines, words, and characters in a given text input, either from files or through streams.
<p>

### Features
<ul>
<li>
<b>Word Counting:</b> Counts the number of words in the input.
</li>
<li>
<b>Line Counting:</b> Counts the number of lines in the input.
</li>
<li>
<b>Character Counting:</b> Counts the number of characters in the input.
</li>


</ul>

### Installation

<p>Ensure that you have Node.js and npm installed on your machine.</p>
<ol>
<li>Clone this repository:</li>

```bash
git clone https://github.com/fianso98/wc-tool
```
<li>Navigate to the project directory:</li>

```bash
cd ccwc
```
<li>Install dependencies:</li>

```bash
npm install
```
<li>run default</li>

```
npm run start
```
<li>Make the script executable</li>

```
npm i -g pkg
```

than go and modify package.json "executable" script to suits your device than run 

```
npm run exectuable
```
</ol>

### Usage 
-c outputs the number of bytes in a file

> ccwc -c test.txt 
>
> **output >** 342190 test.txt

-l outputs the number of lines in a file.

> ccwc -l test.txt
>
> **output >**  7145 test.txt

-w outputs the number of words in a file.

> ccwc -w test.txt
>
> **output >** 58164 test.txt

-m outputs the number of characters in a file.
> ccwc -m test.txt
>
> **output >** 339292 test.txt

no options are provided, which is the equivalent to the -c, -l and -w options

> ccwc test.txt
>
> **output >** 7145   58164  342190 test.txt

support being able to read from standard input if no filename is specified

> cat test.txt | ccwc -l
>
> **output >** 7145

### Feedback

<p>
Feel free to open issues or submit pull requests if you have suggestions or improvements for ccwc. Your feedback is valuable!
</p>

### Note on Executable Command

If you want to adjust the executable command in the package.json file to suit your machine, you can change it like this:


Copy code

```{r, engine='json'}
"executable": "tsc && pkg dist/main.js --targets node18-macos-x64 --output ccwc"
```

Modify the --targets flag according to your Node.js version and operating system. For instance, if you are using Node.js version 14 on Windows, you might use --targets node14-win-x64. Adjust the --output flag if you want to change the output executable name. Make sure to refer to the pkg documentation for more details on available options.