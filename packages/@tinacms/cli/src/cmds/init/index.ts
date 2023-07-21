import { logger } from '../../logger'
import detectEnvironment from './detectEnvironment'
import configure from './configure'
import { CLICommand } from '../index'
import apply from './apply'

export interface Framework {
  name: 'next' | 'hugo' | 'jekyll' | 'other'
  reactive: boolean
}

type GeneratedFileType =
  | 'auth'
  | 'config'
  | 'templates'
  | 'vercel-kv-credentials-provider-signin'
  | 'vercel-kv-credentials-provider-register'
  | 'next-auth-api-handler'

export type GeneratedFile = {
  fullPathJS: string
  fullPathTS: string
  name: string
  parentPath: string
  typescriptExists: boolean
  javascriptExists: boolean
  resolve: (boolean) => { exists: boolean; path: string }
}

export type InitEnvironment = {
  forestryConfigExists: boolean
  frontMatterFormat: 'yaml' | 'toml' | 'json'
  gitIgnoreExists: boolean
  gitIgoreNodeModulesExists: boolean
  packageJSONExists: boolean
  sampleContentExists: boolean
  sampleContentPath: string
  generatedFiles?: {
    [key in GeneratedFileType]: GeneratedFile
  }
  usingSrc: boolean
}

export type InitParams = {
  rootPath: string
  pathToForestryConfig: string
  noTelemetry: boolean
  showSelfHosted?: boolean
  baseDir?: string
}

export const command = new CLICommand<InitEnvironment, InitParams>({
  async setup(params: InitParams): Promise<void> {
    logger.level = 'info'
    process.chdir(params.rootPath)
  },
  detectEnvironment({
    rootPath,
    pathToForestryConfig,
    baseDir = '',
  }: InitParams): Promise<InitEnvironment> {
    return detectEnvironment({
      baseDir,
      pathToForestryConfig,
      rootPath,
    })
  },
  configure(
    env: InitEnvironment,
    { showSelfHosted = false }: InitParams
  ): Promise<Record<any, any>> {
    return configure(env, { showSelfHosted })
  },
  apply(
    config: Record<any, any>,
    env: InitEnvironment,
    params: InitParams
  ): Promise<void> {
    return apply({
      env,
      params,
      config,
    })
  },
})
