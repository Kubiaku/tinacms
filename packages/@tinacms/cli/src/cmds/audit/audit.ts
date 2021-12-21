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

import { resolve } from '@tinacms/graphql'
import type { Database, TinaCloudCollection } from '@tinacms/graphql'
import p from 'path'
import { logger } from '../../logger'
import { assertShape } from '@tinacms/graphql'
import chalk from 'chalk'

type AuditArgs = {
  collection: TinaCloudCollection
  database: Database
  rootPath: string
}
export const auditCollection = async (args: AuditArgs) => {
  let warning = false
  const { collection, database, rootPath } = args
  const query = `query {
        getCollection(collection: "${collection.name}") {
          format
          documents {
            edges {
              node {
                ...on Document {
                  sys {
                    extension
                    path
                  }
                }
              }
            }
          }
        }
      }
      `
  const result = await resolve({
    database,
    query,
    variables: {},
  })
  const format = result.data.getCollection.format
  const docs = result.data.getCollection.documents.edges

  // validate file extension
  docs.forEach((x) => {
    const node = x.node
    if (node.sys.extension.replace('.', '') !== format) {
      warning = true
      logger.warn(
        chalk.yellowBright(
          `WARNING: there is a file with extension \`${
            node.sys.extension
          }\` but in your schema it is defined to be \`.${format}\`\n\location: ${p.join(
            rootPath,
            node.sys.path
          )}`
        )
      )
    }
  })

  return warning
}

export const auditDocuments = async (args: AuditArgs) => {
  const { collection, database } = args
  const query = `query {
        getCollection(collection: "${collection.name}") {
          format
          slug
          documents {
            edges {
              node {
                ...on Document {
                  sys {
                    extension
                    path
                    relativePath
                  }
                }
              }
            }
          }
        }
      }
      `
  const result = await resolve({
    database,
    query,
    variables: {},
  })
  let error = false
  const documents: any[] = result.data.getCollection.documents.edges
  for (let i = 0; i < documents.length; i++) {
    const node = documents[i].node
    const documentQuery = `query {
        getDocument(collection: "${collection.name}", relativePath: "${node.sys.relativePath}") {
          __typename
          ...on Document {
            values
          }
        }
      }`
    const docResult = await resolve({
      database,
      query: documentQuery,
      variables: {},
    })
    const params = transformDocumentIntoMutationRequestPayload(
      docResult.data.getDocument.values,
      {
        //   I am not 100% sure if these args are correct
        includeCollection: true,
        includeTemplate: typeof collection.templates !== 'undefined',
      }
    )
    // console.log({ params: JSON.stringify(params, null, 2) })
    // console.log({
    //   values: JSON.stringify(docResult.data.getDocument.values, null, 2),
    // })

    const mutation = `mutation($collection: String!, $relativePath: String!, $params: DocumentMutation!) {
        updateDocument(
          collection: $collection,
          relativePath: $relativePath,
          params: $params
        ){__typename}
      }`

    const mutationRes = await resolve({
      database,
      query: mutation,
      variables: {
        params,
        collection: collection.name,
        relativePath: node.sys.relativePath,
      },
      silenceErrors: true,
    })
    if (mutationRes.errors) {
      mutationRes.errors.forEach((err) => {
        error = true
        logger.error(chalk.red(err.message))
      })
    }
  }
  return error
}

// TODO: move this to its own package
export const transformDocumentIntoMutationRequestPayload = (
  document: {
    _collection: string
    __typename?: string
    _template: string
    [key: string]: unknown
  },
  /** Whether to include the collection and template names as top-level keys in the payload */
  instructions: { includeCollection?: boolean; includeTemplate?: boolean }
) => {
  const { _collection, __typename, _template, ...rest } = document

  const params = transformParams(rest)
  const paramsWithTemplate = instructions.includeTemplate
    ? { [_template]: params }
    : params

  return instructions.includeCollection
    ? { [_collection]: paramsWithTemplate }
    : paramsWithTemplate
}

const transformParams = (data: unknown) => {
  if (['string', 'number', 'boolean'].includes(typeof data)) {
    return data
  }
  if (Array.isArray(data)) {
    return data.map((item) => transformParams(item))
  }
  try {
    assertShape<{ _template: string; __typename?: string }>(data, (yup) =>
      // @ts-ignore No idea what yup is trying to tell me:  Type 'RequiredStringSchema<string, Record<string, any>>' is not assignable to type 'AnySchema<any, any, any>
      yup.object({ _template: yup.string().required() })
    )
    const { _template, __typename, ...rest } = data
    const nested = transformParams(rest)
    return { [_template]: nested }
  } catch (e) {
    if (e.message === 'Failed to assertShape - _template is a required field') {
      if (!data) {
        return []
      }
      const accum = {}
      Object.entries(data).map(([keyName, value]) => {
        accum[keyName] = transformParams(value)
      })
      return accum
    } else {
      if (!data) {
        return []
      }
      throw e
    }
  }
}
