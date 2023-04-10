import fs from 'fs-extra'
import path from 'path'
import os from 'os'
import * as esbuild from 'esbuild'
import type { Loader } from 'esbuild'
import { Config } from '@tinacms/schema-tools'
import * as dotenv from 'dotenv'
import normalizePath from 'normalize-path'
import { logger } from '../logger'

export const TINA_FOLDER = 'tina'
export const LEGACY_TINA_FOLDER = '.tina'
const GENERATED_FOLDER = '__generated__'
const GRAPHQL_JSON_FILE = '_graphql.json'
const GRAPHQL_GQL_FILE = 'schema.gql'
const SCHEMA_JSON_FILE = '_schema.json'
const LOOKUP_JSON_FILE = '_lookup.json'

export class ConfigManager {
  config: Config
  rootPath: string
  tinaFolderPath: string
  isUsingLegacyFolder: boolean
  tinaConfigFilePath: string
  tinaSpaPackagePath: string
  contentRootPath?: string
  envFilePath: string
  generatedFolderPath: string
  generatedGraphQLGQLPath: string
  generatedGraphQLJSONPath: string
  generatedSchemaJSONPath: string
  generatedLookupJSONPath: string
  generatedTypesTSFilePath: string
  generatedTypesJSFilePath: string
  generatedTypesDFilePath: string
  generatedClientTSFilePath: string
  generatedClientJSFilePath: string
  generatedQueriesFilePath: string
  generatedFragmentsFilePath: string
  generatedQueriesAndFragmentsGlob: string
  userQueriesAndFragmentsGlob: string
  publicFolderPath: string
  outputFolderPath: string
  outputHTMLFilePath: string
  outputGitignorePath: string
  selfHostedDatabaseFilePath?: string
  spaRootPath: string
  spaMainPath: string
  spaHTMLPath: string
  tinaGraphQLVersionFromCLI?: string
  legacyNoSDK?: boolean

  constructor({
    rootPath = process.cwd(),
    tinaGraphQLVersion,
    legacyNoSDK,
  }: {
    rootPath: string
    tinaGraphQLVersion?: string
    legacyNoSDK?: boolean
  }) {
    this.rootPath = normalizePath(rootPath)
    this.tinaGraphQLVersionFromCLI = tinaGraphQLVersion
    this.legacyNoSDK = legacyNoSDK
  }

  isUsingTs() {
    return ['.ts', '.tsx'].includes(path.extname(this.tinaConfigFilePath))
  }

  hasSelfHostedConfig() {
    return !!this.selfHostedDatabaseFilePath
  }

  hasSeparateContentRoot() {
    return this.rootPath !== this.contentRootPath
  }

  shouldSkipSDK() {
    if (this.legacyNoSDK) {
      return this.legacyNoSDK
    }
    return this.config.client?.skip || false
  }

  async processConfig() {
    this.tinaFolderPath = await this.getTinaFolderPath(this.rootPath)

    // TODO - .env should potentially be configurable
    this.envFilePath = path.resolve(
      path.join(this.tinaFolderPath, '..', '.env')
    )
    dotenv.config({ path: this.envFilePath })

    // Setup file paths that don't depend on the config file
    // =================
    this.tinaConfigFilePath = await this.getPathWithExtension(
      path.join(this.tinaFolderPath, 'config')
    )
    if (!this.tinaConfigFilePath) {
      throw new Error(
        `Unable to find config file in ${this.tinaFolderPath}. Looking for a file named "config.{ts,tsx,js,jsx}"`
      )
    }
    this.selfHostedDatabaseFilePath = await this.getPathWithExtension(
      path.join(this.tinaFolderPath, 'database')
    )
    this.generatedFolderPath = path.join(this.tinaFolderPath, GENERATED_FOLDER)

    this.generatedGraphQLGQLPath = path.join(
      this.generatedFolderPath,
      GRAPHQL_GQL_FILE
    )
    this.generatedGraphQLJSONPath = path.join(
      this.generatedFolderPath,
      GRAPHQL_JSON_FILE
    )
    this.generatedSchemaJSONPath = path.join(
      this.generatedFolderPath,
      SCHEMA_JSON_FILE
    )
    this.generatedLookupJSONPath = path.join(
      this.generatedFolderPath,
      LOOKUP_JSON_FILE
    )
    this.generatedQueriesFilePath = path.join(
      this.generatedFolderPath,
      'queries.gql'
    )
    this.generatedFragmentsFilePath = path.join(
      this.generatedFolderPath,
      'frags.gql'
    )

    this.generatedTypesTSFilePath = path.join(
      this.generatedFolderPath,
      'types.ts'
    )
    this.generatedTypesJSFilePath = path.join(
      this.generatedFolderPath,
      'types.js'
    )
    this.generatedTypesDFilePath = path.join(
      this.generatedFolderPath,
      'types.d.ts'
    )
    this.userQueriesAndFragmentsGlob = path.join(
      this.tinaFolderPath,
      'queries/**/*.{graphql,gql}'
    )
    this.generatedQueriesAndFragmentsGlob = path.join(
      this.generatedFolderPath,
      '*.{graphql,gql}'
    )
    // TODO: make these match the behavior where this matches the config format
    this.generatedClientTSFilePath = path.join(
      this.generatedFolderPath,
      'client.ts'
    )
    this.generatedClientJSFilePath = path.join(
      this.generatedFolderPath,
      'client.js'
    )
    // =================
    // End of file paths that don't depend on the config file

    // Setup Config files and paths that depend on the config file
    // =================

    // Create a Dummy client file if it doesn't exist
    const clientExists = this.isUsingTs()
      ? await fs.pathExists(this.generatedClientTSFilePath)
      : await fs.pathExists(this.generatedClientJSFilePath)

    if (!clientExists) {
      // This handles the case if they import the client from the config file (normally indirectly and its not actually used)
      const file = 'export default ()=>({})\nexport const client = ()=>({})'
      if (this.isUsingTs()) {
        await fs.outputFile(this.generatedClientTSFilePath, file)
      } else {
        await fs.outputFile(this.generatedClientJSFilePath, file)
      }
    }

    // Load the config file with ES build
    this.config = await this.loadConfigFile(
      this.generatedFolderPath,
      this.tinaConfigFilePath
    )

    this.publicFolderPath = path.join(
      this.rootPath,
      this.config.build.publicFolder
    )
    this.outputFolderPath = path.join(
      this.publicFolderPath,
      this.config.build.outputFolder
    )
    this.outputHTMLFilePath = path.join(this.outputFolderPath, 'index.html')
    this.outputGitignorePath = path.join(this.outputFolderPath, '.gitignore')

    const fullLocalContentPath = path.join(
      this.tinaFolderPath,
      this.config.localContentPath || ''
    )

    if (
      this.config.localContentPath &&
      (await fs.existsSync(fullLocalContentPath))
    ) {
      logger.info(`Using separate content repo at ${fullLocalContentPath}`)
      this.contentRootPath = fullLocalContentPath
    } else {
      this.contentRootPath = this.rootPath
    }

    this.spaMainPath = require.resolve('@tinacms/app')
    this.spaRootPath = path.join(this.spaMainPath, '..', '..')
    // =================
    // End of paths that depend on the config file
  }

  async getTinaFolderPath(rootPath) {
    const tinaFolderPath = path.join(rootPath, TINA_FOLDER)
    const tinaFolderExists = await fs.pathExists(tinaFolderPath)
    if (tinaFolderExists) {
      this.isUsingLegacyFolder = false
      return tinaFolderPath
    }
    const legacyFolderPath = path.join(rootPath, LEGACY_TINA_FOLDER)
    const legacyFolderExists = await fs.pathExists(legacyFolderPath)
    if (legacyFolderExists) {
      this.isUsingLegacyFolder = true
      return legacyFolderPath
    }
    throw new Error(
      `Unable to find Tina folder, if you're working in folder outside of the Tina config be sure to specify --rootPath`
    )
  }

  getTinaGraphQLVersion() {
    if (this.tinaGraphQLVersionFromCLI) {
      return this.tinaGraphQLVersionFromCLI
    }
    const generatedSchema = fs.readJSONSync(this.generatedSchemaJSONPath)
    if (
      !generatedSchema ||
      !(typeof generatedSchema?.version !== 'undefined') ||
      !(typeof generatedSchema?.version?.major === 'string') ||
      !(typeof generatedSchema?.version?.minor === 'string')
    ) {
      throw new Error(
        `Can not find Tina GraphQL version in ${this.generatedSchemaJSONPath}`
      )
    }
    return `${generatedSchema.version.major}.${generatedSchema.version.minor}`
  }

  printGeneratedClientFilePath() {
    if (this.isUsingTs()) {
      return this.generatedClientTSFilePath.replace(`${this.rootPath}/`, '')
    }
    return this.generatedClientJSFilePath.replace(`${this.rootPath}/`, '')
  }

  printGeneratedTypesFilePath() {
    return this.generatedTypesTSFilePath.replace(`${this.rootPath}/`, '')
  }
  printoutputHTMLFilePath() {
    return this.outputHTMLFilePath.replace(`${this.publicFolderPath}/`, '')
  }
  printRelativePath(filename: string) {
    if (filename) {
      return filename.replace(`${this.rootPath}/`, '')
    }
    throw `No path provided to print`
  }
  printContentRelativePath(filename: string) {
    if (filename) {
      return filename.replace(`${this.contentRootPath}/`, '')
    }
    throw `No path provided to print`
  }

  /**
   * Given a filepath without an extension, find the first match (eg. tsx, ts, jsx, js)
   */
  async getPathWithExtension(filepath: string) {
    const extensions = ['tsx', 'ts', 'jsx', 'js']
    let result
    await Promise.all(
      extensions.map(async (ext) => {
        // If we found one, stop checking
        if (result) {
          return
        }
        const filepathWithExtension = `${filepath}.${ext}`
        const exists = await fs.existsSync(filepathWithExtension)
        if (exists) {
          result = filepathWithExtension
        }
      })
    )
    return result
  }

  async loadDatabaseFile() {
    // Date.now because imports are cached, we don't have a
    // good way of invalidating them when this file changes
    // https://github.com/nodejs/modules/issues/307
    const tmpdir = path.join(os.tmpdir(), Date.now().toString())
    const outfile = path.join(tmpdir, 'database.build.js')
    await esbuild.build({
      entryPoints: [this.selfHostedDatabaseFilePath],
      bundle: true,
      platform: 'node',
      outfile: outfile,
      loader: loaders,
    })
    const result = require(outfile)
    await fs.removeSync(outfile)
    return result.default
  }

  async loadConfigFile(generatedFolderPath: string, configFilePath: string) {
    // Date.now because imports are cached, we don't have a
    // good way of invalidating them when this file changes
    // https://github.com/nodejs/modules/issues/307
    const tmpdir = path.join(os.tmpdir(), Date.now().toString())
    const outfile = path.join(tmpdir, 'config.build.jsx')
    const outfile2 = path.join(tmpdir, 'config.build.js')
    const tempTSConfigFile = path.join(tmpdir, 'tsconfig.json')
    await fs.outputFileSync(tempTSConfigFile, '{}')
    await esbuild.build({
      entryPoints: [configFilePath],
      bundle: true,
      target: ['es2020'],
      platform: 'node',
      outfile,
      loader: loaders,
    })
    await esbuild.build({
      entryPoints: [outfile],
      bundle: true,
      platform: 'node',
      outfile: outfile2,
      loader: loaders,
    })
    const result = require(outfile2)
    await fs.removeSync(outfile)
    await fs.removeSync(outfile2)
    return result.default
  }
}

export const loaders: { [ext: string]: Loader } = {
  '.aac': 'file',
  '.css': 'file',
  '.eot': 'file',
  '.flac': 'file',
  '.gif': 'file',
  '.jpeg': 'file',
  '.jpg': 'file',
  '.json': 'json',
  '.mp3': 'file',
  '.mp4': 'file',
  '.ogg': 'file',
  '.otf': 'file',
  '.png': 'file',
  '.svg': 'file',
  '.ttf': 'file',
  '.wav': 'file',
  '.webm': 'file',
  '.webp': 'file',
  '.woff': 'file',
  '.woff2': 'file',
  '.js': 'jsx',
  '.jsx': 'jsx',
  '.tsx': 'tsx',
}
