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

import { useEffect, useState } from 'react'
import { useCMS } from 'tinacms'
import { useOpenAuthoring } from '../open-authoring/OpenAuthoringProvider'
import { getModalProps } from './github-interpeter'
import React from 'react'
import {
  ActionableModalOptions,
  ActionableModal,
} from '../open-authoring-ui/components/ActionableModal'

interface OpenAuthoringError extends Error {
  status: number
  message: string
}

interface Props {
  error: OpenAuthoringError
}

// When an open authoring error is caught, we don't immedietly know the cause
// We have to perform a few extra checks and render a modal with options
const OpenAuthoringErrorModal = (props: Props) => {
  const [
    errorModalProps,
    setErrorModalProps,
  ] = useState<ActionableModalOptions | null>(null)
  const { github } = useCMS().api

  const openAuthoring = useOpenAuthoring()

  useEffect(() => {
    ;(async () => {
      if (props.error) {
        const modalProps = await getModalProps(
          props.error,
          github,
          openAuthoring.enterEditMode,
          openAuthoring.exitEditMode
        )
        setErrorModalProps(modalProps)
      } else {
        setErrorModalProps(null)
      }
    })()
  }, [props.error, openAuthoring.enterEditMode])

  if (!errorModalProps) {
    return null
  }

  return <ActionableModal {...errorModalProps} />
}

export default OpenAuthoringErrorModal
