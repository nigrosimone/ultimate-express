'use strict'

const { spawn } = require('child_process')

const cliSelect = require('cli-select')
const simpleGit = require('simple-git')

const git = simpleGit(process.cwd())

const COMMAND = 'npm run bench'
const DEFAULT_BRANCH = 'main'
const PERCENT_THRESHOLD = 5
const greyColor = '\x1b[30m'
const redColor = '\x1b[31m'
const greenColor = '\x1b[32m'
const resetColor = '\x1b[0m'

async function selectBranchName (message, branches) {
  console.log(message)
  const result = await cliSelect({
    type: 'list',
    name: 'branch',
    values: branches
  })
  console.log(result.value)
  return result.value
}

async function executeCommandOnBranch (command, branch) {
  console.log(`${greyColor}Checking out "${branch}"${resetColor}`)
  await git.checkout(branch)

  console.log(`${greyColor}Execute "${command}"${resetColor}`)
  const childProcess = spawn(command, { stdio: 'pipe', shell: true })

  let result = ''
  childProcess.stdout.on('data', (data) => {
    process.stdout.write(data.toString())
    result += data.toString()
  })

  await new Promise(resolve => childProcess.on('close', resolve))

  console.log()

  return parseBenchmarksStdout(result)
}

function parseBenchmarksStdout (text) {
  const results = []

  const lines = text.split('\n')
  for (const line of lines) {
    const match = /^(.+?)(\.*) x (.+) req\/sec.*$/.exec(line)
    if (match !== null) {
      results.push({
        name: match[1],
        alignedName: match[1] + match[2],
        result: parseInt(match[3].split(',').join(''))
      })
    }
  }

  return results
}

function compareResults(featureBranch, mainBranch) {
  const metrics = ["rps", "throughput", "latencyAvg", "latencyP95", "latencyP99"];

  for (const { name } of mainBranch) {
    const fb = featureBranch.find(result => result.name === name);
    const mb = mainBranch.find(result => result.name === name);

    if (fb && mb) {
      console.log(`\nBenchmark: ${name}`);
      for (const metric of metrics) {
        const fbVal = fb[metric];
        const mbVal = mb[metric];
        const percent = ((fbVal - mbVal) * 100) / mbVal;
        const rounded = Math.round(percent * 100) / 100;
        const percentString = rounded > 0 ? `+${rounded}%` : `${rounded}%`;

        let color = "";
        if (rounded > PERCENT_THRESHOLD) color = greenColor;
        else if (rounded < -PERCENT_THRESHOLD) color = redColor;

        console.log(`${color}${metric.padEnd(12)}: ${fbVal} vs ${mbVal} (${percentString})${resetColor}`);
      }
    }
  }
}


(async function () {
  const branches = await git.branch()
  const currentBranch = branches.branches[branches.current]

  

  let featureBranch = process.argv[2] ?? null
  let mainBranch = process.argv[3] ?? null

  if (featureBranch === 'current' && !mainBranch) {
    featureBranch = currentBranch.name
    mainBranch = DEFAULT_BRANCH
  }

  if (!featureBranch) {
    featureBranch = await selectBranchName('Select the branch you want to compare (feature branch):', branches.all)
  }
  if (!mainBranch) {
    mainBranch = await selectBranchName('Select the main branch to compare against:', branches.all.filter(b => b !== featureBranch))
  }

  try {
    debugger;
    const featureBranchResult = await executeCommandOnBranch(COMMAND, featureBranch)
    const mainBranchResult = await executeCommandOnBranch(COMMAND, mainBranch)
    compareResults(featureBranchResult, mainBranchResult)
  } catch (error) {
    console.error('Switch to origin branch due to an error', error.message)
  }

  await git.checkout(currentBranch.commit)
  await git.checkout(currentBranch.name)

  console.log(`${greyColor}Back to ${currentBranch.name} ${currentBranch.commit}${resetColor}`)
})()