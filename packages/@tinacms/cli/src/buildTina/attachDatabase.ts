/**
 Copyright 2021 Forestry.io Holdings, Inc.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import { getPath } from '../lib'
import * as path from 'path'
import { transpile } from '../cmds/compile'
import { BuildSchemaError } from '../cmds/start-server/errors'
import { FilesystemBridge, IsomorphicBridge } from '@tinacms/datalayer'
import { createDatabase } from '@tinacms/graphql'
import fs from 'fs-extra'
import { makeIsomorphicOptions } from './git'
import { MemoryLevel } from 'memory-level'

export const attachDatabase = async (
  ctx: any,
  next: () => void,
  _options: {
    isomorphicGitBridge: boolean
    useLocalDatabase: boolean
    dev: boolean
    verbose: boolean
  }
) => {
  const tinaPath = path.join(ctx.rootPath, '.tina')
  const tinaGeneratedPath = path.join(tinaPath, '__generated__')
  const tinaTempPath = path.join(tinaGeneratedPath, `temp_database`)
  const define = {}
  if (!process.env.NODE_ENV) {
    define['process.env.NODE_ENV'] = _options.dev
      ? '"development"'
      : '"production"'
  }
  const inputFile = getPath({
    projectDir: path.join(ctx.rootPath, '.tina'),
    filename: 'database',
    allowedTypes: ['js', 'jsx', 'tsx', 'ts'],
  })
  // if (inputFile && !_options.useLocalDatabase) {
  if (inputFile) {
    try {
      await transpile(
        inputFile,
        'database.cjs',
        tinaTempPath,
        _options.verbose,
        define,
        path.join(ctx.rootPath, 'package.json')
      )
    } catch (e) {
      await fs.remove(tinaTempPath)
      throw new BuildSchemaError(e)
    }

    // Delete the node require cache for .tina temp folder
    Object.keys(require.cache).map((key) => {
      if (key.startsWith(tinaTempPath)) {
        delete require.cache[require.resolve(key)]
      }
    })

    try {
      const databaseFunc = require(path.join(tinaTempPath, `database.cjs`))
      ctx.database = databaseFunc.default
      ctx.bridge = ctx.database.bridge
      ctx.isSelfHostedDatabase = true
      await fs.remove(tinaTempPath)
    } catch (e) {
      // Always remove the temp code
      await fs.remove(tinaTempPath)

      throw e
    }
  } else {
    /**
     * To work with Github directly, replace the Bridge and Store
     * and ensure you've provided your access token.
     * NOTE: when talking the the tinacms repo, you must
     * give your personal access token access to the TinaCMS org
     */
    // const ghConfig = {
    //   rootPath: 'examples/tina-cloud-starter',
    //   accessToken: '<my-token>',
    //   owner: 'tinacms',
    //   repo: 'tinacms',
    //   ref: 'add-data-store',
    // }
    // const bridge = new GithubBridge(ghConfig)
    // const store = new GithubStore(ghConfig)

    const fsBridge = new FilesystemBridge(ctx.rootPath)
    const bridge = _options.isomorphicGitBridge
      ? new IsomorphicBridge(
          ctx.rootPath,
          _options.isomorphicGitBridge &&
            (await makeIsomorphicOptions(fsBridge))
        )
      : fsBridge

    const level = new MemoryLevel<string, Record<string, any>>({
      valueEncoding: 'json',
    })

    ctx.database = await createDatabase({ level, bridge })
    ctx.bridge = bridge
  }
  next()
}
