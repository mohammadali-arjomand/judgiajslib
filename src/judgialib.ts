import {exec} from 'child_process'
import { promisify } from 'util'

class Judgia {
    cppFilePath: string | null
    staticAnswer: string | null
    scriptAnswer: string | null
    stderr: string | null
    stdout: string | null
    constructor () {
        this.cppFilePath = null
        this.staticAnswer = null
        this.scriptAnswer = null
        this.stderr = null
        this.stdout = null
    }
    async compileAndGetStdout(): Promise<{stderr: string, stdout: string}> {
        const time = Date.now()
        const outputPath = `~/judgia-tmp-${time}.out`
        const execAsync = promisify(exec)
        const { stderr, stdout } = await execAsync(`g++ ${this.cppFilePath} -o ${outputPath} && ${outputPath} && rm ${outputPath}`)
        this.stdout = stdout
        this.stderr = stderr
        return {stderr, stdout}
    }
    checkAnswer(caseInensitive: boolean = true): boolean | null {
        if (this.staticAnswer) {
            const output = caseInensitive ? this.stdout?.toLocaleLowerCase() : this.stdout?.toString()
            const trimedOutput = output?.replaceAll(/\s+/g, " ").trim()
            const answer = caseInensitive ? this.staticAnswer?.toLocaleLowerCase() : this.staticAnswer?.toString()
            const trimedAnswer = answer?.replaceAll(/\s+/g, " ").trim()
            return trimedAnswer === trimedOutput
        }
        return null
    }
}

export default Judgia