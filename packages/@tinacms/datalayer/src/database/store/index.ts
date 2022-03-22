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

import {JSONPath} from 'jsonpath-plus'

import {FilterOperand} from '../../index'

export const DEFAULT_COLLECTION_SORT_KEY = 'filepath'

export enum OP {
  EQ = 'eq',
  GT = 'gt',
  LT = 'lt',
  GTE = 'gte',
  LTE = 'lte',
  STARTS_WITH = 'startsWith',
  IN = 'in',
}

export type BinaryFilter = {
  pathExpression: string
  rightOperand: FilterOperand
  operator:  OP.EQ | OP.GT | OP.LT | OP.GTE | OP.LTE | OP.STARTS_WITH | OP.IN
  type: string
}

export type TernaryFilter = {
  pathExpression: string
  leftOperand: FilterOperand
  rightOperand: FilterOperand
  leftOperator: OP.GTE | OP.GT
  rightOperator: OP.LT | OP.LTE
  type: string
}

/** Options for {@link Store.query} */
export type StoreQueryOptions = {
  /* collection name */
  collection: string,
  /* index definitions for specified collection */
  indexDefinitions?: Record<string,IndexDefinition>,
  /* filters to apply to the query */
  filterChain: (BinaryFilter | TernaryFilter)[],
  /* sort (either field or index) */
  sort?: string,
  /* starting key exclusive */
  gt?: string,
  /* starting key inclusive */
  gte?: string,
  /* ending key exclusive */
  lt?: string,
  /* ending key inclusive */
  lte?: string,
  /* if true, returns results in reverse order */
  reverse?: boolean,
  /* limits result set */
  limit?: number
}

export type PageInfo = {
  hasPreviousPage: boolean,
  hasNextPage: boolean,
  startCursor: string,
  endCursor: string
}

export type StoreQueryResponse = {
  edges: { cursor: string, path: string }[],
  pageInfo: PageInfo
}

export type IndexDefinition = {
  fields: {
    name: string
    type?: string
  }[]
}

export type SeedOptions = {
  collection?: string,
  indexDefinitions?: Record<string,IndexDefinition>,
  includeTemplate?: boolean,
  keepTemplateKey?: boolean,
}

export type PutOptions = SeedOptions & {seed?: boolean}

export interface Store {
  glob(
    pattern: string,
    hydrator?: (fullPath: string) => Promise<object>
  ): Promise<string[]>
  get<T extends object>(filepath: string): Promise<T>
  // delete(filepath: string): Promise<void>
  clear(): void
  close(): void
  open(): void
  /**
   * Executes a query against a collection
   * @param queryOptions - options for the query
   * @returns the results of the query
   */
  query(queryOptions: StoreQueryOptions): Promise<StoreQueryResponse>

  /**
   * In this context, seeding is the act of putting records and indexing data into an ephemeral
   * storage layer for use during the GraphQL runtime. What might seem suprising is that some stores
   * don't support seeding, this is because they're behaving more like a "bridge" (GithubStore and FilesystemStore).
   * Currently they're acting as a way to swap out true data-layer behavior with a backwards-compatible
   * "store". In the future, all stores should be able to query and seed data.
   *
   * At this time it seems that it would never make sense to be able to "query" without "seed"-ing, and
   * there'd be no value in "seeding" without "query"-ing.
   */
  seed(
    filepath: string,
    data: object,
    options?: PutOptions,
  ): Promise<void>
  supportsSeeding(): boolean
  /**
   * Whether this store supports the ability to index data.
   * Indexing data requires writing arbitrary keys/values to
   * the external service, so is not advisable to use for
   * something like Github, which would write commits to the
   * user's repo.
   */
  supportsIndexing(): boolean
  put(
    filepath: string,
    data: object,
    options?: PutOptions
  ): Promise<void>
}

const inferOperatorFromFilter = (filterOperator: string) => {
  switch(filterOperator) {
    case 'after':
      return OP.GT

    case 'before':
      return OP.LT

    case 'eq':
      return OP.EQ

    case 'startsWith':
      return OP.STARTS_WITH

    case 'lt':
      return OP.LT

    case 'lte':
      return OP.LTE

    case 'gt':
      return OP.GT

    case 'gte':
      return OP.GTE

    case 'in':
      return OP.IN

    default:
      throw new Error(`unsupported filter condition: '${filterOperator}'`)
  }
}

export type FilterCondition = {
  filterExpression: Record<string,FilterOperand>,
  filterPath: string
}

export const makeFilterChain = ({ conditions }: { conditions: FilterCondition[]}) => {
  const filterChain: (BinaryFilter | TernaryFilter)[] = []
  if (!conditions) {
    return filterChain
  }

  for (const condition of conditions) {
    const { filterPath, filterExpression } = condition
    const { _type, ...keys } = filterExpression
    const [key1, key2, ...extraKeys] = Object.keys(keys)
    if (extraKeys.length) {
      throw new Error(`Unexpected keys: [${extraKeys.join(',')}] in filter expression`)
    }

    if (key1 && !key2) {
      filterChain.push({
        pathExpression: filterPath,
        rightOperand: filterExpression[key1],
        operator: inferOperatorFromFilter(key1),
        type: _type as string
      })
    } else if (key1 && key2) {
      const leftFilterOperator = (filterExpression['gt'] && 'gt') || (filterExpression['gte'] && 'gte') || (filterExpression['after'] && 'after') || undefined
      const rightFilterOperator = (filterExpression['lt'] && 'lt') || (filterExpression['lte'] && 'lte') || (filterExpression['before'] && 'before') || undefined
      let leftOperand: FilterOperand
      let rightOperand: FilterOperand
      if (rightFilterOperator && leftFilterOperator) {
        if (key1 === leftFilterOperator) {
          leftOperand = filterExpression[key1]
          rightOperand = filterExpression[key2]
        } else {
          rightOperand = filterExpression[key1]
          leftOperand = filterExpression[key2]
        }

        filterChain.push({
          pathExpression: filterPath,
          rightOperand,
          leftOperand,
          leftOperator: inferOperatorFromFilter(leftFilterOperator) as OP.GT | OP.GTE,
          rightOperator: inferOperatorFromFilter(rightFilterOperator) as OP.LT | OP.LTE,
          type: _type as string
        })
      } else {
        throw new Error(`Filter on field '${filterPath}' has invalid combination of conditions: '${key1}, ${key2}'`)
      }
    }
  }
  return filterChain
}

export const makeFilter = ({ filterChain }: {
  filterChain?: (BinaryFilter | TernaryFilter)[]
}): (values: Record<string, object | FilterOperand>) => boolean => {
  return (values: Record<string, object>) => {
    for (const filter of filterChain) {
      const dataType = filter.type
      const resolvedValues = JSONPath({path: filter.pathExpression, json: values})
      if (!resolvedValues || !resolvedValues.length) {
        return false
      }

      let operands: FilterOperand[]
      if (dataType === 'string' || dataType === 'reference') {
        operands = resolvedValues
      } else if (dataType === 'number' || dataType === 'datetime') {
        operands = resolvedValues.map(resolvedValue => Number(resolvedValue))
      } else if (dataType === 'boolean') {
        operands = resolvedValues.map(resolvedValue => (typeof resolvedValue === 'boolean' && resolvedValue) || resolvedValue === 'true' || resolvedValue === '1')
      } else {
        throw new Error(`Unexpected datatype ${dataType}`)
      }

      const { operator } = filter as BinaryFilter
      let matches = false
      if (operator) {
        switch(operator) {
          case OP.EQ:
            if (operands.findIndex(operand => operand === filter.rightOperand) >= 0) {
              matches = true
            }
            break
          case OP.GT:
            for (const operand of operands) {
              if (operand > filter.rightOperand) {
                matches = true
                break
              }
            }
            break
          case OP.LT:
            for (const operand of operands) {
              if (operand < filter.rightOperand) {
                matches = true
                break
              }
            }
            break
          case OP.GTE:
            for (const operand of operands) {
              if (operand >= filter.rightOperand) {
                matches = true
                break
              }
            }
            break
          case OP.LTE:
            for (const operand of operands) {
              if (operand <= filter.rightOperand) {
                matches = true
                break
              }
            }
            break
          case OP.IN:
            for (const operand of operands) {
              if ((filter.rightOperand as any[]).indexOf(operand) >= 0) {
                matches = true
                break
              }
            }
            break
          case OP.STARTS_WITH:
            for (const operand of operands) {
              if ((operand as string).startsWith(filter.rightOperand as string)) {
                matches = true
                break
              }
            }
            break
          default:
            throw new Error(`unexpected operator ${operator}`)
        }

      } else {
        const { rightOperator, leftOperator, rightOperand, leftOperand } = filter as TernaryFilter
        for (const operand of operands) {
          let rightMatches = false
          let leftMatches = false
          if (rightOperator === OP.LTE && operand <= rightOperand) {
            rightMatches = true
          } else if (rightOperator === OP.LT && operand < rightOperand) {
            rightMatches = true
          }

          if (leftOperator === OP.GTE && operand >= leftOperand) {
            leftMatches = true
          } else if (leftOperator === OP.GT && operand > leftOperand) {
            leftMatches = true
          }

          if (rightMatches && leftMatches) {
            matches = true
            break
          }
        }
      }

      if (!matches) {
        return false
      }
    }
    return true
  }
}

export const coerceFilterChainOperands = (filterChain: (BinaryFilter | TernaryFilter)[]) => {
  const result: (BinaryFilter | TernaryFilter)[] = []
  if (filterChain.length) {
    // convert operands by type
    for (const filter of filterChain) {
      const dataType: string = filter.type
      if (dataType === 'datetime') {
        if ((filter as TernaryFilter).leftOperand !== undefined) {
          result.push({
            ...filter,
            rightOperand: new Date(filter.rightOperand as string).getTime(),
            leftOperand: new Date((filter as TernaryFilter).leftOperand as string).getTime(),
          })
        } else {
          if (Array.isArray(filter.rightOperand)) {
            result.push({
              ...filter,
              rightOperand: (filter.rightOperand as string[]).map(operand => new Date(operand).getTime())
            })
          } else {
            result.push({
              ...filter,
              rightOperand: new Date(filter.rightOperand as string).getTime(),
            })
          }
        }
      } else {
        result.push({ ...filter })
      }
    }
  }

  return result
}

export const makeFilterSuffixes = (filterChain: (BinaryFilter | TernaryFilter)[], index: IndexDefinition): { left?: string, right?: string } | undefined => {
  if (filterChain && filterChain.length) {
    const indexFields = index.fields.map(field => field.name)
    const orderedFilterChain = []
    for (const filter of filterChain) {
      const idx = indexFields.indexOf(filter.pathExpression)
      if (idx === -1) {
        // filter chain path expression not present on index
        return
      }

      if ((filter as BinaryFilter).operator && (filter as BinaryFilter).operator === OP.IN) {
        // Indexes do not support filtering with IN operator
        return
      }

      orderedFilterChain[idx] = filter
    }

    const baseFragments = []
    let rightSuffix
    let leftSuffix
    let ternaryFilter = false
    if (orderedFilterChain[filterChain.length - 1] && !orderedFilterChain[filterChain.length - 1].operator) {
      ternaryFilter = true
    }
    for (const [i, filter] of Object.entries(filterChain)) {
      if (Number(i) < indexFields.length - 1) {
        if (!(filter as BinaryFilter).operator) {
          // Lower order fields can not use TernaryFilter
          return
        }

        // Lower order fields must use equality operator
        const binaryFilter: BinaryFilter = filter as BinaryFilter
        if (binaryFilter.operator !== OP.EQ) {
          return
        }

        if (!orderedFilterChain[i]) {
          // ensure no gaps in the prefix
          return
        }

        baseFragments.push(orderedFilterChain[i].rightOperand)
      } else {
        if (ternaryFilter) {
          leftSuffix = orderedFilterChain[i].leftOperand
          rightSuffix = orderedFilterChain[i].rightOperand
        } else {
          const op = orderedFilterChain[i].operator
          const operand = orderedFilterChain[i].rightOperand
          if (op === OP.LT || op === OP.LTE) {
            rightSuffix = operand
          } else if (op === OP.GT || op === OP.GTE) {
            leftSuffix = operand
          } else {
            // STARTS_WITH or EQ
            rightSuffix = operand
            leftSuffix = operand
          }
        }
      }
    }

    return {
      left: leftSuffix && [...baseFragments, leftSuffix].join(':') || undefined,
      right: rightSuffix && [...baseFragments, rightSuffix].join(':') || undefined
    }
  } else {
    return {}
  }
}

export const makeKeyForField = (definition: IndexDefinition, data: object): string | null => {
  const valueParts = []
  for (const field of definition.fields) {
    if (field.name in data) {
      // TODO I think these dates are ISO 8601 so I don't think we need to convert to numbers
      valueParts.push(String(field.type === 'datetime' ? new Date(data[field.name]).getTime() : data[field.name]))
    } else {
      return null // tell caller that one of the fields is missing and we can't index
    }
  }

  return valueParts.join(':')
}