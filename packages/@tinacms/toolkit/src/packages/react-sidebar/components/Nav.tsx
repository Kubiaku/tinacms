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
import { BiExit } from 'react-icons/bi'
import { FiMoreVertical } from 'react-icons/fi'
import { ImFilesEmpty } from 'react-icons/im'
import { Menu, Transition } from '@headlessui/react'
import { SidebarContext } from './Sidebar'

interface NavProps {
  children?: any
  className?: string
  userName?: string
  screens?: any
}

export const Nav = ({
  className = '',
  children,
  screens,
  ...props
}: NavProps) => {
  const { sidebarWidth } = React.useContext(SidebarContext)

  return (
    <div
      className={`relative z-30 flex flex-col bg-white border-r border-gray-200 w-96 h-full ${className}`}
      style={{ maxWidth: sidebarWidth + 'px' }}
      {...props}
    >
      <div className="border-b border-gray-200">
        <Menu as="div" className="relative block">
          {({ open }) => (
            <div>
              <Menu.Button
                className={`group w-full px-6 py-3 flex justify-between items-center transition-colors duration-150 ease-out ${
                  open ? `bg-gray-50` : `bg-transparent`
                }`}
              >
                <span className="text-left inline-flex items-center text-xl tracking-wide text-gray-800 flex-1 gap-1 opacity-80 group-hover:opacity-100 transition-opacity duration-150 ease-out">
                  <svg
                    viewBox="0 0 32 32"
                    fill="#EC4815"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-auto -ml-1"
                  >
                    <path d="M18.6466 14.5553C19.9018 13.5141 20.458 7.36086 21.0014 5.14903C21.5447 2.9372 23.7919 3.04938 23.7919 3.04938C23.7919 3.04938 23.2085 4.06764 23.4464 4.82751C23.6844 5.58738 25.3145 6.26662 25.3145 6.26662L24.9629 7.19622C24.9629 7.19622 24.2288 7.10204 23.7919 7.9785C23.355 8.85496 24.3392 17.4442 24.3392 17.4442C24.3392 17.4442 21.4469 22.7275 21.4469 24.9206C21.4469 27.1136 22.4819 28.9515 22.4819 28.9515H21.0296C21.0296 28.9515 18.899 26.4086 18.462 25.1378C18.0251 23.8669 18.1998 22.596 18.1998 22.596C18.1998 22.596 15.8839 22.4646 13.8303 22.596C11.7767 22.7275 10.4072 24.498 10.16 25.4884C9.91287 26.4787 9.81048 28.9515 9.81048 28.9515H8.66211C7.96315 26.7882 7.40803 26.0129 7.70918 24.9206C8.54334 21.8949 8.37949 20.1788 8.18635 19.4145C7.99321 18.6501 6.68552 17.983 6.68552 17.983C7.32609 16.6741 7.97996 16.0452 10.7926 15.9796C13.6052 15.914 17.3915 15.5965 18.6466 14.5553Z" />
                    <path d="M11.1268 24.7939C11.1268 24.7939 11.4236 27.5481 13.0001 28.9516H14.3511C13.0001 27.4166 12.8527 23.4155 12.8527 23.4155C12.1656 23.6399 11.3045 24.3846 11.1268 24.7939Z" />
                  </svg>
                  <span>Tina</span>
                </span>
                <FiMoreVertical
                  className={`flex-0 w-6 h-full inline-block text-gray-500  group-hover:opacity-80 transition-all duration-300 ease-in-out transform ${
                    open ? `opacity-100` : `opacity-30 hover:opacity-50`
                  }`}
                />
              </Menu.Button>
              <div className="transform translate-y-full absolute bottom-3 right-5 z-50">
                <Transition
                  enter="transition duration-150 ease-out"
                  enterFrom="transform opacity-0 -translate-y-2"
                  enterTo="transform opacity-100 translate-y-0"
                  leave="transition duration-75 ease-in"
                  leaveFrom="transform opacity-100 translate-y-0"
                  leaveTo="transform opacity-0 -translate-y-2"
                >
                  <Menu.Items className="bg-white border border-gray-150 rounded-lg shadow-lg">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          className={`text-lg px-4 py-2 first:pt-3 last:pb-3 tracking-wide whitespace-nowrap flex items-center opacity-80 text-gray-600 ${
                            active && 'text-blue-400 bg-gray-50 opacity-100'
                          }`}
                          href="/"
                        >
                          <BiExit className="w-6 h-auto mr-2 text-blue-400" />{' '}
                          Log Out
                        </a>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </div>
            </div>
          )}
        </Menu>
      </div>
      {children}
      <div className="px-6 py-7 flex-1">
        {/* <h4 className="uppercase font-bold text-sm mb-3 text-gray-700">
          Collections
        </h4> */}
        <ul className="flex flex-col gap-4">
          {screens.map((view) => {
            const Icon = view.Icon
            return <NavItem name={view.name} view={view} icon={Icon} />
          })}
        </ul>
      </div>
    </div>
  )
}

const NavItem = ({ name, view, icon }) => {
  const { setMenuIsOpen, setActiveView } = React.useContext(SidebarContext)
  const Icon = icon ? icon : ImFilesEmpty

  return (
    <li>
      <button
        className="text-base tracking-wide text-gray-500 hover:text-blue-600 flex items-center opacity-90 hover:opacity-100"
        key={name}
        value={name}
        onClick={() => {
          setActiveView(view)
          setMenuIsOpen(false)
        }}
      >
        <Icon className="mr-3 h-6 opacity-80 w-auto" /> {name}
      </button>
    </li>
  )
}
