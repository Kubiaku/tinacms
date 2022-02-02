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
import styled, { css } from 'styled-components'
import { FieldsBuilder, useFormPortal } from '../../form-builder'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { AddIcon, DragIcon, ReorderIcon } from '../../icons'
import { GroupPanel, PanelHeader, PanelBody } from './GroupFieldPlugin'
import { Dismissible } from '../../react-dismissible'
import { IconButton } from '../../styles'
import { Popover, Transition } from '@headlessui/react'
import { FieldDescription } from './wrapFieldWithMeta'
import {
  GroupListHeader,
  GroupListMeta,
  GroupLabel,
  ItemDeleteButton,
  ItemHeader,
  ListPanel,
} from './GroupListFieldPlugin'
import { useCMS } from '../../react-core/use-cms'
import { useEvent } from '../../react-core'
import { FieldHoverEvent, FieldFocusEvent } from '../field-events'

export interface BlocksFieldDefinititon extends Field {
  component: 'blocks'
  templates: {
    [key: string]: BlockTemplate
  }
}

export interface BlockTemplate {
  label: string
  defaultItem?: object | (() => object)
  fields?: Field[]
  /**
   * An optional function which generates `props` for
   * this items's `li`.
   */
  itemProps?: (item: object) => {
    /**
     * The `key` property used to optimize the rendering of lists.
     *
     * If rendering is causing problems, use `defaultItem` to
     * generate a unique key for the item.
     *
     * Reference:
     * * https://reactjs.org/docs/lists-and-keys.html
     */
    key?: string
    /**
     * The label to be display on the list item.
     */
    label?: string
  }
}

interface BlockFieldProps {
  input: any
  meta: any
  field: BlocksFieldDefinititon
  form: any
  tinaForm: Form
}

const Blocks = ({ tinaForm, form, field, input }: BlockFieldProps) => {
  const addItem = React.useCallback(
    (name: string, template: BlockTemplate) => {
      let obj: any = {}
      if (typeof template.defaultItem === 'function') {
        obj = template.defaultItem()
      } else {
        obj = template.defaultItem || {}
      }
      obj._template = name
      form.mutators.insert(field.name, 0, obj)
    },
    [field.name, form.mutators]
  )

  const showFilter = React.useMemo(() => {
    return Object.entries(field.templates).length > 6
  }, [field.templates])
  const [filter, setFilter] = React.useState('')
  const filteredBlocks = React.useMemo(() => {
    return Object.entries(field.templates).filter(([name, template]) => {
      return (
        template.label.toLowerCase().includes(filter.toLowerCase()) ||
        name.toLowerCase().includes(filter.toLowerCase())
      )
    })
  }, [filter])

  const items = input.value || []

  return (
    <>
      <GroupListHeader>
        <GroupListMeta>
          <GroupLabel>{field.label || field.name}</GroupLabel>
          {field.description && (
            <FieldDescription>{field.description}</FieldDescription>
          )}
        </GroupListMeta>
        <Popover>
          {({ open }) => (
            <>
              <Popover.Button as={React.Fragment}>
                <IconButton
                  variant={open ? 'secondary' : 'primary'}
                  size="small"
                  className={`${open ? `rotate-45 pointer-events-none` : ``}`}
                >
                  <AddIcon className="w-5/6 h-auto" />
                </IconButton>
              </Popover.Button>
              <div className="transform translate-y-full absolute -bottom-1 right-0 z-50">
                <Transition
                  enter="transition duration-150 ease-out"
                  enterFrom="transform opacity-0 -translate-y-2"
                  enterTo="transform opacity-100 translate-y-0"
                  leave="transition duration-75 ease-in"
                  leaveFrom="transform opacity-100 translate-y-0"
                  leaveTo="transform opacity-0 -translate-y-2"
                >
                  <Popover.Panel className="relative overflow-hidden rounded-lg shadow-lg bg-white border border-gray-100">
                    <div className="min-w-[192px] max-h-[24rem] overflow-y-auto flex flex-col w-full h-full">
                      {showFilter && (
                        <div className="sticky top-0 bg-gray-50 p-2 border-b border-gray-100 z-10">
                          <input
                            type="text"
                            className="bg-white text-xs rounded-sm border border-gray-100 shadow-inner py-1 px-2 w-full block placeholder-gray-200"
                            onClick={(event: any) => {
                              event.stopPropagation()
                              event.preventDefault()
                            }}
                            value={filter}
                            onChange={(event: any) => {
                              setFilter(event.target.value)
                            }}
                            placeholder="Filter..."
                          />
                        </div>
                      )}
                      {filteredBlocks.map(([name, template]) => (
                        <button
                          className="relative text-center text-xs py-2 px-4 border-l-0 border-t-0 border-r-0 border-b border-gray-50 w-full outline-none transition-all ease-out duration-150 hover:text-blue-500 focus:text-blue-500 focus:bg-gray-50 hover:bg-gray-50"
                          key={name}
                          onClick={() => {
                            addItem(name, template)
                            setFilter('')
                          }}
                        >
                          {template.label}
                        </button>
                      ))}
                    </div>
                  </Popover.Panel>
                </Transition>
              </div>
            </>
          )}
        </Popover>
      </GroupListHeader>
      <ListPanel>
        <Droppable droppableId={field.name} type={field.name}>
          {(provider) => (
            <div ref={provider.innerRef} className="edit-page--list-parent">
              {items.length === 0 && <EmptyState />}
              {items.map((block: any, index: any) => {
                const template = field.templates[block._template]

                if (!template) {
                  return (
                    <InvalidBlockListItem
                      // NOTE: Supressing warnings, but not helping with render perf
                      key={index}
                      index={index}
                      field={field}
                      tinaForm={tinaForm}
                    />
                  )
                }

                const itemProps = (item: object) => {
                  if (!template.itemProps) return {}
                  return template.itemProps(item)
                }
                return (
                  <BlockListItem
                    // NOTE: Supressing warnings, but not helping with render perf
                    key={index}
                    block={block}
                    template={template}
                    index={index}
                    field={field}
                    tinaForm={tinaForm}
                    {...itemProps(block)}
                  />
                )
              })}
              {provider.placeholder}
            </div>
          )}
        </Droppable>
      </ListPanel>
    </>
  )
}

const EmptyState = () => <EmptyList>There are no items</EmptyList>

interface BlockListItemProps {
  tinaForm: Form
  field: BlocksFieldDefinititon
  index: number
  block: any
  template: BlockTemplate
  label?: string
}

const BlockListItem = ({
  label,
  tinaForm,
  field,
  index,
  template,
  block,
}: BlockListItemProps) => {
  const cms = useCMS()
  const FormPortal = useFormPortal()
  const [isExpanded, setExpanded] = React.useState<boolean>(false)

  const removeItem = React.useCallback(() => {
    tinaForm.mutators.remove(field.name, index)
  }, [tinaForm, field, index])

  const { dispatch: setHoveredField } = useEvent<FieldHoverEvent>('field:hover')
  const { dispatch: setFocusedField } = useEvent<FieldFocusEvent>('field:focus')

  return (
    <Draggable
      key={index}
      type={field.name}
      draggableId={`${field.name}.${index}`}
      index={index}
    >
      {(provider, snapshot) => (
        <>
          <ItemHeader
            ref={provider.innerRef}
            isDragging={snapshot.isDragging}
            {...provider.draggableProps}
            {...provider.dragHandleProps}
          >
            <DragHandle />
            <ItemClickTarget
              onClick={() => {
                const state = tinaForm.finalForm.getState()
                if (state.invalid === true) {
                  // @ts-ignore
                  cms.alerts.error('Cannot navigate away from an invalid form.')
                  return
                }

                setExpanded(true)
                setFocusedField({ fieldName: `${field.name}.${index}` })
              }}
              onMouseOver={() =>
                setHoveredField({ fieldName: `${field.name}.${index}` })
              }
              onMouseOut={() => setHoveredField({ fieldName: null })}
            >
              <GroupLabel>{label || template.label}</GroupLabel>
            </ItemClickTarget>
            <ItemDeleteButton onClick={removeItem} />
          </ItemHeader>
          <FormPortal>
            {({ zIndexShift }) => (
              <Panel
                zIndexShift={zIndexShift}
                isExpanded={isExpanded}
                setExpanded={setExpanded}
                field={field}
                item={block}
                index={index}
                tinaForm={tinaForm}
                label={label || template.label}
                template={template}
              />
            )}
          </FormPortal>
        </>
      )}
    </Draggable>
  )
}

const InvalidBlockListItem = ({
  tinaForm,
  field,
  index,
}: {
  tinaForm: Form
  field: Field
  index: number
}) => {
  const removeItem = React.useCallback(() => {
    tinaForm.mutators.remove(field.name, index)
  }, [tinaForm, field, index])

  return (
    <Draggable
      key={index}
      type={field.name}
      draggableId={`${field.name}.${index}`}
      index={index}
    >
      {(provider, snapshot) => (
        <ItemHeader
          ref={provider.innerRef}
          isDragging={snapshot.isDragging}
          {...provider.draggableProps}
          {...provider.dragHandleProps}
        >
          <DragHandle />
          <ItemClickTarget>
            <GroupLabel error>Invalid Block</GroupLabel>
          </ItemClickTarget>
          <ItemDeleteButton onClick={removeItem} />
        </ItemHeader>
      )}
    </Draggable>
  )
}

const EmptyList = styled.div`
  text-align: center;
  border-radius: var(--tina-radius-small);
  background-color: var(--tina-color-grey-2);
  color: var(--tina-color-grey-4);
  line-height: 1.35;
  padding: 12px 0;
  font-size: var(--tina-font-size-2);
  font-weight: var(--tina-font-weight-regular);
`

const ItemClickTarget = styled.div`
  flex: 1 1 0;
  min-width: 0;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
`

const DragHandle = styled(function DragHandle({ ...styleProps }) {
  return (
    <div {...styleProps}>
      <DragIcon className="w-7 h-auto" />
      <ReorderIcon className="w-7 h-auto" />
    </div>
  )
})`
  margin: 0;
  flex: 0 0 auto;
  width: 32px;
  position: relative;
  fill: inherit;
  padding: 12px 0;
  transition: all 85ms ease-out;
  &:hover {
    background-color: var(--tina-color-grey-1);
    cursor: grab;
  }
  svg {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 20px;
    height: 20px;
    transform: translate3d(-50%, -50%, 0);
    transition: all var(--tina-timing-short) ease-out;
  }
  svg:last-child {
    opacity: 0;
  }
  *:hover > & {
    svg:first-child {
      opacity: 0;
    }
    svg:last-child {
      opacity: 1;
    }
  }
`

interface PanelProps {
  setExpanded(next: boolean): void
  isExpanded: boolean
  tinaForm: Form
  index: number
  field: BlocksFieldDefinititon
  item: any
  label: string
  template: BlockTemplate
  zIndexShift: number
}

const Panel = function Panel({
  setExpanded,
  isExpanded,
  tinaForm,
  field,
  index,
  label,
  template,
  zIndexShift,
}: PanelProps) {
  const cms = useCMS()

  const fields: any[] = React.useMemo(() => {
    if (!template.fields) return []

    return template.fields.map((subField: any) => ({
      ...subField,
      name: `${field.name}.${index}.${subField.name}`,
    }))
  }, [field.name, index, template.fields])

  return (
    <GroupPanel isExpanded={isExpanded} style={{ zIndex: zIndexShift + 100 }}>
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
        {label}
      </PanelHeader>
      <PanelBody id={tinaForm.id}>
        {/* RENDER OPTIMIZATION: Only render fields of expanded fields.  */}
        {isExpanded ? <FieldsBuilder form={tinaForm} fields={fields} /> : null}
      </PanelBody>
    </GroupPanel>
  )
}

export const BlocksField = Blocks

export const BlocksFieldPlugin = {
  name: 'blocks',
  Component: BlocksField,
}
