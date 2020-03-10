/**

Copyright 2019 Forestry.io Inc

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

import { Plugin } from '@tinacms/core'
import * as React from 'react'
import { Schema } from 'prosemirror-model'
import { SchemaNodePlugin, SchemaMarkPlugin } from './plugins'

export function useProsemirrorSchema(plugins: Plugin[]) {
  const schema = React.useMemo(() => {
    return new Schema({
      nodes: getNodes(plugins as any),
      marks: getMarks(plugins as any),
    })
  }, [plugins])

  return [schema]
}

function getNodes(plugins: SchemaNodePlugin[]) {
  const nodes: any = {}

  plugins
    .filter(plugin => plugin.__type === 'wysiwyg:schema:node')
    .forEach((plugin: SchemaNodePlugin) => {
      nodes[plugin.name] = plugin.node
    })

  return nodes
}

function getMarks(plugins: SchemaMarkPlugin[]) {
  const marks: any = {}

  plugins
    .filter(plugin => plugin.__type === 'wysiwyg:schema:mark')
    .forEach((plugin: SchemaMarkPlugin) => {
      marks[plugin.name] = plugin.mark
    })

  return marks
}
