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

import { Field, Form } from 'react-final-form'
import {
  useCMS,
  Modal,
  ModalActions,
  ModalBody,
  ModalHeader,
  ModalPopup,
  Input,
} from 'tinacms'
import { Button } from '@tinacms/toolkit'
import React, { useState } from 'react'
import { StrapiClient } from './strapi-client'

import styled from 'styled-components'

export interface StrapiAuthenticationModalProps {
  onAuthSuccess(): void
  close(): void
}

export function StrapiAuthenticationModal({
  onAuthSuccess,
  close,
}: StrapiAuthenticationModalProps) {
  const cms = useCMS()
  const [error, setError] = useState<string | undefined>()
  const strapi: StrapiClient = cms.api.strapi

  return (
    <ModalBuilder
      title="Strapi Authentication"
      message="Login with your Strapi account."
      close={close}
      actions={[]}
    >
      <StrapiLoginForm
        close={close}
        onAuthSuccess={onAuthSuccess}
        error={error}
        onSubmit={async (values: LoginFormFieldProps) => {
          strapi
            .authenticate(values.username, values.password)
            .then(async (response: Response) => {
              if (response.status != 200) {
                cms.events.dispatch({ type: 'strapi:error' })
                const responseJson = await response.json()

                setError(
                  `Login failed: ${responseJson.data[0].messages[0].message}`
                )
              } else {
                onAuthSuccess()
              }
            })
            .catch((error) => {
              cms.events.dispatch({ type: 'strapi:error', error })
            })
        }}
      />
    </ModalBuilder>
  )
}

interface ModalBuilderProps {
  title: string
  message: string
  actions: any[]
  close(): void
  children?: any
}

interface LoginFormFieldProps {
  username: string
  password: string
}

interface LoginFormProps {
  onSubmit(values: LoginFormFieldProps): void
  close(): void
  onAuthSuccess(): void
  error: string | undefined
}

export function StrapiLoginForm({ onSubmit, close, error }: LoginFormProps) {
  return (
    <FormWrapper>
      <strong>{error}</strong>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Field
              name="username"
              render={({ input }) => (
                <InputWrapper>
                  <label>
                    <p>Username</p>
                    <Input {...input} />
                  </label>
                </InputWrapper>
              )}
            ></Field>
            <Field
              name="password"
              render={({ input }) => (
                <InputWrapper>
                  <label>
                    <p>Password</p>
                    <Input type="password" {...input} />
                  </label>
                </InputWrapper>
              )}
            ></Field>
            <ModalActions>
              <Button type="button" onClick={close}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </ModalActions>
          </form>
        )}
      ></Form>
    </FormWrapper>
  )
}

export function ModalBuilder(modalProps: ModalBuilderProps) {
  return (
    <Modal>
      <ModalPopup>
        <ModalHeader close={modalProps.close}>{modalProps.title}</ModalHeader>
        <ModalBody padded>
          <p>{modalProps.message}</p>
          {modalProps.children}
        </ModalBody>
      </ModalPopup>
    </Modal>
  )
}

const FormWrapper = styled.div`
  padding: 16px;
  border-radius: 48px;
`

const InputWrapper = styled.div`
  padding-bottom: 16px;
`
