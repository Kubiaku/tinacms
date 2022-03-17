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

import * as React from 'react'
import { useCMS } from '../../../../react-tinacms/use-cms'
import ReferenceSelect from './ReferenceSelect'
import ReferenceLink from './ReferenceLink'

type Option = {
  value: string
  label: string
}

export interface ReferenceFieldProps {
  label?: string
  name: string
  component: string
  collections: string[]
  options: (Option | string)[]
}

export interface ReferenceProps {
  name: string
  input: any
  field: ReferenceFieldProps
  disabled?: boolean
  options?: (Option | string)[]
}

export const Reference: React.FC<ReferenceProps> = ({ input, field }) => {
  const cms = useCMS()

  return (
    <div>
      <div className="relative group">
        <ReferenceSelect cms={cms} input={input} field={field} />
      </div>
      <ReferenceLink cms={cms} input={input} />
    </div>
  )
}
