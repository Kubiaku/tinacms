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

import React from 'react'
import { StyleReset, Button as TinaButton } from '@tinacms/styles'
import {
  Modal,
  ModalPopup,
  ModalBody,
  ModalActions,
  ModalHeader,
} from 'tinacms'

export interface ActionableModalOptions {
  title: string
  message: string
  actions: Array<{ name: string; action(): void; primary?: boolean }>
}

export const ActionableModal = ({
  title,
  message,
  actions,
}: ActionableModalOptions) => {
  if (!open) {
    return null
  }

  return (
    <StyleReset>
      <Modal>
        <ModalPopup>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody padded>
            <p>{message}</p>
          </ModalBody>
          <ModalActions>
            {actions.map((action) => (
              <TinaButton
                key="name"
                primary={action.primary}
                onClick={action.action}
              >
                {action.name}
              </TinaButton>
            ))}
          </ModalActions>
        </ModalPopup>
      </Modal>
    </StyleReset>
  )
}
