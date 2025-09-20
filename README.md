# JudgiaJsLib
**Judgia core for judging codes in competitions**

## Installation
Install JudgiaJsLib with npm or yarn easily
```bash
npm install judgiajslib
# or
yarn add judgiajslib
```

## Documentations
First of all, we instantiate an object from `Judgia` class

```ts
import Judgia from 'judgiajslib'

const judgia = new Judgia()
```

### Configuration Properties
Now you have these properties to config judge

Property       | Type             | Description
---------------|------------------|------------------------------------
`cppFilePath`  | `string \| null` | Path of C++ file you want to judge
`staticAnswer` | `string \| null` | Static answer for judging
`scriptPath`   | `string \| null` | Python3 script for judging
`testcase`     | `string \| null` | Testcase which you want to give to C++ code

### Methods
And you alse have these methods

Method                | Arguements                 | Output                                      | Description
----------------------|----------------------------|---------------------------------------------|--------------------------------------------
`compileAndGetStdout` | _Nothing_                  | `Promise<{stderr: string, stdout: string}>` | Compiles C++ code and executes it. Should be runned after setting a `string` value for `cppFilePath`
`checkAnswer`         | `caseInensitive?: boolean` | `Promise<boolean \| null>`                  | Checks output with static answer. If `staticAnswer` is `null`, it would run judge script and use it. If both `staticAnswer` and `scriptPath` are `null` it's output would be `null`. Also running `compileAndGetStdout` before it is required. If you set `caseInensitive` arguement to `false` it would be sencetive to letters. but otherwise it wouldn't.

### Read-only Properties
And also read these properties

Property       | Type             | Description
---------------|------------------|------------------------------------
`stderr`       | `string \| null` | Contains standard output of C++ code. It's null before you run `compileAndGetStdout`
`stdout`       | `string \| null` | Contains standard error of C++ code. It's null before you run `compileAndGetStdout`
`trimedStdout` | `string \| null` | Contains whitespaceless standard output of C++ code. It's null before you run `checkAnswer`

## Examples
Here's some examples of usage

### With Static Answer
```ts
const judgia = new Judgia()

judgia.cppFilePath = "/path/to/file.cpp"
judgia.staticAnswer = "ANSWER HERE"
judgia.testcase = "TESTCASES FOR C++ CODE"

judgia.compileAndGetStdout().then(() => {
    judgia.checkAnswer().then(value => {
        console.log(value ? "yes" : "no")
    })
})
```

### With Judge Script
```ts
const judgia = new Judgia()

judgia.cppFilePath = "/path/to/file.cpp"
judgia.scriptPath = "/path/to/judge.py"
judgia.testcase = "TESTCASES FOR C++ CODE"

judgia.compileAndGetStdout().then(output => {
    judgia.checkAnswer().then(value => {
        console.log(value ? "yes" : "no");
    })
})
```
And `judge.py` is like this:
```py
import sys

def main():
    if len(sys.argv) < 2:
        return
    
    user_output = sys.argv[1].strip()

    testcase_line1 = input() # Get all testcases like in C++
    testcase_line2 = input()
    # ...

    # CHECKING IF OUTPUT IS CORRECT

    print("yes" if output_is_correct else "no")

if __name__ == "__main__":
    main()
```

# License
Copyright (c) 2025 MohammadAli Arjomand.
Licensed under [MIT License](LICENSE)