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
import styled from 'styled-components'
import { InlineField } from '../inline-field'
import { useCMS, Form, Media, MediaStore, usePreviewSrc } from 'tinacms'
import { useDropzone } from 'react-dropzone'
import { FocusRing, FocusRingOptions } from '../styles'

export interface InlineImageProps {
  name: string
  parse(media: Media): string
  uploadDir?(form: Form): string
  previewSrc?: MediaStore['previewSrc']
  focusRing?: boolean | FocusRingOptions
  className?: string
  alt?: string
  children?: ImageRenderChildren
}

/**
 * @deprecated
 * @alias InlineImage
 */
export const InlineImageField = InlineImage

export function InlineImage(props: InlineImageProps) {
  const cms = useCMS()

  return (
    <InlineField name={props.name} parse={props.parse}>
      {({ input, form }) => {
        if (cms.enabled) {
          return <EditableImage {...props} input={input} form={form} />
        }

        return (
          <NonEditableImage
            children={props.children}
            src={input.value}
            alt={props.alt}
            className={props.className}
          />
        )
      }}
    </InlineField>
  )
}

interface EditableImageProps extends InlineImageProps {
  input: any
  form: Form
}

function EditableImage({
  form,
  input,
  name,
  previewSrc,
  uploadDir,
  children,
  focusRing = true,
  alt = '',
  className,
}: EditableImageProps) {
  const cms = useCMS()

  const [_previewSrc] = usePreviewSrc(
    input.value,
    name,
    form.values,
    previewSrc
  )

  async function handleUploadImage([file]: File[]) {
    const directory = uploadDir ? uploadDir(form) : ''

    const [media] = await cms.media.persist([
      {
        directory,
        file,
      },
    ])

    if (media) {
      input.onChange(media)
    }

    return null
  }

  return (
    <FocusRing name={name} options={focusRing}>
      <InlineImageUpload
        src={_previewSrc}
        alt={alt}
        onDrop={handleUploadImage}
        onClick={() =>
          cms.media.open({
            onSelect(media: any) {
              if (media.filename == input.value) {
                input.onChange('') // trigger rerender
              }
              input.onChange(media)
            },
          })
        }
        className={className}
      >
        {children}
      </InlineImageUpload>
    </FocusRing>
  )
}

interface ImageRenderChildrenProps {
  src?: string
}

type ImageRenderChildren = (props: ImageRenderChildrenProps) => React.ReactNode

interface InlineImageUploadProps {
  src?: string
  alt?: string
  className?: string
  onClick(): void
  onDrop(acceptedFiles: any[]): void
  children?: ImageRenderChildren
}

function InlineImageUpload({
  src,
  alt,
  className,
  onClick,
  onDrop,
  children,
}: InlineImageUploadProps) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop,
    noClick: !!onClick,
  })

  if (!src) return <ImagePlaceholder />

  return (
    <Container {...getRootProps()} onClick={onClick} className={className}>
      <input {...getInputProps()} />
      {children ? children({ src }) : <img src={src} alt={alt} />}
    </Container>
  )
}

interface NonEditableImageProps {
  src?: string
  alt?: string
  className?: string
  children?: ImageRenderChildren
}

function NonEditableImage({
  src,
  alt,
  className,
  children,
}: NonEditableImageProps) {
  return (
    <Container className={className}>
      {children ? children({ src }) : <img src={src} alt={alt} />}
    </Container>
  )
}

function ImagePlaceholder() {
  // TODO: style this component
  return (
    <div>
      Drag 'n' drop some files here,
      <br />
      or click to select files
    </div>
  )
}

const Container = styled.div`
  width: inherit;
  height: inherit;
`
