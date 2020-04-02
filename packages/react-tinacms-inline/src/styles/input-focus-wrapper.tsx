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

import styled from 'styled-components'

export const InputFocusWrapper = styled.div`
  position: relative;

  &:focus-within {
    &:after {
      opacity: 1;
    }
  }

  &:hover:not(:focus-within) {
    &:after {
      opacity: 0.3;
    }
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    left: -16px;
    top: -16px;
    width: calc(100% + 32px);
    height: calc(100% + 32px);
    border: 3px solid var(--tina-color-primary);
    border-radius: var(--tina-radius-big);
    opacity: 0;
    pointer-events: none;
    transition: all var(--tina-timing-medium) ease-out;
  }
`
