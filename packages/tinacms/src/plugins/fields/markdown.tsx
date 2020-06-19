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
import { FieldMeta } from '@tinacms/fields'
import styled from 'styled-components'

export const DateFieldPlaceholder = {
  __type: 'field',
  name: 'date',
  Component: createPlaceholder('Date'),
}

export const MarkdownFieldPlaceholder = {
  __type: 'field',
  name: 'markdown',
  Component: createPlaceholder('Markdown'),
}

export const HtmlFieldPlaceholder = {
  __type: 'field',
  name: 'html',
  Component: createPlaceholder('HTML'),
}

const PlaceholderParagraph = styled.p`
  white-space: normal;
  font-size: var(--tina-font-size-2);
  margin: 8px 0 0 0;

  a {
    color: var(--tina-color-primary);
  }
`

function createPlaceholder(name: string) {
  return (props: any) => {
    return (
      <FieldMeta name={props.input.name} label={`Deprecated: ${name} Field`}>
        <PlaceholderParagraph>
          In order to help improve bundle sizes the {name} Field has been
          removed from the set of default fields.
        </PlaceholderParagraph>
        <PlaceholderParagraph>
          See the docs to learn how to{' '}
          <a
            href="https://tinacms.org/docs/cms/plugins#adding-plugins"
            target="_blank"
            rel="noreferrer noopener"
          >
            add the {name} plugin
          </a>{' '}
          to your CMS.
        </PlaceholderParagraph>
        <PlaceholderParagraph>
          Visit the{' '}
          <a
            href="https://github.com/tinacms/tinacms/pull/1134"
            target="_blank"
            rel="noreferrer noopener"
          >
            Pull Request
          </a>{' '}
          to learn more about why this change was made.
        </PlaceholderParagraph>
      </FieldMeta>
    )
  }
}
