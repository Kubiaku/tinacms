import { describe, expect, it } from 'vitest'
import { field, parseMDX, stringifyMDX } from './_config'
import { setupNewTests, writeAutoformatFile, writeTestFile } from '../setup'

const content = import.meta.glob('./*[!.autoformat].md', { as: 'raw' })
const outputString = import.meta.glob('./*.ts', { as: 'raw' })

setupNewTests(content, outputString, ({ name, markdownContent }) => {
  describe(`setting up ${name}`, () => {
    it(`verifies that stringifying the parsed output will match the original string`, async () => {
      const markdownString = await markdownContent()
      const astResult = parseMDX(markdownString, field, (v) => v)
      const stringResult = stringifyMDX(astResult, field, (v) => v)
      try {
        expect(stringResult).toEqual(markdownString)
        // If `expect` doesn't throw, save the file
        writeTestFile(__dirname, name, astResult)
      } catch (e) {
        if (name.startsWith('./autoformat')) {
          console.log('we shoud write another file', stringResult)
          writeTestFile(__dirname, name, astResult, true)
          writeAutoformatFile(__dirname, name, stringResult)
        } else {
          throw e
        }
      }
    })
  })
})

it(`true is true`, () => {
  expect(true).toBe(true)
})
