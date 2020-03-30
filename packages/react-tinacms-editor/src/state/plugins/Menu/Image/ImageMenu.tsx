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

import React, { useState, ChangeEvent } from 'react'
import styled from 'styled-components'
import { EditorView } from 'prosemirror-view'
import { Button } from '@tinacms/styles'
import { Input } from '@tinacms/fields'
import { MediaIcon } from '@tinacms/icons'
import { insertImage } from '../../../../commands/image-commands'
import { MenuButton, MenuButtonDropdown } from '../MenuComponents'
import { Dismissible } from 'react-dismissible'

interface ImageMenu {
  editorView: { view: EditorView }
  uploadImages: (files: File[]) => Promise<string[]>
}

export default ({ editorView, uploadImages }: ImageMenu) => {
  if (!uploadImages) return null

  const [imageUrl, setImageUrl] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const menuButtonRef = React.useRef()

  const uploadImageFile = (file: File) => {
    setUploading(true)
    const uploadPromise = uploadImages([file])
    uploadPromise.then((urls = []) => {
      setImageUrl(urls[0])
      setUploading(false)
    })
  }

  const insertImageInEditor = () => {
    const { state, dispatch } = editorView.view
    insertImage(state, dispatch, imageUrl)
    editorView.view.focus()
    setShowImageModal(false)
    setImageUrl('')
  }

  const uploadSelectedImage = (event: ChangeEvent) => {
    const { files } = event.target as any
    if (files[0]) {
      uploadImageFile(files[0])
    }
  }

  const stopDefault = (evt: React.DragEvent<HTMLSpanElement>) => {
    evt.preventDefault()
    evt.stopPropagation()
  }

  // Check if property name is files or items
  // IE uses 'files' instead of 'items'
  const onImageDrop = (evt: React.DragEvent<HTMLSpanElement>) => {
    stopDefault(evt)
    const { items, files } = evt.dataTransfer
    const data = items || files
    const dataIsItems = !!items
    for (let i = 0; i < data.length; i += 1) {
      if (
        (!dataIsItems || data[i].kind === 'file') &&
        data[i].type.match('^image/')
      ) {
        const file = (dataIsItems ? data[i].getAsFile() : data[i]) as File
        if (file) {
          uploadImageFile(file)
        }
      }
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') setShowImageModal(false)
  }

  return (
    <>
      <MenuButton
        ref={menuButtonRef}
        onClick={() => {
          setShowImageModal(!showImageModal)
          setImageUrl('')
        }}
      >
        <MediaIcon />
      </MenuButton>
      <MenuButtonDropdown
        triggerRef={menuButtonRef}
        open={showImageModal}
        onKeyDown={handleKeyDown}
      >
        <Dismissible
          click
          escape
          disabled={!showImageModal}
          onDismiss={() => {
            setShowImageModal(false)
          }}
        >
          <div onMouseDown={evt => evt.stopPropagation()}>
            <Input onChange={evt => setImageUrl(evt.target.value)}></Input>
          </div>
          <StyledLabel htmlFor="fileInput">
            <FileUploadInput
              id="fileInput"
              onChange={uploadSelectedImage}
              type="file"
              accept="image/*"
            />
            <UploadSection
              onDragEnter={stopDefault}
              onDragOver={stopDefault}
              onDrop={onImageDrop}
              src={imageUrl}
              uploading={uploading}
            >
              {imageUrl && <img src={imageUrl} alt="uploaded_image" />}
              drag and drop
              {uploading && 'UPLOADING'}
            </UploadSection>
          </StyledLabel>
          <Button
            onClick={() => {
              setShowImageModal(false)
            }}
          >
            Cancel
          </Button>
          <Button primary onClick={insertImageInEditor}>
            Upload
          </Button>
        </Dismissible>
      </MenuButtonDropdown>
    </>
  )
}

const UploadSection = styled.div<{ uploading: boolean; src: string }>``

const FileUploadInput = styled.input`
  display: none;
`

const StyledLabel = styled.label``
