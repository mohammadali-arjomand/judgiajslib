import { exec, spawn } from 'child_process'
import { promisify } from 'util'
import os from 'os'

class Judgia {
    cppFilePath: string | null
    staticAnswer: string | null
    scriptPath: string | null
    stderr: string | null
    stdout: string | null
    trimedStdout: string | null
    testcase: string | null
    constructor () {
        this.cppFilePath = null
        this.staticAnswer = null
        this.scriptPath = null
        this.stderr = null
        this.stdout = null
        this.trimedStdout = null
        this.testcase = null
    }
    async compileAndGetStdout(): Promise<{stderr: string, stdout: string}> {
        const time = Date.now()
        const outputPath = os.homedir() + `/.judgia-tmp-${time}.out`
        const execAsync = promisify(exec)
        await execAsync(`g++ ${this.cppFilePath} -o ${outputPath}`)
        return new Promise((resolve, rejects) => {
            const child = spawn(outputPath)

            var stdoutData = ""
            var stderrData = ""

            child.stdout.on("data", (chunk) => {
                stdoutData += chunk.toString()
            })

            child.stderr.on("data", (chunk) => {
                stderrData += chunk.toString()
            })

            child.on("close", () => {
                this.stdout = stdoutData
                this.stderr = stderrData
                execAsync(`rm ${outputPath}`)
                resolve({stderr: stderrData, stdout: stdoutData})
            })

            if (this.testcase) {
                child.stdin.write(this.testcase)
                child.stdin.end()
            }
        })
    }
    clearWhitespaces(str: string): string {
        return str.replaceAll(/\s+/g, " ").trim()
    }
    async checkAnswer(caseInensitive: boolean = true): Promise<boolean | null> {
        var trimedOutput : string = ""
        if (this.stdout) {
            const output = caseInensitive ? this.stdout?.toLocaleLowerCase() : this.stdout?.toString()
            trimedOutput = this.clearWhitespaces(output)
            this.trimedStdout = trimedOutput
        }
        if (this.staticAnswer) {
            const answer = caseInensitive ? this.staticAnswer?.toLocaleLowerCase() : this.staticAnswer?.toString()
            const trimedAnswer = this.clearWhitespaces(answer)
            return trimedAnswer === trimedOutput
        }
        else if (this.scriptPath) {
            return new Promise((resolve, rejects) => {
                const child = spawn("python3", [this.scriptPath || "", trimedOutput || ""])

                var stdoutData = ""
                var stderrData = ""

                child.stdout.on("data", (chunk) => {
                    stdoutData += chunk.toString()
                })

                child.stderr.on("data", (chunk) => {
                    stderrData += chunk.toString()
                })

                child.on("close", () => {
                    resolve(this.clearWhitespaces(stdoutData).toLocaleLowerCase() === "yes")
                })

                if (this.testcase) {
                    child.stdin.write(this.testcase)
                    child.stdin.end()
                }
            })        
        }
        return null
    }
}

export default Judgia