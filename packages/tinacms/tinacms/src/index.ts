export * from './sidebarProvider'
export * from './modalProvider'
export * from './fields'
export * from './Tina'

import {
  TextInput,
  TextAreaInput,
  ColorPickerField,
  ToggleField,
} from './fields'
import { CMS, Plugin } from '@tinacms/core'
import { FormsView, DummyView } from './views/FormView'

export const cms = new CMS()

// View Plugins
cms.screens.add(FormsView)
cms.screens.add(DummyView)

// Field Plugins
cms.fields.add({
  name: 'text',
  Component: TextInput,
  validate(value: any, values: any, meta: any, field: any) {
    if (field.required && !value) return 'Required'
  },
})

cms.fields.add({
  name: 'textarea',
  Component: TextAreaInput,
})

cms.fields.add({
  name: 'color',
  Component: ColorPickerField,
})

cms.fields.add({
  name: 'toggle',
  type: 'checkbox',
  Component: ToggleField,
})

export interface AddContentPlugin extends Plugin {
  __type: 'content-button'
  onSubmit(value: string, cms: CMS): Promise<void> | void
}
