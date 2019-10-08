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
import { FormBuilder, FieldsBuilder } from '@tinacms/form-builder'
import { useCMS, useSubscribable } from '@tinacms/react-tinacms'
import { useState } from 'react'
import { Form } from '@tinacms/core'
import styled, { keyframes, css } from 'styled-components'
import { Button, padding, color, font } from '@tinacms/styles'
import { ActionsMenu } from './ActionsMenu'
import FormsList from './FormsList'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { LeftArrowIcon } from '@tinacms/icons'
import { ResetForm } from './ResetForm'
import { FORM_HEADER_HEIGHT } from '../Globals'

export const FormsView = () => {
  const [activeFormId, setActiveFormId] = useState<string>()
  const cms = useCMS()

  /**
   * If there's only one form, make it the active form.
   */
  useSubscribable(cms.forms, () => {
    if (cms.forms.all().length === 1) {
      setActiveFormId(cms.forms.all()[0].id)
    }
  })

  const forms = cms.forms.all()
  const activeForm = activeFormId ? cms.forms.findForm(activeFormId) : null

  const isEditing = !!activeForm

  const moveArrayItem = React.useCallback(
    (result: DropResult) => {
      const form = activeForm!.finalForm
      if (!result.destination) return
      const name = result.type
      form.mutators.move(name, result.source.index, result.destination.index)
    },
    [activeForm]
  )

  /**
   * No Forms
   */
  if (!forms.length) {
    return <NoFormsPlaceholder />
  }

  if (!activeForm) {
    return (
      <FormsList
        isEditing={isEditing}
        forms={forms}
        setActiveFormId={setActiveFormId}
      />
    )
  }

  return (
    <FormBuilder form={activeForm as any}>
      {({ handleSubmit, pristine, form }) => {
        return (
          <DragDropContext onDragEnd={moveArrayItem}>
            <FormWrapper isEditing={isEditing}>
              <FormHeader
                isMultiform={forms.length > 1}
                activeForm={activeForm}
                setActiveFormId={setActiveFormId}
              />
              <FormBody>
                {activeForm &&
                  (activeForm.fields.length ? (
                    <FieldsBuilder
                      form={activeForm}
                      fields={activeForm.fields}
                    />
                  ) : (
                    <NoFieldsPlaceholder />
                  ))}
              </FormBody>
              <FormFooter>
                {activeForm.reset && (
                  <ResetForm
                    pristine={pristine}
                    reset={async () => {
                      form.reset()
                      await activeForm.reset!()
                    }}
                  />
                )}
                <Button
                  onClick={() => handleSubmit()}
                  disabled={pristine}
                  primary
                  grow
                  margin
                >
                  Save
                </Button>
                {activeForm.actions.length > 0 && (
                  <ActionsMenu actions={activeForm.actions} />
                )}
              </FormFooter>
            </FormWrapper>
          </DragDropContext>
        )
      }}
    </FormBuilder>
  )
}

const Emoji = styled.span`
  font-size: 2.5rem;
  line-height: 1;
  display: inline-block;
`

const EmptyState = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${padding()} ${padding()} 4rem ${padding()};
  width: 100%;
  height: 100%;
  overflow-y: auto;
  > *:first-child {
    margin: 0 0 ${padding()} 0;
  }
  > ${Emoji} {
    display: block;
  }
  h3 {
    font-size: ${font.size(5)};
    font-weight: normal;
    color: inherit;
    display: block;
    margin: 0 0 ${padding()} 0;
    ${Emoji} {
      font-size: 1em;
    }
  }
  p {
    display: block;
    margin: 0 0 ${padding()} 0;
  }
`

const LinkButton = styled.a`
  text-align: center;
  border: 0;
  border-radius: ${p => p.theme.radius.big};
  border: 1px solid ${color.grey(2)};
  box-shadow: ${p => p.theme.shadow.small};
  font-weight: 500;
  cursor: pointer;
  font-size: ${font.size(0)};
  transition: all ${p => p.theme.timing.short} ease-out;
  background-color: white;
  color: ${color.grey(8)};
  padding: ${padding('small')} ${padding('big')} ${padding('small')} 3.5rem;
  position: relative;
  text-decoration: none;
  display: inline-block;
  ${Emoji} {
    font-size: 1.5rem;
    position: absolute;
    left: ${padding('big')};
    top: 50%;
    transform-origin: 50% 50%;
    transform: translate3d(0, -50%, 0);
    transition: all ${p => p.theme.timing.short} ease-out;
  }
  &:hover {
    color: ${color.primary()};
    ${Emoji} {
      transform: translate3d(0, -50%, 0);
    }
  }
`

const NoFormsPlaceholder = () => (
  <EmptyState>
    <Emoji>👋</Emoji>
    <h3>
      Welcome to <b>Tina</b>!
    </h3>
    <p>
      Let's get a form set up
      <br />
      so you can start editing.
    </p>
    <p>
      <LinkButton
        href="https://github.com/tinacms/tinacms-site/blob/master/content/docs/gatsby/content-editing.md"
        target="_blank"
      >
        <Emoji>📖</Emoji> Form Setup Guide
      </LinkButton>
    </p>
  </EmptyState>
)

const NoFieldsPlaceholder = () => (
  <EmptyState>
    <Emoji>🤔</Emoji>
    <h3>Hey, you don't have any fields added to this form.</h3>
    <p>
      <LinkButton
        href="https://github.com/tinacms/tinacms-site/blob/master/docs/gatsby/content-editing.md"
        target="_blank"
      >
        <Emoji>📖</Emoji> Field Setup Guide
      </LinkButton>
    </p>
  </EmptyState>
)

interface FormHeaderProps {
  activeForm: Form
  setActiveFormId(id?: string): void
  isMultiform: boolean
}

const FormHeader = styled(
  ({
    activeForm,
    setActiveFormId,
    isMultiform,
    ...styleProps
  }: FormHeaderProps) => {
    return (
      <div {...styleProps} onClick={() => isMultiform && setActiveFormId()}>
        {isMultiform && <LeftArrowIcon />}
        <span>{activeForm.label}</span>
      </div>
    )
  }
)`
  position: relative;
  width: 100%;
  height: ${FORM_HEADER_HEIGHT}rem;
  flex: 0 0 ${FORM_HEADER_HEIGHT}rem;
  cursor: ${p => p.isMultiform && 'pointer'};
  background-color: white;
  border-bottom: 1px solid ${color.grey(2)};
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  padding: 0 ${padding()} ${padding('small')} ${padding()};
  color: inherit;
  font-size: ${font.size(5)};
  transition: color 250ms ease-out;
  user-select: none;
  span {
    flex: 1 1 auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  svg {
    flex: 0 0 auto;
    width: 1.5rem;
    fill: ${color.grey(3)};
    height: auto;
    transform: translate3d(-4px, 0, 0);
    transition: transform 150ms ease-out;
  }
  :hover {
    color: ${p => p.isMultiform && `${p.theme.color.primary}`};
    svg {
      fill: ${color.grey(8)};
      transform: translate3d(-7px, 0, 0);
      transition: transform 250ms ease;
    }
  }
`

export const FormBody = styled.div`
  position: relative;
  flex: 1 1 auto;
  scrollbar-width: none;
  width: 100%;
  overflow: hidden;
  background-color: #f6f6f9;
`

const FormFooter = styled.div`
  position: relative;
  flex: 0 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 4rem;
  background-color: white;
  border-top: 1px solid ${color.grey(2)};
  padding: 0 1rem;
`

const FormAnimationKeyframes = keyframes`
  0% {
    transform: translate3d( 100%, 0, 0 );
  }
  100% {
    transform: translate3d( 0, 0, 0 );
  }
`

const FormWrapper = styled.div<{ isEditing: Boolean }>`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  overflow: hidden;
  height: 100%;
  width: 100%;
  position: relative;
  ${FormHeader}, ${FormBody}, ${FormFooter} {
    transform: translate3d(100%, 0, 0);
  }
  ${p =>
    p.isEditing &&
    css`
      ${FormHeader}, ${FormBody}, ${FormFooter} {
        transform: none;
        animation-name: ${FormAnimationKeyframes};
        animation-duration: 150ms;
        animation-delay: 0;
        animation-iteration-count: 1;
        animation-timing-function: ease-out;
      }
    `};
`

export const SaveButton = styled(Button)`
  flex: 1.5 0 auto;
  padding: 0.75rem 1.5rem;
`
