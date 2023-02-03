/**

*/
import path from 'path'
import { format } from 'prettier'
import {
  cmdText,
  focusText,
  indentedCmd,
  linkText,
  logText,
  titleText,
} from '../../utils/theme'
import { logger } from '../../logger'
import fs from 'fs-extra'
import prompts from 'prompts'
import { Telemetry } from '@tinacms/metrics'
import { nextPostPage } from './setup-files'
import { extendNextScripts } from '../../utils/script-helpers'
import { configExamples } from './setup-files/config'
import { hasForestryConfig } from '../forestry-migrate/util'
import { generateCollections } from '../forestry-migrate'
import { spin } from '../../utils/spinner'
import { ErrorSingleton } from '../forestry-migrate/util/errorSingleton'

export interface Framework {
  name: 'next' | 'hugo' | 'jekyll' | 'other'
  reactive: boolean
}

export async function initStaticTina(ctx: any, next: () => void, options) {
  const baseDir = ctx.rootPath
  logger.level = 'info'

  // Choose your ClientID
  const clientId = await chooseClientId()

  let token: string | null = null
  // Choose your Read Only token
  if (clientId) {
    token = await chooseToken({ clientId })
  }

  // Choose package manager
  const packageManager = await choosePackageManager()

  // Choose framework
  const framework: Framework = await chooseFramework()

  // Choose typescript
  const usingTypescript = await chooseTypescript()

  // Choose public folder
  const publicFolder: string = await choosePublicFolder({ framework })

  // Detect forestry config
  const forestryPath = await hasForestryConfig({ rootPath: ctx.rootPath })

  let collections: string | null | undefined

  // If there is a forestry config, ask user to migrate it to tina collections
  if (forestryPath.exists) {
    collections = await forestryMigrate({
      forestryPath: forestryPath.path,
      rootPath: ctx.rootPath,
    })
  }

  // Report telemetry
  await reportTelemetry({
    usingTypescript,
    hasForestryConfig: forestryPath.exists,
    noTelemetry: options.noTelemetry,
  })

  // Check for package.json
  const hasPackageJSON = await fs.pathExistsSync('package.json')
  // if no package.json, init
  if (!hasPackageJSON) {
    await createPackageJSON()
  }

  // Check if .gitignore exists
  const hasGitignore = await fs.pathExistsSync('.gitignore')
  // if no .gitignore, create one
  if (!hasGitignore) {
    await createGitignore({ baseDir })
  } else {
    const hasNodeModulesIgnored = await checkGitignoreForNodeModules({
      baseDir,
    })
    if (!hasNodeModulesIgnored) {
      await addNodeModulesToGitignore({ baseDir })
    }
  }

  await addDependencies(packageManager)

  // add .tina/config.{js,ts}]
  await addConfigFile({
    publicFolder,
    baseDir,
    usingTypescript,
    framework,
    collections,
    token,
    clientId,
  })

  if (!forestryPath.exists) {
    // add /content/posts/hello-world.md
    await addContentFile({ baseDir })
  }

  if (framework.reactive) {
    await addReactiveFile[framework.name]({
      baseDir,
      framework,
      usingTypescript,
    })
  }

  logNextSteps({ packageManager, framework })
}

const chooseClientId = async () => {
  const option = await prompts({
    name: 'clientId',
    type: 'text',
    message: `What is your Tina Cloud Client ID? (Hit enter to skip and set up yourself later)\n${logText(
      "Don't have a Client ID? Create one here: "
    )}${linkText('https://app.tina.io/projects/new')}`,
  })
  return option['clientId'] as string
}

const chooseToken = async ({ clientId }: { clientId: string }) => {
  const option = await prompts({
    name: 'token',
    type: 'text',
    message: `What is your Tina Cloud Read Only Token?\n${logText(
      "Don't have a Read Only Token? Create one here: "
    )}${linkText(`https://app.tina.io/projects/${clientId}/tokens`)}`,
  })
  return option['token'] as string
}

const choosePackageManager = async () => {
  const option = await prompts({
    name: 'selection',
    type: 'select',
    message: 'Choose your package manager',
    choices: [
      { title: 'PNPM', value: 'pnpm' },
      { title: 'Yarn', value: 'yarn' },
      { title: 'NPM', value: 'npm' },
    ],
  })
  return option['selection']
}

const chooseTypescript = async () => {
  const option = await prompts({
    name: 'selection',
    type: 'confirm',
    initial: true,
    message: 'Would you like to use Typescript?',
  })
  return option['selection']
}

const choosePublicFolder = async ({ framework }: { framework: Framework }) => {
  let suggestion = 'public'
  switch (framework.name) {
    case 'next':
      return 'public'
    case 'hugo':
      return 'static'
    case 'jekyll':
      suggestion = 'public'
      break
  }
  const option = await prompts({
    name: 'selection',
    type: 'text',
    message:
      `Where are public assets stored? (default: "${suggestion}")\n` +
      logText(
        `Not sure what value to use? Refer to our "Frameworks" doc: ${linkText(
          'https://tina.io/docs/integration/frameworks/#configuring-tina-with-each-framework'
        )}`
      ),
  })
  return option['selection'] || suggestion
}

const chooseFramework = async () => {
  const option = await prompts({
    name: 'selection',
    type: 'select',
    message: 'What framework are you using?',
    choices: [
      { title: 'Next.js', value: { name: 'next', reactive: true } },
      { title: 'Hugo', value: { name: 'hugo', reactive: false } },
      { title: 'Jekyll', value: { name: 'jekyll', reactive: false } },
      {
        title: 'Other (SSG frameworks like gatsby, etc.)',
        value: { name: 'other', reactive: false },
      },
    ] as { title: string; value: Framework }[],
  })
  return option['selection'] as Framework
}

const forestryMigrate = async ({
  forestryPath,
  rootPath,
}: {
  forestryPath: string
  rootPath: string
}): Promise<string> => {
  logger.info(
    `It looks like you have a ${focusText(
      '.forestry/settings.yml'
    )} file in your project.`
  )

  logger.info(
    `This migration will update some of your content to match tina.  Please ${focusText(
      'save a backup of your content'
    )} before doing this migration. (This can be done with git)`
  )

  const option = await prompts({
    name: 'selection',
    type: 'confirm',
    initial: true,
    message: `Please note that this is a beta version and may contain some issues\nWould you like to migrate your Forestry templates?\n${logText(
      'Note: This migration will not be perfect, but it will get you started.'
    )}`,
  })
  if (!option['selection']) {
    return null
  }
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  await spin({
    waitFor: async () => {
      await delay(2000)
    },
    text: '',
  })
  const collections = await generateCollections({
    forestryPath,
    rootPath,
  })

  // print errors
  ErrorSingleton.getInstance().printNameErrors()

  return JSON.stringify(collections, null, 2)
}

const reportTelemetry = async ({
  hasForestryConfig,
  noTelemetry,
  usingTypescript,
}: {
  usingTypescript: boolean
  noTelemetry: boolean
  hasForestryConfig: boolean
}) => {
  if (noTelemetry) {
    logger.info(logText('Telemetry disabled'))
  }
  const telemetry = new Telemetry({ disabled: noTelemetry })
  const schemaFileType = usingTypescript ? 'ts' : 'js'
  await telemetry.submitRecord({
    event: {
      name: 'tinacms:cli:init:invoke',
      schemaFileType,
      hasForestryConfig,
    },
  })
}

const createPackageJSON = async () => {
  logger.info(logText('No package.json found, creating one'))
  await execShellCommand(`npm init --yes`)
}
const createGitignore = async ({ baseDir }: { baseDir: string }) => {
  logger.info(logText('No .gitignore found, creating one'))
  await fs.outputFileSync(path.join(baseDir, '.gitignore'), 'node_modules')
}

const checkGitignoreForNodeModules = async ({
  baseDir,
}: {
  baseDir: string
}) => {
  const gitignoreContent = await fs
    .readFileSync(path.join(baseDir, '.gitignore'))
    .toString()
  return gitignoreContent.split('\n').some((item) => item === 'node_modules')
}
const addNodeModulesToGitignore = async ({ baseDir }: { baseDir: string }) => {
  logger.info(logText('Adding node_modules to .gitignore'))
  const gitignoreContent = await fs
    .readFileSync(path.join(baseDir, '.gitignore'))
    .toString()
  const newGitignoreContent = [
    ...gitignoreContent.split('\n'),
    'node_modules',
  ].join('\n')
  await fs.writeFileSync(path.join(baseDir, '.gitignore'), newGitignoreContent)
}
const addDependencies = async (packageManager) => {
  logger.info(logText('Adding dependencies, this might take a moment...'))
  const deps = ['tinacms', '@tinacms/cli']
  const packageManagers = {
    pnpm: process.env.USE_WORKSPACE
      ? `pnpm add ${deps.join(' ')} --workspace`
      : `pnpm add ${deps.join(' ')}`,
    npm: `npm install ${deps.join(' ')}`,
    yarn: `yarn add ${deps.join(' ')}`,
  }
  logger.info(indentedCmd(`${logText(packageManagers[packageManager])}`))
  await execShellCommand(packageManagers[packageManager])
}

export interface AddConfigArgs {
  publicFolder: string
  baseDir: string
  usingTypescript: boolean
  framework: Framework
  collections?: string
  token?: string
  clientId?: string
}
const addConfigFile = async (args: AddConfigArgs) => {
  const { baseDir, usingTypescript } = args
  const configPath = path.join(
    '.tina',
    `config.${usingTypescript ? 'ts' : 'js'}`
  )
  const fullConfigPath = path.join(baseDir, configPath)
  if (fs.pathExistsSync(fullConfigPath)) {
    const override = await prompts({
      name: 'selection',
      type: 'confirm',
      message: `Found existing file at ${configPath}. Would you like to override?`,
    })
    if (override['selection']) {
      logger.info(logText(`Overriding file at ${configPath}.`))
      await fs.outputFileSync(fullConfigPath, config(args))
    } else {
      logger.info(logText(`Not overriding file at ${configPath}.`))
    }
  } else {
    logger.info(
      logText(
        `Adding config file at .tina/config.${usingTypescript ? 'ts' : 'js'}`
      )
    )
    await fs.outputFileSync(fullConfigPath, config(args))
  }
}

const addContentFile = async ({ baseDir }: { baseDir: string }) => {
  const contentPath = path.join('content', 'posts', 'hello-world.md')
  const fullContentPath = path.join(baseDir, contentPath)
  if (fs.pathExistsSync(fullContentPath)) {
    const override = await prompts({
      name: 'selection',
      type: 'confirm',
      message: `Found existing file at ${contentPath}. Would you like to override?`,
    })
    if (override['selection']) {
      logger.info(logText(`Overriding file at ${contentPath}.`))
      await fs.outputFileSync(fullContentPath, content)
    } else {
      logger.info(logText(`Not overriding file at ${contentPath}.`))
    }
  } else {
    logger.info(logText(`Adding content file at ${contentPath}`))
    await fs.outputFileSync(fullContentPath, content)
  }
}

const logNextSteps = ({
  framework,
  packageManager,
}: {
  packageManager: string
  framework: Framework
}) => {
  logger.info(focusText(`\n${titleText(' TinaCMS ')} has been initialized!`))
  logger.info(
    'To get started run: ' +
      cmdText(frameworkDevCmds[framework.name]({ packageManager }))
  )
  logger.info(
    `\nOnce your site is running, access the CMS at ${linkText(
      '<YourDevURL>/admin/index.html'
    )}`
  )
}

const other = ({ packageManager }: { packageManager: string }) => {
  const packageManagers = {
    pnpm: `pnpm`,
    npm: `npx`, // npx is the way to run executables that aren't in your "scripts"
    yarn: `yarn`,
  }
  const installText = `${packageManagers[packageManager]} tinacms dev -c "<your dev command>"`
  return installText
}

const frameworkDevCmds: {
  [key in Framework['name']]: (args?: { packageManager: string }) => string
} = {
  other,
  hugo: other,
  jekyll: other,
  next: ({ packageManager }: { packageManager: string }) => {
    const packageManagers = {
      pnpm: `pnpm`,
      npm: `npm run`, // npx is the way to run executables that aren't in your "scripts"
      yarn: `yarn`,
    }
    const installText = `${packageManagers[packageManager]} dev`
    return installText
  },
}

const config = (args: AddConfigArgs) => {
  return format(configExamples[args.framework.name](args))
}

const content = `---
title: Hello, World!
---

## Hello World!

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut non lorem diam. Quisque vulputate nibh sodales eros pretium tincidunt. Aenean porttitor efficitur convallis. Nulla sagittis finibus convallis. Phasellus in fermentum quam, eu egestas tortor. Maecenas ac mollis leo. Integer maximus eu nisl vel sagittis.

Suspendisse facilisis, mi ac scelerisque interdum, ligula ex imperdiet felis, a posuere eros justo nec sem. Nullam laoreet accumsan metus, sit amet tincidunt orci egestas nec. Pellentesque ut aliquet ante, at tristique nunc. Donec non massa nibh. Ut posuere lacus non aliquam laoreet. Fusce pharetra ligula a felis porttitor, at mollis ipsum maximus. Donec quam tortor, vehicula a magna sit amet, tincidunt dictum enim. In hac habitasse platea dictumst. Mauris sit amet ornare ligula, blandit consequat risus. Duis malesuada pellentesque lectus, non feugiat turpis eleifend a. Nullam tempus ante et diam pretium, ac faucibus ligula interdum.
`
const addReactiveFile = {
  next: ({
    baseDir,
    usingTypescript,
  }: {
    baseDir: string
    usingTypescript: boolean
  }) => {
    const usingSrc = !fs.pathExistsSync(path.join(baseDir, 'pages'))
    const pagesPath = path.join(baseDir, usingSrc ? 'src' : '', 'pages')
    const packageJSONPath = path.join(baseDir, 'package.json')

    const tinaBlogPagePath = path.join(pagesPath, 'demo', 'blog')
    const tinaBlogPagePathFile = path.join(
      tinaBlogPagePath,
      `[filename].${usingTypescript ? 'tsx' : 'js'}`
    )
    if (!fs.pathExistsSync(tinaBlogPagePathFile)) {
      fs.mkdirpSync(tinaBlogPagePath)
      fs.writeFileSync(tinaBlogPagePathFile, nextPostPage({ usingSrc }))
    }
    logger.info('Adding a nextjs example... ✅')

    // 4. update the users package.json
    const pack = JSON.parse(fs.readFileSync(packageJSONPath).toString())
    const oldScripts = pack.scripts || {}
    const newPack = JSON.stringify(
      {
        ...pack,
        scripts: extendNextScripts(oldScripts),
      },
      null,
      2
    )
    fs.writeFileSync(packageJSONPath, newPack)
  },
}

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
export function execShellCommand(cmd): Promise<string> {
  const exec = require('child_process').exec
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      }
      resolve(stdout ? stdout : stderr)
    })
  })
}
