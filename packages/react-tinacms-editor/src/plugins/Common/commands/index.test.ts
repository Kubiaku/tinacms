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

import { PMTestHarness } from '../../../test-utils'
import { defaultSchema } from '../../../test-utils/test-schema'
import { insertHr, insertBr } from '.'

const { forDoc, doc, p, text, hr, br } = new PMTestHarness(defaultSchema)

describe('insertHr', () => {
  it('should insert an hr at the cursor', () => {
    //         0       12345
    forDoc(doc(p(text('test'))))
      .withTextSelection(3)
      .apply(insertHr)
      .expect(doc(p(text('te')), hr(), p(text('st'))))
  })

  it('should replace selection with HR', () => {
    //         0       12345
    forDoc(doc(p(text('test'))))
      .withTextSelection(2, 4) // [2, 4)
      .apply(insertHr)
      .expect(doc(p(text('t')), hr(), p(text('t'))))
  })
})

describe('insertBr', () => {
  it('should insert an br at the cursor', () => {
    //         0       12345
    forDoc(doc(p(text('test'))))
      .withTextSelection(3)
      .apply(insertBr)
      .expect(doc(p(text('te')), br(), p(text('st'))))
  })

  it('should replace selection with HR', () => {
    //         0       12345
    forDoc(doc(p(text('test'))))
      .withTextSelection(2, 4) // [2, 4)
      .apply(insertBr)
      .expect(doc(p(text('t')), br(), p(text('t'))))
  })
})
