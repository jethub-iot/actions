'use strict'

const script = require.resolve('./dist/checkout.js')
const spawn = require('child_process').spawn
const fsp = require('fs').promises
const path = require('path')

async function main () {
  const items = JSON.parse(process.env.INPUT_REPOSITORIES || '[]').filter(Boolean)
  const workspace = path.resolve(process.env.GITHUB_WORKSPACE || '.')
  const basedir = path.resolve(workspace, process.env.INPUT_PATH || '.')
  const env = {}

  // Remove INPUT_REPOSITORIES, INPUT_PATH and others from env
  for (const k in process.env) {
    if (!/^INPUT_(REPOSITORIES|REPOSITORY|REF|PATH|PERSIST.CREDENTIALS)$/i.test(k)) {
      env[k] = process.env[k]
    }
  }

  for (const item of items) {


    const dir = path.join(basedir, item.path)
    const parent = path.dirname(dir)
    const gitignore = path.join(parent, '.gitignore')

    await fsp.mkdir(parent, { recursive: true })
    await fsp.appendFile(gitignore, '\n' + item.path)

    await exec(process.execPath, [script], {
      env: {
        ...env,
        INPUT_REPOSITORY: item.repo,
        INPUT_REF: item.ref || '',
        'INPUT_FETCH-DEPTH': item?.depth ?? '1',
        INPUT_PATH: dir,
        INPUT_SUBMODULES: item?.submodules ?? 'true',
        'INPUT_PERSIST-CREDENTIALS': 'false',

        // Circumvent actions/checkout restriction that
        // INPUT_PATH must be under workspace
        GITHUB_WORKSPACE: path.dirname(workspace),

        // Unset variables that might be used as defaults
        GITHUB_REPOSITORY: '',
        GITHUB_SHA: '',
        GITHUB_REF: '',
        GITHUB_HEAD_REF: '',
        GITHUB_BASE_REF: ''
      },
      stdio: ['ignore', 1, 1]
    })
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

async function exec (command, args, options) {
  return new Promise(function (resolve, reject) {
    const cp = spawn(command, args, options)

    cp.on('error', reject)
    cp.on('close', function (code) {
      if (code !== 0) {
        reject(new Error(`Child process exited with code ${code}`))
      } else {
        resolve()
      }
    })
  })
}
