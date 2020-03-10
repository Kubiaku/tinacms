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

import * as React from 'react'
import styled from 'styled-components'
import { InlineField } from './inline-field'
import { InputFocusWrapper } from './inline-field-textarea'

/**
 * InlineTextField
 */
export interface InlineTextFieldProps {
  name: string
  className?: string
}

export function InlineTextField({ name, className }: InlineTextFieldProps) {
  return (
    <InlineField name={name}>
      {({ input, status }) => {
        if (status === 'active') {
          return (
            <InputFocusWrapper>
              <Input type="text" {...input} className={className} />
            </InputFocusWrapper>
          )
        }
        return <>{input.value}</>
      }}
    </InlineField>
  )
}

const Input = styled.input`
  /*
** TODO - add styles
*/
`
