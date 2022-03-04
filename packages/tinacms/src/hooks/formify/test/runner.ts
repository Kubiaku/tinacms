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

import { renderHook, act } from '@testing-library/react-hooks'
import { useFormify } from '..'
import * as util from './util'
import fs from 'fs'
import path from 'path'
import { OnChangeEvent } from '../types'

const requestList = []

/**
 * When setting up a test, you should run the local server
 * at experimental-examples/unit-test-example. Otherwise, the mocks.json
 * in the respective test folder should supply the network mocks
 */
const SET_MOCKS_FROM_LOCAL_SERVER = true

export const testRunner = async (query, events, dirname) => {
  if (SET_MOCKS_FROM_LOCAL_SERVER) {
    const { fetch: origFetch } = global
    // @ts-ignore
    global.fetch = async (...args) => {
      const response = await origFetch(...args)

      /* work with the cloned response in a separate promise
       chain -- could use the same chain with `await`. */
      const body = await response.json()
      if (args[0] === 'http://localhost:4001/graphql') {
        requestList.push({ queryString: args[1].body, response: body })
      }
      return {
        ok: response.ok,
        status: response.status,
        json: async () => body,
      }
    }
  } else {
    try {
      let mocks = []
      mocks = JSON.parse(
        await fs.readFileSync(path.join(dirname, 'mocks.json')).toString()
      )

      // @ts-ignore
      global.fetch = async (...args) => {
        const body = mocks.find(
          (mock) => mock.queryString === args[1].body
        )?.response
        if (!body) {
          throw new Error('Unable to find mock')
        }
        return {
          ok: 'ok',
          status: 200,
          json: async () => body,
        }
      }
    } catch (e) {
      throw new Error(`Mocks fixture does not exist`)
    }
  }
  const { result, waitFor } = renderHook(() =>
    useFormify({
      query,
      cms: util.cms,
      formify: (args) => args.createForm(args.formConfig),
      onSubmit: () => {},
      variables: {},
    })
  )

  await waitFor(() => {
    return result.current.status === 'done'
  })

  expect(util.printState(result.current)).toMatchFile(
    util.buildFileOutput(dirname)
  )

  await act(
    async () =>
      await util.sequential(events, async (event: OnChangeEvent, i) => {
        const previous = { ...result.current.data }

        /**
         * Dispatch the event
         */
        util.cms.events.dispatch(event)

        /**
         * Wait for changesets to be generated
         */
        try {
          await waitFor(() => {
            return result.current.changeSets.length > 0
          })
        } catch (e) {
          throw new Error(
            `No changesets generated from event #${i + 1}, type: ${
              event.mutationType.type
            }`
          )
        }

        /**
         * Wait until all changesets have been resolved
         */
        try {
          await waitFor(
            () => {
              return result.current.changeSets.length === 0
            },
            { timeout: 5000 }
          )
        } catch (e) {
          throw new Error(
            `Changesets never resolved from event #${i + 1}, type: ${
              event.mutationType.type
            }`
          )
        }
        const after = { ...result.current.data }

        expect(util.printOutput(event, previous, after)).toMatchFile(
          util.buildMarkdownOutput(dirname, i)
        )
        return true
      })
  )

  if (SET_MOCKS_FROM_LOCAL_SERVER) {
    await fs.writeFileSync(
      path.join(dirname, 'mocks.json'),
      JSON.stringify(requestList)
    )
  }
}
