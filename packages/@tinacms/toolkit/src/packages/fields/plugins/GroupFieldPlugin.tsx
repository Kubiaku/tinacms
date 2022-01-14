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
import { Field, Form } from '../../forms'
import styled, { keyframes, css } from 'styled-components'
import { FieldsBuilder, useFormPortal, FormWrapper } from '../../form-builder'
import { useCMS } from '../../react-core/use-cms'
import { BiPencil } from 'react-icons/bi'
import { IoMdClose } from 'react-icons/io'

export interface GroupFieldDefinititon extends Field {
  component: 'group'
  fields: Field[]
}

export interface GroupProps {
  input: any
  meta: any
  field: GroupFieldDefinititon
  form: any
  tinaForm: Form
}

export const Group = ({ tinaForm, field }: GroupProps) => {
  const cms = useCMS()
  const [isExpanded, setExpanded] = React.useState<boolean>(false)
  return (
    <>
      <Header
        onClick={() => {
          const state = tinaForm.finalForm.getState()
          if (state.invalid === true) {
            // @ts-ignore
            cms.alerts.error('Cannot navigate away from an invalid form.')
            return
          }

          setExpanded((p) => !p)
        }}
      >
        {field.label || field.name}
      </Header>
      <Panel
        isExpanded={isExpanded}
        setExpanded={setExpanded}
        field={field}
        tinaForm={tinaForm}
      />
    </>
  )
}

interface PanelProps {
  setExpanded(next: boolean): void
  isExpanded: boolean
  tinaForm: Form
  field: GroupFieldDefinititon
  children?: any
}
const Panel = function Panel({
  setExpanded,
  isExpanded,
  tinaForm,
  field,
}: PanelProps) {
  const cms = useCMS()
  const FormPortal = useFormPortal()
  const fields: any[] = React.useMemo(() => {
    return field.fields.map((subField: any) => ({
      ...subField,
      name: `${field.name}.${subField.name}`,
    }))
  }, [field.fields, field.name])

  return (
    <FormPortal>
      {({ zIndexShift }) => (
        <GroupPanel
          isExpanded={isExpanded}
          style={{ zIndex: zIndexShift + 1000 }}
        >
          <PanelHeader
            onClick={() => {
              const state = tinaForm.finalForm.getState()
              if (state.invalid === true) {
                // @ts-ignore
                cms.alerts.error('Cannot navigate away from an invalid form.')
                return
              }

              setExpanded(false)
            }}
          >
            {field.label || field.name}
          </PanelHeader>
          <PanelBody id={tinaForm.id}>
            {isExpanded ? (
              <FieldsBuilder form={tinaForm} fields={fields} />
            ) : null}
          </PanelBody>
        </GroupPanel>
      )}
    </FormPortal>
  )
}

const Header = ({ onClick, children }) => {
  return (
    <div className="pt-1 mb-5">
      <button
        onClick={onClick}
        className="group px-4 py-3 bg-white hover:bg-gray-50 shadow focus:shadow-outline focus:border-blue-500 w-full border border-gray-100 hover:border-gray-200 text-gray-500 hover:text-blue-400 focus:text-blue-500 rounded-md flex justify-between items-center gap-2"
      >
        <span className="text-left text-base font-medium overflow-hidden overflow-ellipsis whitespace-nowrap flex-1">
          {children}
        </span>{' '}
        <BiPencil className="h-6 w-auto transition-opacity duration-150 ease-out opacity-80 group-hover:opacity-90" />
      </button>
    </div>
  )
}

export const PanelHeader = ({ onClick, children }) => {
  return (
    <button
      className={`relative z-40 group text-left w-full bg-white hover:bg-gray-50 py-3 border-t border-b shadow-sm
       border-gray-100 px-6 -mt-px`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3 text-xs tracking-wide font-medium text-gray-700 group-hover:text-blue-400 uppercase">
        {children}
        <IoMdClose className="h-auto w-5 inline-block opacity-70 -mt-0.5 -mx-0.5" />
      </div>
    </button>
  )
}

export const PanelBody = ({ id, children }) => {
  return (
    <div
      style={{
        flex: '1 1 0%',
        width: '100%',
        overflowY: 'auto',
        background: 'var(--tina-color-grey-1)',
      }}
    >
      <FormWrapper id={id}>{children}</FormWrapper>
    </div>
  )
}

const GroupPanelKeyframes = keyframes`
  0% {
    transform: translate3d( 100%, 0, 0 );
  }
  100% {
    transform: translate3d( 0, 0, 0 );
  }
`

export const GroupPanel = styled.div<{ isExpanded: boolean }>`
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  z-index: var(--tina-z-index-1);
  pointer-events: ${(p) => (p.isExpanded ? 'all' : 'none')};

  > * {
    ${(p) =>
      p.isExpanded &&
      css`
        animation-name: ${GroupPanelKeyframes};
        animation-duration: 150ms;
        animation-delay: 0;
        animation-iteration-count: 1;
        animation-timing-function: ease-out;
        animation-fill-mode: backwards;
      `};

    ${(p) =>
      !p.isExpanded &&
      css`
        transition: transform 150ms ease-out;
        transform: translate3d(100%, 0, 0);
      `};
  }
`

export interface GroupFieldProps {
  field: Field
}

export function GroupField(props: GroupFieldProps) {
  return <div>Subfield: {props.field.label || props.field.name}</div>
}

export const GroupFieldPlugin = {
  name: 'group',
  Component: Group,
}
