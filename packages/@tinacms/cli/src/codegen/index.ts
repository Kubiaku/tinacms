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

import { parse, printSchema, GraphQLSchema } from 'graphql'
import { codegen } from '@graphql-codegen/core'
import { plugin as typescriptPlugin } from '@graphql-codegen/typescript'
import { plugin as typescriptOperationsPlugin } from '@graphql-codegen/typescript-operations'
import { AddGeneratedClient } from './plugin'

// Docs: https://www.graphql-code-generator.com/docs/plugins/typescript-generic-sdk
import { plugin as typescriptSdkPlugin } from './sdkPlugin'
// See https://www.graphql-tools.com/docs/documents-loading for more examples of the `load documents function`
import { loadDocuments } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'

import { logger } from '../logger'

export const generateTypes = async (
  schema: GraphQLSchema,
  queryPathGlob = process.cwd(),
  fragDocPath = process.cwd()
) => {
  logger.info('Generating types...')
  try {
    const moreDocs = await loadDocuments(
      `fragment getPostsDocumentPartsTest on PostsDocument {
      form
    }
    `,
      { loaders: [] }
    )
    let docs = []
    let fragDocs = []
    try {
      docs = await loadDocuments(queryPathGlob, {
        loaders: [new GraphQLFileLoader()],
      })
      fragDocs = await loadDocuments(fragDocPath, {
        loaders: [new GraphQLFileLoader()],
      })
    } catch (e) {
      console.error(e)
    }
    // See https://www.graphql-code-generator.com/docs/getting-started/programmatic-usage for more details
    const res = await codegen({
      // Filename is not used. This is because the typescript plugin returns a string instead of writing to a file.
      filename: process.cwd(),
      schema: parse(printSchema(schema)),
      documents: [...docs, ...moreDocs, ...fragDocs],
      config: {},
      plugins: [
        { typescript: {} },
        { typescriptOperations: {} },
        {
          typescriptSdk: {
            gqlImport: 'tinacms#gql',
            documentNodeImport: 'tinacms#DocumentNode',
          },
        },
        { AddGeneratedClient: {} },
      ],
      pluginMap: {
        typescript: {
          plugin: typescriptPlugin,
        },
        typescriptOperations: {
          plugin: typescriptOperationsPlugin,
        },
        typescriptSdk: {
          plugin: typescriptSdkPlugin,
        },
        AddGeneratedClient,
      },
    })
    return res
  } catch (e) {
    console.error(e)
  }
}
