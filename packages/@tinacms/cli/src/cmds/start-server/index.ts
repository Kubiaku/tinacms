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

import path from 'path'
import chalk from 'chalk'
import chokidar from 'chokidar'

import { Telemetry } from '@tinacms/metrics'

import { build } from '../../buildTina'
import { AsyncLock } from './lock'
import { dangerText } from '../../utils/theme'
import { handleServerErrors } from './errors'
import { logger } from '../../logger'
import type { Bridge, Database, Store } from '@tinacms/graphql'

const buildLock = new AsyncLock()
const reBuildLock = new AsyncLock()
interface Options {
  port?: number
  command?: string
  watchFolders?: string[]
  experimentalData?: boolean
  isomorphicGitBridge?: boolean
  noWatch?: boolean
  noSDK: boolean
  noTelemetry: boolean
  verbose?: boolean
  dev?: boolean
  local: boolean
}

const gqlPackageFile = require.resolve('@tinacms/graphql')

export async function startServer(
  ctx,
  next,
  {
    port = 4001,
    noWatch,
    isomorphicGitBridge,
    noSDK,
    noTelemetry,
    watchFolders,
    verbose,
    dev,
    local,
  }: Options
) {
  buildLock.disable()
  reBuildLock.disable()

  const rootPath = ctx.rootPath as string
  const t = new Telemetry({ disabled: Boolean(noTelemetry) })
  t.submitRecord({
    event: {
      name: 'tinacms:cli:server:start:invoke',
    },
  })
  const bridge: Bridge = ctx.bridge
  const database: Database = ctx.database
  const store: Store = ctx.store

  // This is only false for tina-cloud media stores
  const shouldBuild = bridge.supportsBuilding()

  let ready = false

  const state = {
    server: null,
    sockets: [],
  }

  let isReady = false

  const beforeBuild = async () => {
    // Wait for the lock to be disabled
    await buildLock.promise
    // Enable the lock so that no two builds can happen at once
    buildLock.enable()
  }
  const afterBuild = async () => {
    // Disable the lock so a new build can run
    buildLock.disable()
  }

  const start = async () => {
    // we do not want to start the server while the schema is building
    await buildLock.promise

    // hold the lock
    buildLock.enable()
    try {
      const s = require('./server')
      state.server = await s.default(database)

      state.server.listen(port, () => {
        const altairUrl = `http://localhost:${port}/altair/`
        const cmsUrl = `[your-development-url]/admin`
        if (verbose)
          logger.info(`Started Filesystem GraphQL server on port: ${port}`)
        logger.info(
          `Visit the GraphQL playground at ${chalk.underline.blueBright(
            altairUrl
          )}\nor`
        )
        logger.info(`Enter the CMS at ${chalk.underline.blueBright(cmsUrl)} \n`)
      })
      state.server.on('error', function (e) {
        if (e.code === 'EADDRINUSE') {
          logger.error(dangerText(`Port 4001 already in use`))
          process.exit()
        }
        throw e
      })
      state.server.on('connection', (socket) => {
        state.sockets.push(socket)
      })
    } catch (error) {
      throw error
    } finally {
      // let go of the lock
      buildLock.disable()
    }
  }

  const restart = async () => {
    return new Promise((resolve, reject) => {
      logger.info('restarting local server...')
      delete require.cache[gqlPackageFile]

      state.sockets.forEach((socket) => {
        if (socket.destroyed === false) {
          socket.destroy()
        }
      })
      state.sockets = []
      state.server.close(async () => {
        logger.info('Server closed')
        start()
          .then((x) => resolve(x))
          .catch((err) => reject(err))
      })
    })
  }

  const foldersToWatch = (watchFolders || []).map((x) => path.join(rootPath, x))
  if (!noWatch && !process.env.CI) {
    chokidar
      .watch(
        [
          ...foldersToWatch,
          `${rootPath}/.tina/**/*.{ts,gql,graphql,js,tsx,jsx}`,
          gqlPackageFile,
        ],
        {
          ignored: [
            '**/node_modules/**/*',
            '**/.next/**/*',
            `${path.resolve(rootPath)}/.tina/__generated__/**/*`,
          ],
        }
      )
      .on('ready', async () => {
        if (verbose) console.log('Generating Tina config')
        try {
          if (shouldBuild) {
            await build({
              bridge,
              ctx,
              database,
              store,
              dev,
              isomorphicGitBridge,
              local,
              noSDK,
              noWatch,
              verbose,
              beforeBuild,
              afterBuild,
            })
          }
          ready = true
          isReady = true
          await start()
          next()
        } catch (e) {
          handleServerErrors(e)
          // FIXME: make this a debug flag
          console.log(e)
          process.exit(0)
        }
      })
      .on('all', async () => {
        if (ready) {
          await reBuildLock.promise
          // hold the rebuild lock
          reBuildLock.enable()
          logger.info('Tina change detected, regenerating config')
          try {
            if (shouldBuild) {
              await build({
                bridge,
                ctx,
                database,
                store,
                dev,
                isomorphicGitBridge,
                local,
                noSDK,
                noWatch,
                verbose,
                beforeBuild,
                afterBuild,
              })
            }
            if (isReady) {
              await restart()
            }
          } catch (e) {
            handleServerErrors(e)
            t.submitRecord({
              event: {
                name: 'tinacms:cli:server:error',
                errorMessage: e.message,
              },
            })
          } finally {
            reBuildLock.disable()
          }
        }
      })
  } else {
    if (process.env.CI) {
      logger.info('Detected CI environment, omitting watch commands...')
    }
    if (shouldBuild) {
      await build({
        bridge,
        ctx,
        database,
        store,
        dev,
        isomorphicGitBridge,
        local,
        noSDK,
        noWatch,
        verbose,
        beforeBuild,
        afterBuild,
      })
    }
    await start()
    next()
  }
}
