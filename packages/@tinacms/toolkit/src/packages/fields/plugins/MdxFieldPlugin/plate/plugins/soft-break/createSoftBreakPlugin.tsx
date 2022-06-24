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
import React from 'react'
import { createPluginFactory } from '@udecode/plate-core'
import { onKeyDownSoftBreak } from './onKeyDownSoftBreak'
import { SoftBreakPlugin } from './types'

export const KEY_SOFT_BREAK = 'break'

/**
 * Insert soft break following configurable rules.
 * Each rule specifies a hotkey and query options.
 */
export const createSoftBreakPlugin = createPluginFactory<SoftBreakPlugin>({
  key: KEY_SOFT_BREAK,
  isElement: true,
  isInline: true,
  isVoid: true,
  component: (props) => {
    return (
      <>
        <br className={props.className} {...props.attributes} />
        {props.children}
      </>
    )
  },
  handlers: {
    onKeyDown: onKeyDownSoftBreak,
  },
  options: {
    rules: [{ hotkey: 'shift+enter' }],
  },
})
