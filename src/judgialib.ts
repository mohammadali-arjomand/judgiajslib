import { exec, spawn } from 'child_process'
import { promisify } from 'util'
import os from 'os'

class Judgia {
    cppFilePath: string | null
    staticAnswer: string | null
    scriptAnswer: string | null
    stderr: string | null
    stdout: string | null
    trimedStdout: string | null
    testcase: string | null
    constructor () {
        this.cppFilePath = null
        this.staticAnswer = null
        this.scriptAnswer = null
        this.stderr = null
        this.stdout = null
        this.trimedStdout = null
        this.testcase = null
    }
    async compileAndGetStdout(): Promise<{stderr: string, stdout: string}> {
        const time = Date.now()
        const outputPath = os.homedir() + `/judgia-tmp-${time}.out`
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
                resolve({stderr: stderrData, stdout: stdoutData})
            })

            if (this.testcase) {
                child.stdin.write(this.testcase)
                child.stdin.end()
            }
        })        
    }
    checkAnswer(caseInensitive: boolean = true): boolean | null {
        var trimedOutput
        if (this.stdout) {
            const output = caseInensitive ? this.stdout?.toLocaleLowerCase() : this.stdout?.toString()
            trimedOutput = output?.replaceAll(/\s+/g, " ").trim()
            this.trimedStdout = trimedOutput
        }
        if (this.staticAnswer) {
            const answer = caseInensitive ? this.staticAnswer?.toLocaleLowerCase() : this.staticAnswer?.toString()
            const trimedAnswer = answer?.replaceAll(/\s+/g, " ").trim()
            return trimedAnswer === trimedOutput
        }
        return null
    }
}

export default Judgia