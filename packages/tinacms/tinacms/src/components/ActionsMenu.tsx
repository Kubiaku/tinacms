import * as React from 'react'
import styled, { css } from 'styled-components'
import { EllipsisVerticalIcon } from '@tinacms/icons'
import { padding } from '@tinacms/styles'
import { useState, FC } from 'react'
import { Dismissible } from 'react-dismissible'
import { useFrameContext } from './SyledFrame'

export interface ActionsMenuProps {
  actions: any[]
}

export const ActionsMenu: FC<ActionsMenuProps> = ({ actions }) => {
  const frame = useFrameContext()
  const [actionMenuVisibility, setActionMenuVisibility] = useState(false)
  return (
    <>
      <MoreActionsButton onClick={() => setActionMenuVisibility(p => !p)} />
      <ActionsOverlay open={actionMenuVisibility}>
        <Dismissible
          click
          escape
          disabled={!actionMenuVisibility}
          document={frame.document}
          onDismiss={() => {
            setActionMenuVisibility(p => !p)
          }}
        >
          {actions.map(Action => (
            <Action />
          ))}
        </Dismissible>
      </ActionsOverlay>
    </>
  )
}

const MoreActionsButton = styled(p => (
  <button {...p}>
    <EllipsisVerticalIcon />
  </button>
))`
  height: 100%;
  width: 2rem;
  background-color: transparent;
  background-position: center;
  background-size: auto 1.125rem;
  background-repeat: no-repeat;
  margin-left: -0.5rem;
  margin-right: 0.75rem;
  border: 0;
  outline: none;
  cursor: pointer;
  transition: opacity 85ms ease-out;
  &:hover {
    opacity: 0.6;
  }
`

const ActionsOverlay = styled.div<{ open: boolean }>`
  min-width: 12rem;
  border-radius: 1.5rem;
  border: 1px solid #efefef;
  display: block;
  position: absolute;
  bottom: ${padding()}rem;
  left: ${padding()}rem;
  transform: translate3d(0, 0, 0) scale3d(0.5, 0.5, 1);
  opacity: 0;
  pointer-events: none;
  transition: all 85ms ease-out;
  transform-origin: 0% 100%;
  box-shadow: ${p => p.theme.shadow.big};
  background-color: white;
  overflow: hidden;
  z-index: 100;
  ${props =>
    props.open &&
    css`
      opacity: 1;
      pointer-events: all;
      transform: translate3d(0, -1.75rem, 0) scale3d(1, 1, 1);
    `};
`

export const ActionButton = styled.button`
  position: relative;
  text-align: center;
  font-size: 0.75rem;
  padding: 0.75rem;
  font-weight: 500;
  width: 100%;
  background: none;
  cursor: pointer;
  outline: none;
  border: 0;
  &:after {
    content: '';
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 75ms ease-out;
    background-color: #f8f8f8;
    z-index: -1;
  }
  &:hover {
    &:after {
      opacity: 1;
    }
  }
  &:not(:last-child) {
    border-bottom: 1px solid #efefef;
  }
`
