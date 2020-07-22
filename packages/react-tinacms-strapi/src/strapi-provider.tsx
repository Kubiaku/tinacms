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

import React from 'react'
import { StrapiAuthenticationModal } from './strapi-auth-modal'
import { useCMS } from 'tinacms'

interface ProviderProps {
  children: any
  onLogin: () => void
  onLogout: () => void
}
export const StrapiProvider = ({
  children,
  onLogin,
  onLogout,
}: ProviderProps) => {
  const [activeModal, setActiveModal] = useState('none')

  const beginAuth = () => {
    setActiveModal('authenticate')
  }

  const onClose = () => {
    setActiveModal('none')
  }

  const onAuthSuccess = () => {
    onLogin()
    setActiveModal('none')
  }

  useCMSEvent('cms:enable', beginAuth, [])
  useCMSEvent('cms:disable', onLogout, [])

  return (
    <>
      {activeModal === 'authenticate' && (
        <StrapiAuthenticationModal
          close={onClose}
          onAuthSuccess={onAuthSuccess}
        />
      )}
      {children}
    </>
  )
}

function useCMSEvent(event: string, callback: any, deps: React.DependencyList) {
  const cms = useCMS()
  useEffect(function() {
    return cms.events.subscribe(event, callback)
  }, deps)
}
