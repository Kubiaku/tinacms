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
import styled, { keyframes } from 'styled-components'

type E = React.ChangeEvent<HTMLInputElement>

interface Props {
  // title: string | null
  href: string | null
  onChange(attrs: any): void
  removeLink(): void
  cancel(): void
  style?: {
    [key: string]: string
  }
}

interface State {
  href: string | null
  // title: string | null
}

export class InnerForm extends React.Component<Props, State> {
  state = {
    href: this.props.href || '',
    // title: this.props.title || '',
  }

  inputRef = React.createRef<HTMLInputElement>()

  componentDidMount() {
    document.addEventListener('keydown', this.onEscapeCancel)
    if (this.inputRef.current) this.inputRef.current.focus()
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onEscapeCancel)
  }

  componentDidUpdate(prevProps: Props) {
    const { href } = this.props
    if (href !== prevProps.href) this.setState(() => ({ href }))
  }

  closeModal() {
    const { href } = this.state
    const { cancel, removeLink, href: originalHref } = this.props
    if (!href && !originalHref) removeLink()
    cancel()
  }

  setHref = ({ target: { value } }: E) => this.setState(() => ({ href: value }))
  // setTitle = ({ target: { value } }: E) =>
  //   this.setState(() => ({ title: value }))

  save = () => this.props.onChange(this.state)

  onEnterSave = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.save()
    }
  }

  onEscapeCancel = (e: KeyboardEvent) => {
    if (e.keyCode === 27) {
      this.closeModal()
    }
  }

  render() {
    const { removeLink, style = {} } = this.props
    const { href } = this.state
    return (
      <LinkPopup
        style={{
          ...style,
        }}
      >
        {/*<LinkLabel>Title</LinkLabel>
         <LinkInput
          placeholder="Enter Title"
          type={'text'}
          value={title}
          onChange={this.setTitle}
          onKeyPress={this.onEnterSave as any}
        /> */}
        <LinkLabel>URL</LinkLabel>
        <LinkInput
          ref={this.inputRef}
          placeholder="Enter URL"
          type={'text'}
          value={href}
          onChange={this.setHref}
          onKeyPress={this.onEnterSave as any}
        />
        <LinkActions>
          <DeleteLink onClick={removeLink}>Delete</DeleteLink>
          <SaveLink onClick={this.save} disabled={!href}>
            Save
          </SaveLink>
        </LinkActions>
      </LinkPopup>
    )
  }
}

const LinkPopupKeyframes = keyframes`
  0% {
    transform: scale3d(0.5,0.5,1)
  }
  100% {
    transform: scale3d(1, 1, 1);
  }
`

const LinkPopup = styled.div`
  background-color: #f6f6f9;
  position: relative;
  height: max-content;
  border-radius: var(--tina-radius-small);
  border: 1px solid var(--tina-color-grey-2);
  filter: drop-shadow(0px 4px 8px rgba(48, 48, 48, 0.1))
    drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.12));
  transform-origin: 50% 0;
  animation: ${LinkPopupKeyframes} 85ms ease-out both 1;
  overflow: visible;
  padding: 12px;
  z-index: 10;
`

const LinkLabel = styled.label`
  display: block;
  font-size: var(--tina-font-size-1);
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--tina-color-grey-8);
  margin-bottom: 3px;
`

const LinkInput = styled.input`
  position: relative;
  background-color: white;
  border-radius: var(--tina-radius-small);
  font-size: var(--tina-font-size-1);
  line-height: 1.35;
  transition: all 85ms ease-out;
  padding: 8px 12px;
  border: 1px solid var(--tina-color-grey-2);
  width: 100%;
  margin: 0 0 8px 0;
  outline: none;
  box-shadow: 0 0 0 2px transparent;

  &:hover {
    box-shadow: 0 0 0 2px var(--tina-color-grey-3);
  }

  &:focus {
    box-shadow: 0 0 0 2px #0084ff;
  }

  &::placeholder {
    font-size: var(--tina-font-size-2);
    color: #cfd3d7;
  }
`

const LinkActions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
`

const SaveLink = styled.button`
  text-align: center;
  border: 0;
  border-radius: var(--tina-radius-big);
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.12);
  background-color: #0084ff;
  color: white;
  font-weight: var(--tina-font-weight-regular);
  cursor: pointer;
  transition: all 85ms ease-out;
  font-size: var(--tina-font-size-0);
  padding: 8px 20px;
  margin-left: 8px;
  &:hover {
    background-color: #2296fe;
  }
  &:active {
    background-color: #0574e4;
  }
  &:disabled {
    background-color: #d1d1d1;
    box-shadow: none;
  }
`

const DeleteLink = styled.button`
  text-align: center;
  border: 1px solid var(--tina-color-grey-2);
  border-radius: var(--tina-radius-big);
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.12);
  background-color: white;
  color: #0084ff;
  font-weight: var(--tina-font-weight-regular);
  cursor: pointer;
  transition: all 85ms ease-out;
  font-size: var(--tina-font-size-0);
  padding: 8px 20px;
  margin-left: 8px;
  &:hover {
    background-color: #f6f6f9;
    opacity: 1;
  }
  &:active {
    background-color: #0574e4;
  }
`
